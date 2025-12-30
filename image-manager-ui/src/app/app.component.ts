import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  title = 'Image Manager';
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getFolders().subscribe(folders => {
      console.log('Folders from API:', folders);
    });
  }
}
