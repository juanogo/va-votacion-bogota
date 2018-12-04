import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyArcDiagramComponent } from './party-arc-diagram.component';

describe('PartyArcDiagramComponent', () => {
  let component: PartyArcDiagramComponent;
  let fixture: ComponentFixture<PartyArcDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyArcDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyArcDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
