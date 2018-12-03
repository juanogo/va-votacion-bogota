import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartVotesComponent } from './barchart-votes.component';

describe('BarchartVotesComponent', () => {
  let component: BarchartVotesComponent;
  let fixture: ComponentFixture<BarchartVotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarchartVotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
