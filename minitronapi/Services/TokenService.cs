using System.Security.Claims;
using minitronapi.Data;
using minitronapi.DTOs;
using minitronapi.Models;
using minitronapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace minitronapi.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<UserModel> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly minitronContext _context;

        public TokenService(IConfiguration config, UserManager<UserModel> userManager, IHttpContextAccessor httpContextAccessor, minitronContext context)
        {
            _config = config;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public async Task<string> CreateToken(UserModel user)
        {
            // JWT Payload
            var claims = new List<Claim>
            {
                new Claim("userId", user.Id!),
                new Claim("email", user.Email!),
                new Claim("fullName", user.FullName!)
            };

            // Get the roles for the user
            var roles = await _userManager.GetRolesAsync(user);

            // Add the roles to the claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            // Payload complete

            // Signature and encryption
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["tokensettings:tokenKey"]!));

            // Create the signing credentials, Sha512 is the hashing algorithm
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Create the token descriptor
            var options = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds
            );

            // Create the token handler
            var tokenHandler = new JwtSecurityTokenHandler();

            // Create the token
            var token = tokenHandler.WriteToken(options);

            // Return the token
            return token;
        }

        public bool ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["tokensettings:tokenKey"]!);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<AuthResult> AuthenticateUser()
        {
            var token = _httpContextAccessor.HttpContext!.Request.Cookies["AuthCookie"];
            if (string.IsNullOrEmpty(token))
            {
                return new AuthResult { Success = false, ErrorMessage = "No authentication token found" };
            }

            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken;
            try
            {
                jwtToken = handler.ReadJwtToken(token);
            }
            catch (Exception)
            {
                return new AuthResult { Success = false, ErrorMessage = "Error trying to read JWT token" };
            }

            var userId = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "userId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return new AuthResult { Success = false, ErrorMessage = "Claim not found" };
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return new AuthResult { Success = false, ErrorMessage = "User not found" };
            }

            return new AuthResult { Success = true, UserId = userId };
        }
    }
}