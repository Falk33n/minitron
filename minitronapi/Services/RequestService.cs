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

            if (conversation[0].Role != "system")
            {
                conversation.Insert(0, new ChatMessage { Role = "system", Content = "Welcome! I will help you create a custom system prompt for your AI assistant. I'll ask you a series of questions to understand your requirements and preferences. Let's get started! 1. Purpose and Goals, What is the primary purpose of your AI assistant?, What are the main goals you want to achieve with this assistant? 2. Target Audience, Who will be using this AI assistant?, Are there any specific characteristics or needs of this audience? 3. Tone and Style, How formal or informal should the AI assistant's tone be?, Should the assistant have any particular personality traits? 4. Key Functions and Capabilities, What specific functions should the assistant perform?, Are there any particular capabilities or features you want to emphasize? 5. Content and Knowledge Scope, What topics or areas should the assistant focus on?, Are there any topics that should be avoided? 6. Interaction Preferences, How should the assistant handle complex or unclear queries?, Are there any specific interaction styles or behaviors you prefer? 7. Privacy and Security, Are there any privacy or security considerations the assistant should be aware of?, How should the assistant handle sensitive information? 8. Example Scenarios, Can you provide some example scenarios or queries the assistant should handle?, How should the assistant respond in these scenarios?. When the interview is complete, I will check if you are satisfied with the responses. If you respond positively, I will generate and send the new system prompt." });
            }

            var data = new
            {
                messages = conversation.Select(m => new { role = m.Role, content = m.Content }).ToArray(),
                model = "gpt-3.5-turbo"
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

            // Replace '\n' with <br>
            result = result.Replace("\n", "<br>");

            return result;
        }

        // Classes for deserializing the response from OpenAI
    }
}
