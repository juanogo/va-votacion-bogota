import { Component, OnInit, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterContentInit, OnInit {
  @Input() width;
  @Output() onSelectZone: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateScaleColors: EventEmitter<any> = new EventEmitter();

  localidadesColorScale;
  localidades_barrios;
  mapcodigos;
  alldata;
  svg;
  colores = ["#3A7F53", "#FFE193", "#CC300A", "#112F41", "#FE7F2D", "#BDD3DE", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray"];
  scaleColors;
  private _year;
  private _votation;

  @Input() set votation(_v) {
    this._votation = _v;
    if (typeof (this._votation !== 'undefined'))
      this.updateData();
  };

  @Input() set year(_y: String) {
    this._year = _y;
    //console.log("set year to barchart");
    this.updateData();
  };

  constructor(private http: HttpClient) {
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
      this.svg = d3.select("#net_canvas").attr("width", this.width).attr("height", (+this.width) / 2);
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

      this.svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("class", "tract")
        .attr("d", path);

      this.svg.selectAll(".tract")
        .style("fill", (d) => {
          return this.localidadesColorScale(this.localidades_barrios[d.properties.scacodigo]["Codigo Localidad"]);
        })
        .style("fill-opacity", 0.4)
        .style("stroke-width", 0.1)
        .style("stroke", "gray")
        .on("click", (d) => {
          //console.log("EVENTO A CAPTURAR CODIGO LOCALIDAD:", this.localidades_barrios[d.properties.scacodigo])
          var l = this.localidades_barrios[d.properties.scacodigo];
          this.onSelectZone.emit({ name: l["Localidad"], value: l["Codigo Localidad"] })
        })
        .on("mouseout", (d) => {
          div_tooltip.transition()
            .duration(200)
            .style("height", "40px")
            .style("opacity", 0);
        });

    });
  }

  updateData() {
    var options = {};
    options['anio'] = this._year + this._votation.plusyear;

    this.http.post<[]>(`api/${this._votation.type}/groupedbyparty`, options).subscribe((data) => {
      //console.log("all data retrieve!");
      this.alldata = data;
      this.filtrar();
    })
  }

  filtrar() {
    var maxvot = {};



    var datos_partidos = {};
    var partidos = [];
    var index = 0;
    for (var i = 0; i < this.alldata.length; i++) {
      var d = this.alldata[i];
      //Obtenemos los partidos
      if (!partidos.includes(d.partido)) {
        index++;
        partidos.push(d.partido)
        datos_partidos[d.partido] = Object.assign({}, d);
      } else {
        datos_partidos[d.partido].votos += d.votos;
      }

      // Rellenamos maxvot
      if (typeof maxvot[d.zona] !== "undefined") {
        if (maxvot[d.zona].votos < d.votos) {
          maxvot[d.zona] = d;
        }
      } else {
        maxvot[d.zona] = d;
      }
    };

    partidos.sort((a, b) => {
      return datos_partidos[b].votos - datos_partidos[a].votos;
    })

    //console.log("maxvot", maxvot);
    //console.log("partidos", partidos);
    this.scaleColors = d3.scaleOrdinal()
      .domain(partidos)
      .range(this.colores);

    this.onUpdateScaleColors.emit(this.scaleColors);

    this.svg.selectAll(".tract").transition().duration(750)
      .style("fill-opacity", 0.4)
      .style("fill", (d) => {
        var locali = this.localidades_barrios[d.properties.scacodigo]["Codigo Localidad"];
        return this.scaleColors(maxvot[locali].partido)
      });

  }
}
