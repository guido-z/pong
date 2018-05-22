using System.Collections.Generic;
using System.Net.WebSockets;

namespace Pong.MessageHandler
{
    public class MessageResponse
    {
        public IEnumerable<WebSocket> Clients { get; set; }
        public object Data { get; set; }
    }
}
