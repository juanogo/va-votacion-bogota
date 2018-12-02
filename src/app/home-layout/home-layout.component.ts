import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit, AfterViewInit {

  constructor() { console.log(document.getElementById('#map-container'));}

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

}
