using Microsoft.AspNetCore.Mvc;
using minitronapi.Data;
using minitronapi.Models;
using minitronapi.Services;

namespace minitronapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgentController : ControllerBase
    {
        private readonly minitronContext _context;
        private readonly TokenService _tokenService;

        public AgentController(minitronContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("CreateAgent")]
        public async Task<IActionResult> CreateAgent(string id, string name, string description, string systemPrompt, string tone, string style)
        {
            var agent = new AgentModel
            {
                Name = name,
                Description = description,
                SystemPrompt = systemPrompt,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Version = 1.0f,
                Tone = tone,
                UserId = id,
            };
            await _context.Agents.AddAsync(agent);
            await _context.SaveChangesAsync();

            return Ok(agent);
        }

        [HttpGet("GetAllAgents")]
        public IActionResult GetAllAgents()
        {
            var agents = _context.Agents.ToList();
            return Ok(agents);
        }

        [HttpGet("GetAgentsByUserId/{id}")]
        public async Task<IActionResult> GetAgentsByUserId()
        {
            var authResult = await _tokenService.AuthenticateUser();
            if (authResult == null)
            {
                return Unauthorized();
            }
            var userId = authResult.UserId;
            var user = await _context.Users.FindAsync(userId);
            //var agents = await _context.Agents.Select(a => a.UserId == userId).;
            return Ok(user);
        }

        [HttpGet("GetAgentById/{id}")]
        public IActionResult GetAgentById(string id)
        {
            return Ok("Get Agent by Id");
        }

        [HttpDelete("DeleteAgent/{id}")]
        public IActionResult DeleteAgent(string id)
        {
            return Ok("Delete Agent");
        }

        [HttpPatch("UpdateAgent/{id}")]
        public IActionResult UpdateAgent(string id, string name, string description, string systemPrompt)
        {
            return Ok("Update Agent");
        }
    }
}