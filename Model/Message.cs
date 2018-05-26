using Newtonsoft.Json.Linq;

namespace Pong
{
    public class Message
    {
        public string Operation { get; set; }
        public object Data { get; set; }

        public T GetData<T>()
        {
            return ((JObject)Data).ToObject<T>();
        }
    }
}
