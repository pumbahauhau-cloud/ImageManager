import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGalleryPageComponent } from './image-gallery-page.component';

describe('ImageGalleryPageComponent', () => {
  let component: ImageGalleryPageComponent;
  let fixture: ComponentFixture<ImageGalleryPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageGalleryPageComponent]
    });
    fixture = TestBed.createComponent(ImageGalleryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
