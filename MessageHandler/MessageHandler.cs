using System;
using System.Collections.Generic;
using System.Net.WebSockets;

namespace Pong.MessageHandler
{
    public class MessageHandler : IMessageHandler
    {
        private IDictionary<string, Func<IDictionary<string, WebSocket>, WebSocket, MessageResponse>> messageHandlingStrategy;

        public MessageHandler()
        {
            messageHandlingStrategy = new Dictionary<string, Func<IDictionary<string, WebSocket>, WebSocket, MessageResponse>>()
            {
                { MessageTypes.playerNumber, SetPlayerNumber }
            };
        }

        public MessageResponse HandleMessage(IDictionary<string, WebSocket> sockets, WebSocket currentSocket, string message)
        {
            return messageHandlingStrategy[message]?.Invoke(sockets, currentSocket);
        }

        private MessageResponse SetPlayerNumber(IDictionary<string, WebSocket> sockets, WebSocket currentSocket)
        {
            return new MessageResponse()
            {
                Clients = new List<WebSocket>() { currentSocket },
                Data = new { PlayerNumber = sockets.Count <= 2 ? sockets.Count : 0 }
            };
        }
    }
}
