import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as d3 from 'd3';
import { type } from 'os';

@Component({
  selector: 'app-barchart-votes',
  templateUrl: './barchart-votes.component.html',
  styleUrls: ['./barchart-votes.component.css']
})
export class BarchartVotesComponent implements OnInit, AfterContentInit {

  private _year;
  private _votation;
  private _zone;

  @Input() set votation(_v) {
    this._votation = _v;
    if (typeof (this._votation !== 'undefined'))
      this.updateData();
  };

  @Input() set year(_y: String) {
    this._year = _y;
    console.log("set year to barchart");
    this.updateData();
  };

  @Input() set zone(_z) {
    console.log("Updating zone to barchart")
    this._zone = _z;
    this.updateData();
  };

  updateData() {
    var options = {};
    options['anio'] = this._year + this._votation.plusyear;
    if (typeof(this._zone) !== 'undefined' && this._zone.value !== -1){
      console.log("zone --> "+JSON.stringify(this._zone));
      options['zona'] = +this._zone.value;
    } 
    this.http.post<[]>(`api/${this._votation.type}/groupedbyparty`, options).subscribe((data) => {
      console.log("all data retrieve!");
      this.alldata = data;
      this.filtrar();
    })
  }

  scaleBars;
  alldata;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
  }


  ngAfterContentInit() {

    console.log(this.year);
    console.log(this.votation);
    console.log("retrieving all data");

  }

  filtrar() {
    var mmvf = this.alldata;
    console.log(mmvf);
    var maxvot = {};

    mmvf.forEach(function (d) {
      if (typeof maxvot[d.zona] != "undefined") {
        if (maxvot[d.zona].votos < d.votos) {
          maxvot[d.zona] = d;
        }
      } else {
        maxvot[d.zona] = d;
      }

    });

    var datos_partidos = {};
    var partidos = [];
    var index = 0;
    mmvf.forEach(function (o, i, a) {
      if (!partidos.includes(o.partido)) {
        index++;
        partidos.push(o.partido)

        datos_partidos[o.partido] = Object.assign({}, o);
      } else {
        datos_partidos[o.partido].votos += o.votos;
      }


    });

    var data_nest = d3.nest()
      .key(function (d) { return d.zona; })
      .rollup(function (v) { return d3.sum(v, function (d) { return d.votos; }); })
      .entries(mmvf);

    var scaleVotes = d3.scaleOrdinal().range([0.4, 1])
      .domain([d3.min(data_nest, function (d) { return d.value }), d3.max(data_nest, function (d) { return d.value })]);


    this.barchart(mmvf, datos_partidos, partidos);

  }


  barchart(data, datos_partidos, partidos) {
    var escala_colores = ["#3A7F53", "#FFE193", "#CC300A", "#112F41", "#FE7F2D", "#BDD3DE", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray", "gray"]

    partidos = partidos.sort(function (x, y) {
      return d3.descending(datos_partidos[x].votos, datos_partidos[y].votos);
    });
    var svg = d3.select("#legend"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    var scaleBars = d3.scaleLinear()
      .domain([d3.min(partidos, d => datos_partidos[d].votos), d3.max(partidos, d => datos_partidos[d].votos)])
      .range([30, width]);
    var altura = 25;
    var scaleColors = d3.scaleOrdinal()
      .domain(partidos)
      .range(escala_colores);

    var index = 0;
    partidos.forEach(function (o, i, a) {
      datos_partidos[o]["new_index"] = index++;
    })


    var bars = svg.selectAll(".bar")
      .data(partidos);


    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("height", altura)
      .style("fill-opacity", 0.4)
      .attr("width", d => scaleBars(datos_partidos[d].votos))
      .attr("y", function (d) {
        return (datos_partidos[d].new_index * altura) + 5;
      })
      .attr("fill", function (d) { return scaleColors(datos_partidos[d].partido); });



    bars
      .transition()
      .duration(750)
      .attr("width", d => scaleBars(datos_partidos[d].votos))
      .attr("y", function (d) {
        return (datos_partidos[d].new_index * altura) + 5;
      })
      .attr("fill", function (d) { return scaleColors(datos_partidos[d].partido); });

    bars.exit().remove();

    var texts = svg.selectAll(".text")
      .data(partidos);


    texts
      .enter()
      .append("text")
      .attr("class", "text")
      .style("font-size", "12px")
      .attr("x", 5)
      .attr("y", function (d) {
        return (datos_partidos[d].new_index * altura) + 25;
      })
      .text(function (d) { return datos_partidos[d].partido + " (" + datos_partidos[d].votos + " votos)"; });

    texts
      .transition()
      .duration(750)
      .text(function (d) { return datos_partidos[d].partido + " (" + datos_partidos[d].votos + " votos)"; });
    texts.exit().remove();
  }
}
