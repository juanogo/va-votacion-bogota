import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterContentInit, OnInit {
  @Input() width;

  localidadesColorScale;
  localidades_barrios;
  mapcodigos;

  constructor() {
    this.localidades_barrios = {};
    this.mapcodigos = [];
    d3.csv('assets/data/localidades_barriosv2.csv', (o) => {
      var barrio = o["Codigo Barrio"].padStart(6, "0");
      if (!this.mapcodigos.includes(o["Codigo Localidad"])) {
        this.mapcodigos.push(o["Codigo Localidad"])
      }
      this.localidades_barrios[barrio] = o;
    })
      .then((data) => {
        this.localidadesColorScale = d3.scaleOrdinal(d3.schemeSet3).domain(this.mapcodigos.map(d => { return +d }));
      });
  }

  ngOnInit() {

  }

  ngAfterContentInit() {
    var div_tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    d3.json("assets/data/bogota_cadastral.json").then((data) => {
      var svg = d3.select("#net_canvas").attr("width", this.width).attr("height", (+this.width) / 2);
      var height = (+this.width) / 2,
        margin = { top: 10, bottom: 20, right: 20, left: 20 };

      var dataf = data.features.filter((d) => {
        var salida = false;
        if (typeof this.localidades_barrios[d.properties.scacodigo] != "undefined") {
          salida = true;
        }
        return salida;
      });

      data.features = dataf;


      var data1 = data;
      var path = d3.geoPath()
        .projection(
          d3.geoTransverseMercator()
            .rotate([0, 0, 120]) // Make it horizontal (kind of)
            .fitExtent([[margin.left, margin.top], [this.width - margin.right, height - margin.bottom]], data)
        );

      svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path);

      svg.selectAll(".tract")
        .style("fill", (d) => {
          return this.localidadesColorScale(this.localidades_barrios[d.properties.scacodigo]["Codigo Localidad"]);
        })
        .style("fill-opacity", 0.4)
        .style("stroke-width", 0.1)
        .style("stroke", "gray")
        .on("click", (d) => {
          console.log("EVENTO A CAPTURAR CODIGO LOCALIDAD:", this.localidades_barrios[d.properties.scacodigo]["Codigo Localidad"])
        })
        .on("mouseout", function (d) {
          div_tooltip.transition()
            .duration(200)
            .style("height", "40px")
            .style("opacity", 0);
        });

    });
  }
}
