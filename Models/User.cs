namespace ImageManager.Api.Models
{
    public class User
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // For demo purposes only. In production, hash passwords!
    }
}
