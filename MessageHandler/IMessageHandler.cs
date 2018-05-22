using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace Pong.MessageHandler
{
    public interface IMessageHandler
    {
        MessageResponse HandleMessage(IDictionary<string, WebSocket> sockets, WebSocket currentSocket, string message);
    }
}
