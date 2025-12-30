using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ImageManager.Api.Controllers
{
    [ApiController]
    [Route("api/ratings")]
    public class RatingsController : ControllerBase
    {
        private readonly string ratingsFile = "ratings.json";

        // Load ratings from file safely
        private Dictionary<string, Dictionary<string, object>> LoadRatings()
        {
            if (!System.IO.File.Exists(ratingsFile))
                return new Dictionary<string, Dictionary<string, object>>();

            var json = System.IO.File.ReadAllText(ratingsFile);
            if (string.IsNullOrWhiteSpace(json))
                return new Dictionary<string, Dictionary<string, object>>();

            try
            {
                return JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, object>>>(json)
                       ?? new Dictionary<string, Dictionary<string, object>>();
            }
            catch
            {
                // If JSON is invalid, reset to empty dictionary
                return new Dictionary<string, Dictionary<string, object>>();
            }
        }

        // GET: api/ratings/all
        [HttpGet("all")]
        public IActionResult GetAllRatings()
        {
            var ratings = LoadRatings();
            return Ok(ratings); // returns the full dictionary
        }


        // Save ratings back to file
        private void SaveRatings(Dictionary<string, Dictionary<string, object>> ratings)
        {
            var json = JsonSerializer.Serialize(ratings, new JsonSerializerOptions { WriteIndented = true });
            System.IO.File.WriteAllText(ratingsFile, json);
        }

        // GET: api/ratings?folder=FolderName&image=image.jpg
        [HttpGet]
        public IActionResult GetRating([FromQuery] string folder, [FromQuery] string image)
        {
            if (string.IsNullOrWhiteSpace(folder) || string.IsNullOrWhiteSpace(image))
                return BadRequest("Folder and image parameters are required.");

            var ratings = LoadRatings();
            var key = $"{folder}/{image}";

            if (ratings.ContainsKey(key))
                return Ok(ratings[key]);

            return Ok(new { }); // return empty object if not rated
        }

        // POST: api/ratings
        [HttpPost]
        public IActionResult SaveRating([FromBody] RatingModel rating)
        {
            if (rating == null || string.IsNullOrWhiteSpace(rating.Folder) || string.IsNullOrWhiteSpace(rating.Image))
                return BadRequest("Invalid rating data.");

            var ratings = LoadRatings();
            var key = $"{rating.Folder}/{rating.Image}";

            ratings[key] = new Dictionary<string, object>
            {
                { "name", rating.Name },
                { "tag", rating.Tag },
                { "rating_Photo", rating.RatingPhoto },
                { "rating_Light", rating.RatingLight },
                { "rating_Background", rating.RatingBackground },
                { "rating_misc1", rating.Misc1 },
                { "rating_misc2", rating.Misc1 }
            };

            SaveRatings(ratings);
            return Ok(new { message = "Rating saved successfully." });
        }
    }

    // Model for rating
    public class RatingModel
    {
        public string Folder { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Tag { get; set; } = string.Empty;
        public int RatingPhoto { get; set; }
        public int RatingLight { get; set; }
        public int RatingBackground { get; set; }
        public int Misc1 { get; set; }
        public int Misc2 { get; set; }
    }
}
