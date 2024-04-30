// Purpose: Service for communicating with OpenAI API.
using minitronapi.Models;
using minitronapi.Services;
using System.Text;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace minitronapi.Services
{
    public class RequestService
    {
        // Private fields
        private readonly HttpClient _httpClient;

        // Constructor using dependency injection
        public RequestService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("http://192.168.90.99:5003/v1/");
            // Get the API key from the configuration/user secrets
            var apiKey = configuration["OpenAI:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("OpenAI API key is missing.");
            }

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
        }

        public async Task<string> SendMessage(List<ChatMessage> conversation)
        {
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
