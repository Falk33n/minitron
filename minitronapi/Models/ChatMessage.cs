// Purpose: Model for chat messages.

namespace minitronapi.Models
{
    public class ChatMessage
    {
        public string? Role { get; set; } = "user"
        public string? Content { get; set; }
    }
}
