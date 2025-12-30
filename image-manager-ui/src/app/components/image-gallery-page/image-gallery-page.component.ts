import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Rating } from '../../services/api.service';

@Component({
  selector: 'app-image-gallery-page',
  templateUrl: './image-gallery-page.component.html',
  styleUrls: ['./image-gallery-page.component.css']
})
export class ImageGalleryPageComponent implements OnInit {
  folders: string[] = [];
  selectedFolder: string = '';
  images: string[] = [];
  selectedImage: string = '';
  currentIndex: number = 0;
  slideshowActive: boolean = false;
  slideshowInterval: any;
  slideshowFullscreen: boolean = false;
  slideshowDelay: number = 2500; 

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

  username: string = 'User';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadFolders();
  }
startFullscreenSlideshow() {
  if (!this.selectedFolder || this.images.length === 0) return;

  this.slideshowFullscreen = true;

  // clear any existing interval
  if (this.slideshowInterval) clearInterval(this.slideshowInterval);

  // start automatic slideshow
  this.slideshowInterval = setInterval(() => {
    this.nextImage();
  }, this.slideshowDelay);
}

// Exit fullscreen slideshow
exitFullscreen() {
  this.slideshowFullscreen = false;
  if (this.slideshowInterval) {
    clearInterval(this.slideshowInterval);
    this.slideshowInterval = null;
  }
}

// Navigate manually while slideshow is running
prevSlideshowImage(event: Event) {
  event.stopPropagation(); // prevent closing fullscreen
  this.previousImage();
}

nextSlideshowImage(event: Event) {
  event.stopPropagation();
  this.nextImage();
}



  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loadFolders() {
    this.api.getFolders().subscribe(f => {
      this.folders = f;
      if (f.length > 0 && !this.selectedFolder) {
        this.selectedFolder = f[0];
        this.loadImages();
      }
    });
  }

  loadImages() {
    if (!this.selectedFolder) return;
    this.api.getImages(this.selectedFolder).subscribe(images => {
      this.images = images;
      this.selectedImage = images.length > 0 ? images[0] : '';
      this.currentIndex = 0;
      this.loadRating();
    });
  }

  selectImage(image: string) {
    this.selectedImage = image;
    this.currentIndex = this.images.indexOf(image);
    this.loadRating();
  }

  previousImage() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.selectImage(this.images[this.currentIndex]);
  }

  nextImage() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.selectImage(this.images[this.currentIndex]);
  }

  hasPrevious(): boolean { return this.currentIndex > 0; }
  hasNext(): boolean { return this.currentIndex < this.images.length - 1; }

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

  saveRating() {
    this.api.saveRating(this.rating).subscribe(() => {
      alert('Rating saved successfully!');
    });
  }

  getImageUrl(): string {
    if (!this.selectedFolder || !this.selectedImage) return '';
    return this.api.getImageUrl(this.selectedFolder, this.selectedImage);
  }
}
