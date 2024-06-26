// Purpose: Model for the Conversation table in the database.

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace minitronapi.Models
{
    public class ConversationModel
    {
        // Properties

        [Key]
        public int ConversationId { get; set; } // Primary key for the conversation table
        public IEnumerable<RequestModel> RequestList { get; set; } = new List<RequestModel>(); // List of requests in the conversation
        public IEnumerable<ResponseModel> ResponseList { get; set; } = new List<ResponseModel>(); // List of responses in the conversation
        public DateTime Timestamp { get; set; } // The time the conversation started

        // Navigation Properties
        [ForeignKey("UserId")]
        public string? UserId { get; set; } // Foreign key for the user table
        [InverseProperty("ConversationList")]
        public UserModel? User { get; set; } // Navigation property for the user table
    }
}