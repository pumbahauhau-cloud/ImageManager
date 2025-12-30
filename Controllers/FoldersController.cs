using Microsoft.AspNetCore.Mvc;

namespace ImageManager.Api.Controllers
{
    [ApiController]
    [Route("api/folders")]
    public class FoldersController : ControllerBase
    {
        private readonly string baseDir = "managed_folders";

        public FoldersController()
        {
            // Ensure base folder exists
            if (!Directory.Exists(baseDir))
            {
                Directory.CreateDirectory(baseDir);
            }
        }

        /// <summary>
        /// Get all folder names
        /// GET: api/folders
        /// </summary>
        [HttpGet]
        public IActionResult GetFolders()
        {
            var folders = Directory.GetDirectories(baseDir)
                                   .Select(Path.GetFileName)
                                   .ToList();
            return Ok(folders);
        }

        /// <summary>
        /// Create a new folder
        /// POST: api/folders?name=FolderName
        /// </summary>
        [HttpPost]
        public IActionResult CreateFolder([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Folder name is required.");

            var path = Path.Combine(baseDir, name);

            if (Directory.Exists(path))
                return Conflict($"Folder '{name}' already exists.");

            Directory.CreateDirectory(path);
            return Ok($"Folder '{name}' created successfully.");
        }

        /// <summary>
        /// Delete a folder by name
        /// DELETE: api/folders/{name}
        /// </summary>
        [HttpDelete("{name}")]
        public IActionResult DeleteFolder(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Folder name is required.");

            var path = Path.Combine(baseDir, name);

            if (!Directory.Exists(path))
                return NotFound($"Folder '{name}' not found.");

            Directory.Delete(path, true);
            return Ok($"Folder '{name}' deleted successfully.");
        }
    }
}
