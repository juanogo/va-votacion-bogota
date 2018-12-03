import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit, AfterViewInit {

  selected_year = 2006;
  selected_type = {type: "senado", plusyear: 0};
  selected_zone = {name: "Todas", value: -1};

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  setYear($event) {
    console.log("Set year to home" + $event);
    if (this.selected_year != $event) {
      this.selected_year = $event;
    }

  }

  setElectionType($event) {
    console.log("Set electiontype to home" + $event);
    if (this.selected_type != $event) {
      this.selected_type = $event;
    }
  }

  setZone($event) {
    console.log("Set selectedzone to home" + JSON.stringify($event));
    if (this.selected_zone != $event) {
      this.selected_zone = $event;
    }
  }

  resetZone(){
    this.selected_zone = {name: "Todas", value: -1};
  }
}
