using System.Text;
using minitronapi.Data;
using minitronapi.Models;
using minitronapi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);


// Add DB Connection

var host = builder.Configuration["PostgreSQL:Host"];
var port = builder.Configuration["PostgreSQL:Port"];
var database = builder.Configuration["PostgreSQL:Database"];
var username = builder.Configuration["PostgreSQL:Username"];
var password = builder.Configuration["PostgreSQL:Password"];

var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password}";
var tokenKeyString = builder.Configuration["tokenSettings:tokenKey"];

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Warning()
    .WriteTo.File("Logs/all-logs.txt", rollingInterval: RollingInterval.Day)
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(e => e.Properties.ContainsKey("SourceContext") &&
                                     e.Properties["SourceContext"].ToString().Contains("AuthController"))
        .WriteTo.File("Logs/auth-logs.txt", rollingInterval: RollingInterval.Day))
        .WriteTo.Seq("http://192.168.90.99:5341")
    .WriteTo.Logger(lc => lc
    .Filter.ByIncludingOnly(e => e.Properties.ContainsKey("SourceContext") &&
                                 e.Properties["SourceContext"].ToString().Contains("UserController"))
    .WriteTo.File("Logs/user-logs.txt", rollingInterval: RollingInterval.Day))
    .WriteTo.Seq("http://192.168.90.99:5341")
    .WriteTo.Logger(lc => lc
    .Filter.ByIncludingOnly(e => e.Properties.ContainsKey("SourceContext") &&
                                 e.Properties["SourceContext"].ToString().Contains("ChatController"))
    .WriteTo.File("Logs/chat-logs.txt", rollingInterval: RollingInterval.Day))
    .WriteTo.Seq("http://192.168.90.99:5341")
    .CreateLogger();


builder.Host.UseSerilog();

builder.Services.AddDbContext<minitronContext>(options =>
    options.UseNpgsql(connectionString));

// add Cors, open for localhost:3000  
builder.Services.AddCors(options =>
{
  options.AddPolicy("OpenCorsPolicy", builder =>
  {
    builder.WithOrigins("http://localhost:3000")
           .AllowAnyHeader()
           .AllowAnyMethod();
  });
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddIdentityCore<UserModel>(options =>
{
  options.Password.RequireDigit = false;
  options.Password.RequiredLength = 6;
  options.Password.RequireLowercase = false;
  options.Password.RequireUppercase = false;
  options.Password.RequireNonAlphanumeric = false;
}).AddRoles<IdentityRole>()
  .AddEntityFrameworkStores<minitronContext>()
  .AddDefaultTokenProviders();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new() { Title = "minitronapi", Version = "v1" });
});
builder.Services.AddScoped<SignInManager<UserModel>>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient();
builder.Services.AddScoped<RequestService>();
builder.Services.AddScoped<ConversationService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("tokenSettings:tokenKey"))
      };
    })
    .AddCookie(IdentityConstants.ApplicationScheme, options =>
      {
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(1);
        options.LoginPath = "/api/Auth/login"; // Adjust as necessary
        options.LogoutPath = "/api/Auth/logout"; // Adjust as necessary
      }); ;

// Add Authorization Policies
builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
  options.AddPolicy("User", policy => policy.RequireRole("User"));
});

builder.Services.AddHttpClient<SeqService>();



var app = builder.Build();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<minitronContext>();
var userManager = services.GetRequiredService<UserManager<UserModel>>();
var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

// Migrate the database
await context.Database.MigrateAsync();
await SeedData.LoadRoles(roleManager);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
  app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("OpenCorsPolicy");
app.UseSerilogRequestLogging();

app.MapControllers();


app.Run();