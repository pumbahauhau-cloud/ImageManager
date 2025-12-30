import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Rating } from '../../services/api.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {


  folders: string[] = [];
  selectedFolder: string = '';
  images: string[] = [];
  selectedImage: string = '';
  selectedFiles: File[] = [];
  currentIndex: number = 0;
 // For upload section
  uploadFolder: string = '';

  rating: Rating = {
    folder: '',
    image: '',
    name: '',
    tag: '',
    ratingPhoto: 0,
    ratingLight: 0,
    ratingBackground: 0,
    misc1: 0,
    misc2: 0
  };
  
  username: string = 'User'; // you can replace 'User' dynamically later

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadFolders();
  }

  /** Logout and go back to login page */
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
previousImage() {
  if (!this.images.length) return;

  this.currentIndex =
    (this.currentIndex - 1 + this.images.length) % this.images.length;

  this.selectImage(this.images[this.currentIndex]);
}

nextImage() {
  if (!this.images.length) return;

  this.currentIndex =
    (this.currentIndex + 1) % this.images.length;

  this.selectImage(this.images[this.currentIndex]);
}



hasPrevious(): boolean {
  const index = this.images.indexOf(this.selectedImage);
  return index > 0;
}

hasNext(): boolean {
    const index = this.images.indexOf(this.selectedImage);
  return index < this.images.length - 1 && index !== -1;
}

  /** Load folders from API */
  loadFolders() {
    this.api.getFolders().subscribe(f => {
      this.folders = f;
      if (f.length > 0 && !this.selectedFolder) {
        this.selectedFolder = f[0];
        this.loadImages();
      }
    });
  }

  createFolder(folderName: string) {
  if (!folderName || folderName.trim() === '') return;

  folderName = folderName.trim();

  this.api.createFolder(folderName).subscribe({
    next: () => {
      this.folders.push(folderName);
      this.selectedFolder = folderName;
      this.images = [];
    },
    error: (err) => {
      console.error('Error creating folder', err);
      alert('Failed to create folder: ' + (err.error || err.message));
    }
  });
}


  /** Delete a folder */
  deleteFolder(name: string) {
    if (!name) return;
    this.api.deleteFolder(name).subscribe(() => {
      this.loadFolders();
      this.images = [];
      this.selectedImage = '';
    });
  }

  /** Load images for selected folder */
  loadImages() {
  this.api.getImages(this.selectedFolder).subscribe(images => {
    this.images = images;

    if (this.images.length > 0) {
      this.currentIndex = 0;
      this.selectImage(this.images[0]);
    } else {
      this.selectedImage = '';
    }
  });
}


  /** Select an image */
selectImage(image: string) {
  this.selectedImage = image;
  this.currentIndex = this.images.indexOf(image);

  // safety fallback
  if (this.currentIndex === -1) {
    this.currentIndex = 0;
    this.selectedImage = this.images[0];
  }

  this.loadRating(); // or whatever loads rating
}


  /** Load rating for selected image */
  loadRating() {
    if (!this.selectedFolder || !this.selectedImage) return;
    this.api.getRating(this.selectedFolder, this.selectedImage).subscribe(r => {
      this.rating = {
        folder: this.selectedFolder,
        image: this.selectedImage,
        name: r.name || '',
        tag: r.tag || '',
        ratingPhoto: r.rating_Photo || 0,
        ratingLight: r.rating_Light || 0,
        ratingBackground: r.rating_Background || 0,
        misc1: r.rating_misc1 || 0,
        misc2: r.rating_misc2 || 0
      };
    });
  }

  /** Save rating for selected image */
  saveRating() {
    this.api.saveRating(this.rating).subscribe(() => {
      alert('Rating saved successfully!');
    });
  }

  /** Handle file selection */
  onFileSelected(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  /** Upload selected images */
uploadImages() {
  if (!this.selectedFolder || this.selectedFiles.length === 0) return;

  this.api.uploadImages(this.selectedFolder, this.selectedFiles).subscribe({
    next: () => {
      alert('Images uploaded successfully!');
      this.selectedFiles = [];       // clear the file input
      // Do NOT load images or select any image
    },
    error: (err) => alert(err.error || 'Upload failed')
  });
}
  /** Move image to another folder */
  moveImage(targetFolder: string) {
    if (!this.selectedImage || !targetFolder) return;
    this.api.moveImage(this.selectedImage, this.selectedFolder, targetFolder)
      .subscribe(() => this.loadImages());
  }

  /** Get image URL for display */
  getImageUrl(): string {
    if (!this.selectedFolder || !this.selectedImage) return '';
    return this.api.getImageUrl(this.selectedFolder, this.selectedImage);
  }
}
