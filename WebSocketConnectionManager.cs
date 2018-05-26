using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace Pong
{
    public class WebSocketConnectionManager
    {
        public WebSocketConnectionManager()
        {
            Sockets = new ConcurrentDictionary<string, WebSocket>();
        }

        public ConcurrentDictionary<string, WebSocket> Sockets { get; }

        public void AddSocket(WebSocket socket)
        {
            Sockets.TryAdd(CreateConnectionId(), socket);
        }

        public string GetId(WebSocket socket)
        {
            return Sockets.FirstOrDefault(s => s.Value.Equals(socket)).Key;
        }

        public async Task RemoveSocket(WebSocket socket)
        {
            Sockets.TryRemove(GetId(socket), out socket);
            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
        }

        private string CreateConnectionId()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
