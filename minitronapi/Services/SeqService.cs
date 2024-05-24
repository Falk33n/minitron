using Newtonsoft.Json;

namespace minitronapi.Services

{
  public class SeqService
  {
    private readonly HttpClient _httpClient;
    private readonly string _seqUrl = "http://192.168.90.99:5341/api/";
    private readonly string _apiKey = "oEcKLfFDIdD0jJWRBLch";

    public SeqService(HttpClient httpClient)
    {
      _httpClient = httpClient;
    }

    public async Task<string> GetLogsAsync()
    {
      var requestUri = $"{_seqUrl}events/signal?signal=signal-26&count=20&apiKey={_apiKey}";
      HttpResponseMessage response = await _httpClient.GetAsync(requestUri);
      if (response.IsSuccessStatusCode)
      {
        return await response.Content.ReadAsStringAsync();
      }
      return null!;
    }

    public async Task<string> GetLogsBySignalAsync(string signalId)
    {
      var requestUri = $"{_seqUrl}events/signal?signal=signal-{signalId}&count=20&apiKey={_apiKey}";
      HttpResponseMessage response = await _httpClient.GetAsync(requestUri);
      if (response.IsSuccessStatusCode)
      {
        return await response.Content.ReadAsStringAsync();
      }
      return null!;
    }
  }
}