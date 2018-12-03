import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() onSelectYear: EventEmitter<any> = new EventEmitter();
  @Output() onSelectElectionType: EventEmitter<any> = new EventEmitter();

  years = [{ start: 2006, end: 2010, active: "active" },
  { start: 2010, end: 2014, active: "" },
  { start: 2014, end: 2018, active: "" },
  { start: 2018, end: 2022, active: "" }]

  election_types = [{ type: "senado", name: "Senado", plusyear: 0 },
  { type: "camara", name: "Cámara", plusyear: 0 },
  { type: "alcaldia", name: "Alcaldía", plusyear: 1 },
  { type: "concejo", name: "Concejo", plusyear: 1},
  { type: "JAL", name: "JAL", plusyear: 1 },
  ]

  currentYear = 2006;
  currentElection = this.election_types[0];

  constructor() { }

  ngOnInit() {
  }

  setCurrentYear(_y) {
    this.currentYear = _y.start;
    this.years.forEach(y => {
      if (y.start === this.currentYear) {
        y.active = "active";
      } else {
        y.active = "";
      }
    })
    this.onSelectYear.emit(this.currentYear);
  }

  setElectionType(_e) {
    this.currentElection = _e;
    this.onSelectElectionType.emit(_e);
  }

}
