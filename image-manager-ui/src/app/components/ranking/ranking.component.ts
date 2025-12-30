import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, RatingEntry } from '../../services/api.service';

interface RankedImage {
  imagePath: string;
  score: number;
  rating: RatingEntry;
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  topN: number = 10;
  criteria: string = 'overall';
  rankedImages: RankedImage[] = [];

  constructor(private api: ApiService, private router: Router) {} // ✅ Router injected

  ngOnInit(): void {
    this.loadRanking();
  }

  // ✅ Add these methods
  goToGallery(): void {
    this.router.navigate(['/gallery']);
  }

  logout(): void {
    this.api.clearToken();
    this.router.navigate(['/login']);
  }

  loadRanking(): void {
    this.api.getAllRatings().subscribe((data: { [key: string]: RatingEntry }) => {
      const list: RankedImage[] = [];

      Object.keys(data).forEach(key => {
        const r = data[key];
        list.push({ imagePath: key, score: this.calculateScore(r), rating: r });
      });

      this.rankedImages = list
        .filter(item => item.score > 0) // only show images with rating
        .sort((a, b) => b.score - a.score)
       .slice(0, this.topN);
    });
  }

  calculateScore(r: RatingEntry): number {
    switch (this.criteria) {
      case 'Photo': return r.rating_Photo;
      case 'Light': return r.rating_Light;
      case 'Background': return r.rating_Background;
      case 'misc1': return r.rating_misc1;
      case 'misc2': return r.rating_misc2;
      default:
        return (r.rating_Photo + r.rating_Light + r.rating_Background + r.rating_misc1 + r.rating_misc2) / 5;
    }
  }

  refresh(): void {
    this.loadRanking();
  }



  
  getImageUrl(path: string): string {
    const [folder, image] = path.split('/');
    return this.api.getImageUrl(folder, image);
  }
}
