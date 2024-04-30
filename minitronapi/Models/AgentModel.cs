namespace minitronapi.Models
{
    public class AgentModel
    {
        // Basic props
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public float Version { get; set; }

        // Config props
        public string? Model { get; set; } = "/mnt/model";
        public string? Language { get; set; } = "english";
        public string? SystemPrompt { get; set; }

        //  Behavior props
        public string? Tone { get; set; }
        public string? Style { get; set; }

        // User props
        public string? UserId { get; set; } // Assuming UserId is a string since it inherits from IdentityUser
        public virtual UserModel? User { get; set; } // Virtual for lazy loading

        // Timestamps
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
