import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  years = [{ start: 2006, end: 2010, active: "active" },
  { start: 2010, end: 2014, active: "" },
  { start: 2014, end: 2018, active: "" },
  { start: 2018, end: 2022, active: "" }]

  currentYear = 2006;

  constructor() { }

  ngOnInit() {
  }

  setCurrentYear(_y){
    this.currentYear = _y.start;
    this.years.forEach(y => {
      if (y.start === this.currentYear) {
        y.active = "active";
      } else {
        y.active = "";
      }
    })
  }

}
