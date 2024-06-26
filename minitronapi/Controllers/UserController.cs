using Microsoft.AspNetCore.Mvc;
using minitronapi.Data;
using minitronapi.DTOs;
using minitronapi.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using minitronapi.Services;

namespace minitronapi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly minitronContext _context;
    private readonly UserManager<UserModel> _userManager;
    private readonly ILogger<UserController> _logger;
    private readonly TokenService _tokenService;

    public UserController(minitronContext context, UserManager<UserModel> userManager, ILogger<UserController> logger, TokenService tokenService)
    {
      _context = context;
      _userManager = userManager;
      _logger = logger;
      _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserModel model)
    {
      if (ModelState.IsValid)
      {
        var user = new UserModel
        {
          Email = model.Email,
          UserName = model.Email, // Often the email is used as the UserName
          FullName = model.FullName!
        };

        var result = await _userManager.CreateAsync(user, model.Password!);

        if (result.Succeeded)
        {
          // Map the user entity to a DTO, omitting the password for security
          var userDto = new GetUserModel
          {
            Email = user.Email,
            FullName = user.FullName
          };
          _logger.LogInformation("HTTP {option} User {user} registered at {time}", "POST", user.Email, DateTime.UtcNow);
          return Ok(userDto);
        }
        else
        {
          return BadRequest(result.Errors);
        }
      }
      return BadRequest(ModelState);
    }

    [HttpGet("getbyid/{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
      var isAdmin = await _tokenService.IsUserAdmin();

      if (!isAdmin)
      {
        return Unauthorized("User is not admin");
      }

      var user = await _userManager.FindByIdAsync(id);
      if (user == null)
      {
        return NotFound();
      }

      var userDto = new GetUserModel
      {
        Email = user.Email,
        FullName = user.FullName
      };
      _logger.LogInformation("HTTP {option} User {user} retrieved at {time}", "GET", user.Email, DateTime.UtcNow);
      return Ok(userDto);
    }


    [HttpGet("getall")]
    public async Task<IActionResult> GetAllUsers()
    {

      var isAdmin = await _tokenService.IsUserAdmin();

      if (!isAdmin)
      {
        return Unauthorized("User is not admin");
      }

      var users = await _context.Users.ToListAsync();
      var userDtos = users.Select(user => new GetUserModel
      {
        Email = user.Email,
        FullName = user.FullName,
        Id = user.Id
      }).ToList();
      _logger.LogInformation("HTTP {option} All users retrieved at {time}", "GET", DateTime.UtcNow);
      return Ok(userDtos);
    }


    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
      var authResult = await _tokenService.AuthenticateUser();
      var user = await _context.Users.FindAsync(id);
      if (user == null)
      {
        return NotFound();
      }
      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }
      var userId = authResult.UserId;

      var conversations = await _context.Conversations.Where(c => c.UserId == user.Id).ToListAsync();
      var requests = conversations.SelectMany(c => c.RequestList).ToList();
      var responses = conversations.SelectMany(c => c.ResponseList).ToList();

      if (requests.Count > 0)
      {
        _context.Requests.RemoveRange(requests);
      }
      if (responses.Count > 0)
      {
        _context.Responses.RemoveRange(responses);
      }
      _context.Conversations.RemoveRange(conversations);
      _context.Users.Remove(user);
      await _context.SaveChangesAsync();
      _logger.LogInformation("HTTP {option} User {user} deleted at {time}", "DELETE", user.Email, DateTime.UtcNow);
      return NoContent();
    }

    [HttpDelete("deletebyemail/{email}")]
    public async Task<IActionResult> DeleteUserByEmail(string email)
    {
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
      if (user == null)
      {
        return NotFound();
      }
      var conversations = await _context.Conversations.Where(c => c.UserId == user.Id).ToListAsync();
      var requests = conversations.SelectMany(c => c.RequestList).ToList();
      var responses = conversations.SelectMany(c => c.ResponseList).ToList();

      if (requests.Count > 0)
      {
        _context.Requests.RemoveRange(requests);
      }
      if (responses.Count > 0)
      {
        _context.Responses.RemoveRange(responses);
      }
      _context.Conversations.RemoveRange(conversations);
      _context.Users.Remove(user);
      await _context.SaveChangesAsync();

      _logger.LogInformation("HTTP {option} User {user} deleted at {time}", "DELETE", user.Email, DateTime.UtcNow);
      return NoContent();
    }

    [HttpGet("getcurrentuser")]
    public async Task<IActionResult> GetCurrentUser()
    {
      var token = Request.Cookies["AuthCookie"];
      if (string.IsNullOrEmpty(token))
      {
        return Unauthorized();
      }

      // Decode JWT token
      var handler = new JwtSecurityTokenHandler();
      JwtSecurityToken jwtToken;
      try
      {
        jwtToken = handler.ReadJwtToken(token);
      }
      catch (Exception ex)
      {
        // Handle decoding errors (token invalid, expired, etc.)
        return BadRequest("Invalid token." + ex.Message);
      }

      // Extract user identifier from JWT claims (e.g., email or user ID)
      var userEmail = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;

      // Testing purposes: print all claims
      foreach (var claim in jwtToken.Claims)
      {
        Console.WriteLine($"Claim type: {claim.Type}, value: {claim.Value}");
      }

      if (string.IsNullOrEmpty(userEmail))
      {
        return Unauthorized("User not found.");
      }

      // Retrieve user by email
      var user = await _userManager.FindByEmailAsync(userEmail);
      if (user == null)
      {
        return NotFound();
      }

      var userDto = new GetUserModel
      {
        Email = user.Email,
        FullName = user.FullName,
        Id = user.Id
      };
      _logger.LogInformation("HTTP {option} User {user} retrieved at {time}", "GET", user.Email, DateTime.UtcNow);
      return Ok(userDto);
    }

    [HttpPatch("SetCustomSystemPrompt")]
    public async Task<IActionResult> SetCustomSystemPrompt(string prompt, string id)
    {
      var user = await _userManager.FindByIdAsync(id);
      if (user == null)
      {
        return NotFound();
      }
      user.DefaultSystemPrompt = prompt;
      await _userManager.UpdateAsync(user);
      _logger.LogInformation("HTTP {option} User {user} set custom system prompt to '{customPrompt}' at {time}", "PATCH", user.Email, prompt, DateTime.UtcNow);
      return Ok("Custom system prompt set successfully.");
    }

    [HttpGet("GetCustomSystemPrompt")]
    public async Task<IActionResult> GetCustomSystemPrompt(string id)
    {
      var user = await _userManager.FindByIdAsync(id);
      if (user == null)
      {
        return NotFound();
      }
      _logger.LogInformation("HTTP {option} User {user} retrieved custom system prompt at {time}", "GET", user.Email, DateTime.UtcNow);
      return Ok(user.DefaultSystemPrompt);
    }

    [HttpPatch("MakeAdmin")]
    public async Task<IActionResult> MakeAdmin(string id)
    {
      var authResult = await _tokenService.AuthenticateUser();
      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }
      var userId = authResult.UserId;
      var user = await _context.Users.FindAsync(userId);
      var userToEdit = await _userManager.FindByIdAsync(id);
      if (user == null)
      {
        return NotFound("No user found");
      }
      //check if the user making the call is admin
      if (!await _userManager.IsInRoleAsync(user, "Admin"))
      {
        return Unauthorized("User is not admin");
      }
      if (userToEdit == null)
      {
        return NotFound("No user to edit found");
      }
      await _userManager.AddToRoleAsync(userToEdit, "Admin");
      await _userManager.UpdateAsync(userToEdit);

      return Ok($"user {userToEdit!.FullName} is now admin");
    }

    [HttpGet("IsAdmin")]
    public async Task<IActionResult> IsAdmin()
    {
      var authResult = await _tokenService.AuthenticateUser();
      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }
      var userId = authResult.UserId;
      var user = await _context.Users.FindAsync(userId);
      if (user == null)
      {
        return NotFound("No user found");
      }
      if (await _userManager.IsInRoleAsync(user, "Admin"))
      {
        return Ok(true);
      }
      else
      {
        return Ok(false);
      }
    }
    [HttpPatch("EditUser")]
    public async Task<IActionResult> EditUser(EditUserModel model)
    {
      var userId = model.UserId;
      var user = await _context.Users.FindAsync(userId);

      user!.FullName = model.FullName!;
      user.Email = model.Email;

      _context.Users.Update(user);
      await _context.SaveChangesAsync();

      return Ok("User updated successfully!");

    }
  }
}