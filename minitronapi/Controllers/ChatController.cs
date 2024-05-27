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
    private readonly TokenService _tokenService;
    private readonly ILogger<ChatController> _logger;


    public ChatController(minitronContext context, RequestService requestService, ConversationService conversationService, ILogger<ChatController> logger, TokenService tokenService)
    {
      _context = context;
      _requestService = requestService;
      _conversationService = conversationService;
      _logger = logger;
      _tokenService = tokenService;
    }

    [HttpPost("Sendmessage")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequestModel request)
    {
      // Retrieve the token from HttpOnly cookies
      var authResult = await _tokenService.AuthenticateUser();

      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }

      var userId = authResult.UserId;

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

      Console.WriteLine(request.Conversation);
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
      //return Ok(request.Conversation);
    }

    [HttpPost("SendMessageToOpenAI")]
    public async Task<IActionResult> SendMessageToOpenAI([FromBody] SendMessageRequestModel request)
    {
      var authResult = await _tokenService.AuthenticateUser();

      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }

      var userId = authResult.UserId;

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

      if (request.Conversation == null)
      {
        request.Conversation = new List<ChatMessage>();
      }

      if (request.Conversation[0].Role != "system")
      {
        request.Conversation.Insert(0, new ChatMessage { Role = "system", Content = "Welcome! I will help you create a custom system prompt for your AI assistant. I'll ask you a series of questions to understand your requirements and preferences. Let's get started! 1. Purpose and Goals, What is the primary purpose of your AI assistant?, What are the main goals you want to achieve with this assistant? 2. Target Audience, Who will be using this AI assistant?, Are there any specific characteristics or needs of this audience? 3. Tone and Style, How formal or informal should the AI assistant's tone be?, Should the assistant have any particular personality traits? 4. Key Functions and Capabilities, What specific functions should the assistant perform?, Are there any particular capabilities or features you want to emphasize? 5. Content and Knowledge Scope, What topics or areas should the assistant focus on?, Are there any topics that should be avoided? 6. Interaction Preferences, How should the assistant handle complex or unclear queries?, Are there any specific interaction styles or behaviors you prefer? 7. Privacy and Security, Are there any privacy or security considerations the assistant should be aware of?, How should the assistant handle sensitive information? 8. Example Scenarios, Can you provide some example scenarios or queries the assistant should handle?, How should the assistant respond in these scenarios?. When the interview is complete, I will check if you are satisfied with the responses. If you respond positively, I will generate and send the new system prompt as a single string with nothing ese included." });
      }

      var response = await _requestService.SendMessageToOpenAI(request.Conversation);

      //var formattedResponse = _requestService.FormatResponse(response);

      return Ok(new { response });//= formattedResponse });
    }

    [HttpPost("StartConversation")]
    public async Task<IActionResult> StartConversation()
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
        return NotFound("User not found");
      }

      var newConversation = new ConversationModel()
      {
        UserId = userId,
        Timestamp = DateTime.UtcNow
      };

      var conversationMessages = new List<ChatMessage>();
      await _conversationService.SaveConversationToDatabase(newConversation, conversationMessages);

      _logger.LogInformation("New conversation started with id: {conversationId}", newConversation.ConversationId);

      return Ok(new { conversationId = newConversation.ConversationId });
    }


    [HttpGet("GetConversationDetails")]
    public async Task<IActionResult> GetConversationDetails(int conversationId)
    {
      var authResult = await _tokenService.AuthenticateUser();
      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }

      var conversation = await _conversationService.GetConversationById(conversationId);

      var userId = authResult.UserId;
      if (conversation.UserId != userId)
      {
        return Unauthorized("User not authorized to view this conversation");
      }

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
      var authResult = await _tokenService.AuthenticateUser();
      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }

      var userId = authResult.UserId;

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
      var authResult = await _tokenService.AuthenticateUser();
      if (authResult == null || !authResult.Success)
      {
        return Unauthorized("No authentication token found");
      }

      var userId = authResult.UserId;

      var conversation = await _conversationService.GetConversationById(conversationId);

      if (conversation.UserId != userId)
      {
        return Unauthorized("User not authorized to delete this conversation");
      }

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