using Microsoft.AspNetCore.Mvc;

namespace ImageManager.Api.Controllers
{
    [ApiController]
    [Route("api/images")]
    public class ImagesController : ControllerBase
    {
        private readonly string baseDir = Path.Combine(Directory.GetCurrentDirectory(), "managed_folders");

        // GET: api/images/{folder}  <-- new endpoint
        [HttpGet("{folder}")]
        public IActionResult GetImages(string folder)
        {
            var path = Path.Combine(baseDir, folder);

            if (!Directory.Exists(path))
                return NotFound("Folder not found.");

            var images = Directory.GetFiles(path)
                .Where(f => f.EndsWith(".jpg") || f.EndsWith(".jpeg") || f.EndsWith(".png"))
                .Select(Path.GetFileName)
                .ToList();

            return Ok(images);
        }

        // GET: api/images/file?folder=testfolder&image=filename.jpg
        [HttpGet("file")]
        public IActionResult GetImageFile([FromQuery] string folder, [FromQuery] string image)
        {
            var path = Path.Combine(baseDir, folder, image);

            if (!System.IO.File.Exists(path))
                return NotFound("Image not found.");

            var mime = "image/jpeg";
            if (image.EndsWith(".png")) mime = "image/png";

            var fileBytes = System.IO.File.ReadAllBytes(path);
            return File(fileBytes, mime);
        }

        // POST: api/images/upload
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] string folder, [FromForm] List<IFormFile> files)
        {
            var path = Path.Combine(baseDir, folder);

            if (!Directory.Exists(path))
                return NotFound("Folder not found.");

            foreach (var file in files)
            {
                var filePath = Path.Combine(path, file.FileName);
                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);
            }

            return Ok("Images uploaded successfully.");
        }

        // POST: api/images/move
        [HttpPost("move")]
        public IActionResult MoveImage([FromQuery] string image, [FromQuery] string fromFolder, [FromQuery] string toFolder)
        {
            var sourcePath = Path.Combine(baseDir, fromFolder, image);
            var destPath = Path.Combine(baseDir, toFolder, image);

            if (!System.IO.File.Exists(sourcePath))
                return NotFound("Image not found.");

            System.IO.File.Move(sourcePath, destPath);
            return Ok("Image moved.");
        }
    }
}
