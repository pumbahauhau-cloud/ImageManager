using System.Text.Json;
using ImageManager.Api.Models;

namespace ImageManager.Api.Services
{
    public class UserService
    {
        private readonly string userFile = "users.json";

        private List<User> LoadUsers()
        {
            if (!System.IO.File.Exists(userFile))
                return new List<User>();

            var json = System.IO.File.ReadAllText(userFile);
            if (string.IsNullOrWhiteSpace(json))
                return new List<User>();

            try
            {
                return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
            }
            catch
            {
                return new List<User>();
            }
        }

        private void SaveUsers(List<User> users)
        {
            var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(userFile, json);
        }

        public bool Register(User user)
        {
            var users = LoadUsers();
            if (users.Any(u => u.Username == user.Username))
                return false;

            users.Add(user);
            SaveUsers(users);
            return true;
        }

        public User? Authenticate(string username, string password)
        {
            var users = LoadUsers();
            return users.FirstOrDefault(u => u.Username == username && u.Password == password);
        }
    }
}
