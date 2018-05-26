using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Pong;
using Pong.MessageHandler;
using System;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebSockets.Middleware
{
    public class WebSocketsMiddleware
    {
        private RequestDelegate next;
        private WebSocketConnectionManager manager;
        private IMessageHandler messageHandler;

        public WebSocketsMiddleware(RequestDelegate next, WebSocketConnectionManager manager, IMessageHandler messageHandler)
        {
            this.next = next;
            this.manager = manager;
            this.messageHandler = messageHandler;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                return;
            }

            WebSocket currentSocket = await context.WebSockets.AcceptWebSocketAsync();
            manager.AddSocket(currentSocket);

            while (true)
            {
                var message = await ReceiveStringAsync(currentSocket);

                if (string.IsNullOrEmpty(message))
                {
                    break;
                }

                MessageResponse response = messageHandler.HandleMessage(manager.Sockets, currentSocket, message);

                foreach (var socket in response.Clients)
                {
                    await SendStringAsync(socket, JsonConvert.SerializeObject(response.Data), CancellationToken.None);
                }
            }

            await manager.RemoveSocket(currentSocket);
        }

        private Task SendStringAsync(WebSocket socket, string data, CancellationToken ct)
        {
            var buffer = Encoding.UTF8.GetBytes(data);
            var segment = new ArraySegment<byte>(buffer);
            return socket.SendAsync(segment, WebSocketMessageType.Text, true, ct);
        }

        private async Task<string> ReceiveStringAsync(WebSocket socket)
        {
            var buffer = new ArraySegment<byte>(new byte[8192]);
            using (var ms = new MemoryStream())
            {
                WebSocketReceiveResult result;
                do
                {
                    result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                }
                while (!result.EndOfMessage);

                ms.Seek(0, SeekOrigin.Begin);
                if (result.MessageType != WebSocketMessageType.Text)
                {
                    return null;
                }

                // Encoding UTF8: https://tools.ietf.org/html/rfc6455#section-5.6
                using (var reader = new StreamReader(ms, Encoding.UTF8))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }
    }
}
