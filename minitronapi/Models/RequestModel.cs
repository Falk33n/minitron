// Purpose: Model for Request data.

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace minitronapi.Models
{
    public class RequestModel
    {
        [Key]
        public int RequestId { get; set; } // Primary key for the request table
        public string Request { get; set; } = ""; // The request from the user
        public string RequestPrompt { get; set; } = ""; // The prompt for the request, entire previous messagelist in the conversation
        public DateTime TimeStamp { get; set; } // The time the request was sent
        public string CustomSystemPrompt { get; set; } = "You are a helpful assistant"; // The custom system prompt for the user
        public string Model { get; set; } = "/mnt/model"; // The model of the user

        [ForeignKey("ConversationId")]
        public int ConversationId { get; set; } // Foreign key for the conversation table
        [JsonIgnore]
        public ConversationModel? Conversation { get; set; } // Navigation property for the conversation table

    }
}