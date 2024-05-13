using Microsoft.AspNetCore.Mvc;
using minitronapi.Services;

namespace minitronapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly SeqService _seqService;

        public LogsController(SeqService seqService)
        {
            _seqService = seqService;
        }

        [HttpGet("getlogs")]
        public async Task<IActionResult> GetLogs()
        {
            var logsJson = await _seqService.GetLogsAsync();
            if (logsJson != null)
            {
                return new ContentResult
                {
                    Content = logsJson,
                    ContentType = "application/json",
                    StatusCode = 200
                };
            }
            return NotFound();
        }
    }
}