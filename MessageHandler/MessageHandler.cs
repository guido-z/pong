using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;

namespace Pong.MessageHandler
{
    public class MessageHandler : IMessageHandler
    {
        private IDictionary<string, Func<IDictionary<string, WebSocket>, WebSocket, Message, MessageResponse>> messageHandlingStrategy;

        public MessageHandler()
        {
            messageHandlingStrategy = new Dictionary<string, Func<IDictionary<string, WebSocket>, WebSocket, Message, MessageResponse>>()
            {
                { MessageTypes.playerNumber, SetPlayerNumber },
                { MessageTypes.updatePaddlePosition, UpdatePaddlePosition }
            };
        }

        public MessageResponse HandleMessage(IDictionary<string, WebSocket> sockets, WebSocket currentSocket, string message)
        {
            var obj = JsonConvert.DeserializeObject<Message>(message);
            return messageHandlingStrategy[obj.Operation]?.Invoke(sockets, currentSocket, obj);
        }

        private MessageResponse SetPlayerNumber(IDictionary<string, WebSocket> sockets, WebSocket currentSocket, Message message)
        {
            return new MessageResponse()
            {
                Clients = sockets.Values.Take(2),
                Data = new { Message = message.Operation, PlayerNumber = sockets.Count <= 2 ? sockets.Count : 0 }
            };
        }

        private MessageResponse UpdatePaddlePosition(IDictionary<string, WebSocket> sockets, WebSocket currentSocket, Message message)
        {
            var payload = message.GetData<UpdatePaddlePositionData>();

            return new MessageResponse()
            {
                Clients = sockets.Values.Where(socket => !socket.Equals(currentSocket)),
                Data = new
                {
                    Message = message.Operation,
                    payload.PlayerNumber,
                    payload.Position
                }
            };
        }
    }
}
