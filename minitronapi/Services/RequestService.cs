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
            var apiKey = "sk-proj-W3Yvq9YJyksvTSYSpnYpT3BlbkFJg9itGMyBWylglX9aOR91";
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

            if (conversation[0].Role != "system")
            {
                conversation.Insert(0, new ChatMessage { Role = "system", Content = user.DefaultSystemPrompt });
            }
            // Assuming the conversation already includes the system prompt and user messages

            var data = new
            {
                messages = conversation.Select(m => new { role = m.Role, content = m.Content }).ToArray(),
                model = "/mnt/model/"
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


        public string FormatResponse(string input)
        {
            var result = Regex.Replace(input, @"\[.*?\]", "");
            result = Regex.Replace(result, @"<<.*?>>", "");

            // Replace '\n' with <br>
            result = result.Replace("\n", "<br>");

            return result;
        }

        // Classes for deserializing the response from OpenAI
    }
}
