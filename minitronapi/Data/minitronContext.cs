using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using minitronapi.Models;

namespace minitronapi.Data
{
    public class minitronContext : IdentityDbContext<UserModel>
    {
        public DbSet<ConversationModel> Conversations { get; set; }
        public DbSet<RequestModel> Requests { get; set; }
        public DbSet<ResponseModel> Responses { get; set; }
        public DbSet<AgentModel> Agents { get; set; } // Ensure Agents DbSet is included

        public minitronContext(DbContextOptions<minitronContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UserModel configuration
            modelBuilder.Entity<UserModel>()
               .HasMany(u => u.ConversationList)
               .WithOne(c => c.User)
               .HasForeignKey(c => c.UserId)
               .IsRequired();

            // ConversationModel configuration
            modelBuilder.Entity<ConversationModel>()
                .HasMany(c => c.RequestList)
                .WithOne(r => r.Conversation)
                .HasForeignKey(r => r.ConversationId)
                .IsRequired();

            modelBuilder.Entity<ConversationModel>()
                .HasMany(c => c.ResponseList)
                .WithOne(r => r.Conversation)
                .HasForeignKey(r => r.ConversationId)
                .IsRequired();

            // AgentModel relationship with UserModel
            modelBuilder.Entity<UserModel>()
                .HasMany(u => u.Agents)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .IsRequired(); // This ensures every agent is linked to a user

            // Additional configurations for AgentModel as needed
            // For example, you can configure default values or constraints for certain properties
        }
    }
}
