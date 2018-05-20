using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
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
        private ConcurrentDictionary<string, WebSocket> sockets;

        public WebSocketsMiddleware(RequestDelegate next)
        {
            this.next = next;
            sockets = new ConcurrentDictionary<string, WebSocket>();
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                await next.Invoke(context);
                return;
            }

            CancellationToken ct = context.RequestAborted;
            WebSocket currentSocket = await context.WebSockets.AcceptWebSocketAsync();
            var socketId = Guid.NewGuid().ToString();

            sockets.TryAdd(socketId, currentSocket);

            while (true)
            {
                if (ct.IsCancellationRequested)
                {
                    break;
                }

                var response = socketId + ": " + await ReceiveStringAsync(currentSocket, ct);

                if (string.IsNullOrEmpty(response))
                {
                    if (currentSocket.State == WebSocketState.Closed)
                    {
                        break;
                    }

                    continue;
                }

                foreach (var socket in sockets)
                {
                    if (socket.Value.State != WebSocketState.Open)
                    {
                        continue;
                    }

                    await SendStringAsync(socket.Value, response, ct);
                }
            }

            sockets.TryRemove(socketId, out WebSocket dummy);

            await currentSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", ct);
            currentSocket.Dispose();
        }

        private Task SendStringAsync(WebSocket socket, string data, CancellationToken ct)
        {
            var buffer = Encoding.UTF8.GetBytes(data);
            var segment = new ArraySegment<byte>(buffer);
            return socket.SendAsync(segment, WebSocketMessageType.Text, true, ct);
        }

        private async Task<string> ReceiveStringAsync(WebSocket socket, CancellationToken ct)
        {
            var buffer = new ArraySegment<byte>(new byte[8192]);
            using (var ms = new MemoryStream())
            {
                WebSocketReceiveResult result;
                do
                {
                    ct.ThrowIfCancellationRequested();

                    result = await socket.ReceiveAsync(buffer, ct);
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
