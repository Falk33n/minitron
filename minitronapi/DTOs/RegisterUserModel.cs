using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace minitronapi.DTOs
{
    public class RegisterUserModel
    {
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? Password { get; set; }
    }
}