using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace minitronapi.Models
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public string? UserId { get; set; }
        public string? ErrorMessage { get; set; }
    }
}