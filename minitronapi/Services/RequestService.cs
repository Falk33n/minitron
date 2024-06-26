// Purpose: Service for communicating with OpenAI API.
using minitronapi.Models;
using minitronapi.Services;
using System.Text;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using minitronapi.Data;

namespace minitronapi.Services
{
  public class RequestService
  {
    // Private fields
    private readonly HttpClient _httpClient;
    private readonly TokenService _tokenService;
    private readonly minitronContext _context;

    // Constructor using dependency injection
    public RequestService(IHttpClientFactory httpClientFactory, IConfiguration configuration, TokenService tokenService, minitronContext context)
    {
      _httpClient = httpClientFactory.CreateClient();
      //_httpClient.BaseAddress = new Uri("https://api.openai.com/v1/");
      _httpClient.BaseAddress = new Uri("http://192.168.90.99:5003/v1/");
      var apiKey = "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";
      _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
      _tokenService = tokenService;
      _context = context;
    }

    public async Task<string> SendMessage(List<ChatMessage> conversation)
    {
      var authResult = await _tokenService.AuthenticateUser();

      if (authResult == null || !authResult.Success)
      {
        return "No authentication token found";
      }

      var userId = authResult.UserId;
      var user = await _context.Users.FindAsync(userId);

      if (user == null)
      {
        return "User not found";
      }

      var data = new
      {
        messages = conversation.Select(m => new { role = m.Role, content = m.Content }).ToArray(),
        model = "/mnt/model/",
        max_tokens = 100,
        temperature = 0.2,
      };

      var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");

      var response = await _httpClient.PostAsync("chat/completions", content);

      if (response.IsSuccessStatusCode)
      {
        var responseString = await response.Content.ReadAsStringAsync();
        var responseObject = JsonConvert.DeserializeObject<AIResponse>(responseString)!;
        return responseObject.Choices?[0].Message?.Content ?? "";
      }
      else
      {
        var errorResponse = await response.Content.ReadAsStringAsync();
        throw new Exception($"OpenAI API call failed: {response.StatusCode}, Details: {errorResponse}");
      }
    }

    public async Task<string> SendMessageToOpenAI(List<ChatMessage> conversation)
    {

      var data = new
      {
        messages = conversation.Select(m => new { role = m.Role, content = m.Content }).ToArray(),
        model = "gpt-4",
        temperature = 0.5
      };

      // Create the content
      var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");

      _httpClient.BaseAddress = new Uri("https://api.openai.com/v1/");
      // Send the message
      var response = await _httpClient.PostAsync("chat/completions", content);

      // Check if the response was successful
      if (response.IsSuccessStatusCode)
      {
        // Read the response
        var responseString = await response.Content.ReadAsStringAsync();
        var responseObject = JsonConvert.DeserializeObject<AIResponse>(responseString)!;
        // Return the response
        return responseObject.Choices?[0].Message?.Content ?? "";
      }
      else
      {
        // Read the error response
        var errorResponse = await response.Content.ReadAsStringAsync();
        throw new Exception($"OpenAI API call failed: {response.StatusCode}, Details: {errorResponse}");
      }
    }

    public string FormatResponse(string input)
    {
      var result = Regex.Replace(input, @"\[.*?\]", "");
      result = Regex.Replace(result, @"<<.*?>>", "");
      result = Regex.Replace(result, @"<br\s*?>", "\n", RegexOptions.Multiline);

      return result;
    }

    // Classes for deserializing the response from OpenAI
  }
}
