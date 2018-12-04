import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorypageComponent } from './storypage.component';

describe('StorypageComponent', () => {
  let component: StorypageComponent;
  let fixture: ComponentFixture<StorypageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorypageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
