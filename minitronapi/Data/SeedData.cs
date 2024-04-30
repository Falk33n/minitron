using Microsoft.AspNetCore.Identity;

namespace minitronapi.Data
{
    public class SeedData
    {
        public static async Task LoadRoles(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var admin = new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                };
                var user = new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER"
                };

                await roleManager.CreateAsync(admin);
                await roleManager.CreateAsync(user);
            }
        }
    }
}