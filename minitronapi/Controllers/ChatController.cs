using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using minitronapi.Data;
using minitronapi.DTOs;
using minitronapi.Models;
using minitronapi.Services;
using Microsoft.AspNetCore.Mvc;

namespace minitronapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly minitronContext _context;
        private readonly RequestService _requestService;
        private readonly ConversationService _conversationService;
        private readonly ILogger<ChatController> _logger;


        public ChatController(minitronContext context, RequestService requestService, ConversationService conversationService, ILogger<ChatController> logger)
        {
            _context = context;
            _requestService = requestService;
            _conversationService = conversationService;
            _logger = logger;
        }


        [HttpPost("Sendmessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequestModel request)
        {
            // Retrieve the token from HttpOnly cookies
            var token = Request.Cookies["AuthCookie"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("No authentication token found");
            }

            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken;
            try
            {
                jwtToken = handler.ReadJwtToken(token);
            }
            catch (Exception)
            {
                return Unauthorized("Error trying to read JWT token");
            }

            var userId = jwtToken.Claims.First(claim => claim.Type == "userId").Value;
            if (userId == null)
            {
                return Unauthorized("Claim not found");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Unauthorized("User not found");
            }

            if (!request.ConversationId.HasValue)
            {
                var newConversation = new ConversationModel()
                {
                    UserId = userId,
                    Timestamp = DateTime.UtcNow,
                };
                await _conversationService.SaveConversationToDatabase(newConversation);
                request.ConversationId = newConversation.ConversationId;
            }

            // Prepare the conversation with the custom system prompt at the beginning
            if (request.Conversation == null)
            {
                request.Conversation = new List<ChatMessage>();
            }
            // Send the conversation to the AI
            var response = await _requestService.SendMessage(request.Conversation);

            // Format the response
            var formattedResponse = _requestService.FormatResponse(response);

            // Save the request and response to the database
            var newRequest = new RequestModel
            {
                ConversationId = request.ConversationId.Value,
                Request = request.Conversation.Last().Content!,
                TimeStamp = DateTime.UtcNow,
            };

            var newResponse = new ResponseModel
            {
                ConversationId = request.ConversationId.Value,
                Response = formattedResponse,
                TimeStamp = DateTime.UtcNow
            };

            await _conversationService.SaveRequestToDatabase(newRequest);
            await _conversationService.SaveResponseToDatabase(newResponse);
            _logger.LogInformation("Request and response saved to database");
            return Ok(new { response = formattedResponse });
        }

        [HttpPost("StartConversation")]
        public async Task<IActionResult> StartConversation()
        {

            var token = Request.Cookies["AuthCookie"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("No authentication token found");
            }

            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken;
            try
            {
                jwtToken = handler.ReadJwtToken(token);
            }
            catch (Exception)
            {
                return Unauthorized("Error trying to read JWT token");
            }

            var userId = jwtToken.Claims.First(claim => claim.Type == "userId").Value;

            var newConversation = new ConversationModel()
            {
                UserId = userId,
                Timestamp = DateTime.UtcNow
            };
            await _conversationService.SaveConversationToDatabase(newConversation);

            _logger.LogInformation("New conversation started with id: {conversationId}", newConversation.ConversationId);

            return Ok(new { conversationId = newConversation.ConversationId });
        }

        [HttpGet("GetConversationById")]
        public async Task<IActionResult> GetConversationById(int conversationId)
        {
            var conversation = await _conversationService.GetConversationById(conversationId);

            if (conversation == null)
            {
                return NotFound($"Conversation with id: {conversationId} not found");
            }

            return Ok(conversation);
        }

        [HttpGet("GetConversationDetails")]
        public async Task<IActionResult> GetConversationDetails(int conversationId)
        {
            var conversation = await _conversationService.GetConversationById(conversationId);

            if (conversation == null)
            {
                return NotFound($"Conversation with id: {conversationId} not found");
            }

            var requests = await _conversationService.GetRequestsByConversationId(conversationId);
            var responses = await _conversationService.GetResponsesByConversationId(conversationId);

            if (!requests.Any() && !responses.Any())
            {
                return NotFound($"No requests or responses found for conversation with id: {conversationId}");
            }

            var conversationDTO = new ConversationDTO()
            {
                ConversationId = conversation.ConversationId,
                Requests = requests.Select(r => r.Request).ToList(),
                Responses = responses.Select(r => new ResponseModel()
                {
                    Response = r.Response,
                    ResponseId = r.ResponseId,
                    UserRating = r.UserRating
                }).ToList(),
                Timestamp = requests.First().TimeStamp
            };

            return Ok(conversationDTO);
        }

        [HttpGet("GetAllConversationsByUserId")]
        public async Task<IActionResult> GetAllConversationsByUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized("User not found");
            }

            var conversations = await _conversationService.GetConversationsByUserId(userId);
            var conversationsReqRes = new List<ConversationDTO>();

            foreach (var conversation in conversations)
            {
                var requests = await _conversationService.GetRequestsByConversationId(conversation.ConversationId);
                var responses = await _conversationService.GetResponsesByConversationId(conversation.ConversationId);

                if (!requests.Any() && !responses.Any())
                {
                    continue;
                }

                var DTO = new ConversationDTO()
                {
                    ConversationId = conversation.ConversationId,
                    Requests = requests.Select(r => r.Request).ToList(),
                    Responses = responses.Select(r => new ResponseModel
                    {
                        ResponseId = r.ResponseId,
                        Response = r.Response,
                    }).ToList(),
                    Timestamp = conversation.Timestamp
                };
                conversationsReqRes.Add(DTO);
            };

            return Ok(conversationsReqRes);
        }

        [HttpDelete("DeleteConversationById")]
        public async Task<IActionResult> DeleteConversationById(int conversationId)
        {
            var conversation = await _conversationService.GetConversationById(conversationId);

            if (conversation == null)
            {
                return NotFound($"Conversation with id: {conversationId} not found");
            }

            await _conversationService.DeleteConversationById(conversationId);
            _logger.LogInformation("Conversation with id: {conversationId} deleted successfully", conversationId);
            return Ok($"Conversation with id: {conversationId} deleted successfully");
        }
    }
}