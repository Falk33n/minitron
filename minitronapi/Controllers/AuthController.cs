using minitronapi.DTOs;
using minitronapi.Models;
using minitronapi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.IdentityModel.Tokens.Jwt;

namespace minitronapi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly UserManager<UserModel> _userManager;
    private readonly SignInManager<UserModel> _signInManager;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<UserModel> userManager, SignInManager<UserModel> signInManager, TokenService tokenService, ILogger<AuthController> logger)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _tokenService = tokenService;
      _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserModel model)
    {

      var user = await _userManager.FindByEmailAsync(model.Email!);
      if (user != null && await _userManager.CheckPasswordAsync(user, model.Password!))
      {
        var token = await _tokenService.CreateToken(user);

        Response.Cookies.Append("AuthCookie", token, new CookieOptions
        {
          HttpOnly = true,
          SameSite = SameSiteMode.Lax,
          Expires = DateTimeOffset.UtcNow.AddHours(1),
          Path = "/"
        });

        _logger.LogInformation("HTTP {option} User {user} logged in at {time}", "POST", user.Email, DateTime.UtcNow);

        return Ok(new { Message = "Success", token });
      }

      return Unauthorized("Failed to login");
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
      var time = DateTime.UtcNow;
      var token = Request.Cookies["AuthCookie"];
      var handler = new JwtSecurityTokenHandler();
      var user = handler.ReadJwtToken(token).Claims.First(claim => claim.Type == "email").Value;

      Response.Cookies.Delete("AuthCookie");
      await _signInManager.SignOutAsync();
      _logger.LogInformation("HTTP {option} User {user} logged out at {time}", "POST", user, time);
      return Ok(new { Message = "Success" });
    }

    [HttpGet("session")]
    public IActionResult CheckSession()
    {
      var token = Request.Cookies["AuthCookie"];
      var handler = new JwtSecurityTokenHandler();
      var user = handler.ReadJwtToken(token).Claims.First(claim => claim.Type == "email").Value;

      if (string.IsNullOrEmpty(token))
      {
        return Unauthorized(false);
      }

      bool isValidToken = _tokenService.ValidateToken(token);
      if (!isValidToken)
      {
        return Unauthorized(false);
      }
      _logger.LogInformation("HTTP {option} User {user} session is valid", "GET", user);
      return Ok(true);
    }
  }
}