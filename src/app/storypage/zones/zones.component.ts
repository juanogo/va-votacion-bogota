import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit {

  validar_densidad = false;
  selected_type = { type: "senado", plusyear: 0 };
  selected_zone = { name: "Todas", value: -1 };

  years = [
    {
      map_name: "svg_2006",
      bar_name: "bar_svg_2006",
      start: 2006,
      end: 2010
    },
    {
      map_name: "svg_2010",
      bar_name: "bar_svg_2010",
      start: 2010,
      end: 2014
    },
    {
      map_name: "svg_2014",
      bar_name: "bar_svg_2014",
      start: 2014,
      end: 2018
    },
    {
      map_name: "svg_2018",
      bar_name: "bar_svg_2018",
      start: 2018,
      end: 2022
    }
  ]

  election_types = [{ type: "senado", name: "Senado", plusyear: 0 },
  { type: "camara", name: "Cámara", plusyear: 0 },
  { type: "alcaldia", name: "Alcaldía", plusyear: 1 },
  { type: "concejo", name: "Concejo", plusyear: 1 },
  { type: "JAL", name: "JAL", plusyear: 1 },
  ]

  currentElection = this.election_types[0];

  constructor() { }

  ngOnInit() {
  }

  setZone($event) {
    //console.log("Set selectedzone to home" + JSON.stringify($event));
    if (this.selected_zone != $event) {
      this.selected_zone = $event;
    }
  }

  setElectionType(_e) {
    this.currentElection = _e;
  }

  resetZone(){
    this.selected_zone = { name: "Todas", value: -1 };
  }
}
