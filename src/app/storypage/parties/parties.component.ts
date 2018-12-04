import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.css']
})
export class PartiesComponent implements OnInit {

  showInsights = false;
  showCoaliciones = false;
  
  years = [{ start: 2006, end: 2010, active: "active" },
  { start: 2010, end: 2014, active: "" },
  { start: 2014, end: 2018, active: "" },
  { start: 2018, end: 2022, active: "" }]

  selected_year = 2006;

  setCurrentYear(_y) {
    this.selected_year = _y.start;
    this.years.forEach(y => {
      if (y.start === this.selected_year) {
        y.active = "active";
      } else {
        y.active = "";
      }
    })
  }

  selected_zone = { name: "Todas", value: -1 };

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  setYear($event) {
    //console.log("Set year to home" + $event);
    if (this.selected_year != $event) {
      this.selected_year = $event;
    }

  }

  setZone($event) {
    //console.log("Set selectedzone to home" + JSON.stringify($event));
    if (this.selected_zone != $event) {
      this.selected_zone = $event;
    }
  }

  resetZone() {
    this.selected_zone = { name: "Todas", value: -1 };
  }

}
