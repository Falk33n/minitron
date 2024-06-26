// Purpose: Model for the request to send a message to the ai.

namespace minitronapi.Models
{
    public class SendMessageRequestModel
    {
        public List<ChatMessage>? Conversation { get; set; }
        public int? ConversationId { get; set; }
    }
}