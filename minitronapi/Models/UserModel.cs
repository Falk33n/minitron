// Purpose: Model for the user table in the database. Contains all the information for a user.

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace minitronapi.Models
{
    public class UserModel : IdentityUser
    {
        public string FullName { get; set; } = ""; // Full name of the user

        public IEnumerable<ConversationModel> ConversationList { get; set; } = new List<ConversationModel>(); // List of conversations the user has been in
        public virtual ICollection<AgentModel> Agents { get; set; } = new List<AgentModel>(); // List of agents the user has created
        public string DefaultSystemPrompt { get; set; } = "You are a helpful assistant"; // Default system prompt for the user
    }
}