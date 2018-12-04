import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';
import * as chroma from 'chroma-js';
import * as data2grid from 'data2grid';
import * as jz from 'jeezy';

@Component({
  selector: 'app-correlations',
  templateUrl: './correlations.component.html',
  styleUrls: ['./correlations.component.css']
})
export class CorrelationsComponent implements OnInit, AfterContentInit {

  //Manejo de la data
  datos;
  periodos;
  partidos = [];
  datos_por_anio = [];
  datos_aggr = [];
  columns = ["Senado", "Camara", "Concejo", "Alcaldia", "PresidenciaV1", "PresidenciaV2", "JEP"]
  extent = [-1, 1];

  //Variables de la viz
  margin = { top: 20, bottom: 1, left: 20, right: 1 };
  width = 150;
  height = 150;
  padding = .1;
  cellSize = 50;
  svg;
  year;
  ps; x; y; c; bigg; tituloy; titulosy_text; bigtity; bigtity2; ejeytext;
  rows;
  tooltip;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.tooltip = d3.select(".tooltip");
    d3.json("https://votbogota.herokuapp.com/api/all/groupedbyparty").then((data) => {

      this.datos = data;
      this.datos = this.datos.filter((d) => {
        return d.partido != "ABSTENCION"
          && d.partido != "TARJETONES NO MARCADOS"
          && d.partido != "VOTOS NULOS"
      });

      //Corrección de Alianza Verde
      this.datos.forEach((item) => {
        if (item.partido === "VERDE") { item.partido = "ALIANZA VERDE" }
        if (item.anio === 2015) { item.anio = 2014 }
        if (item.anio === 2011) { item.anio = 2010 }
        if (item.anio === 2007) { item.anio = 2006 }
      });



      //Seleccionar los partidos con mas categorías
      var categorias = d3.nest()
        .key(d => d.partido)
        .key(d => d.tipo)
        .rollup(function (leaves) { return leaves.length; })
        .entries(this.datos);

      console.log(this.datos);


      var categorias_up2 = categorias.filter((d) => { return d.values.length > 2 });

      //Obtener periodos
      this.periodos = this.get_periodos(this.datos);
      this.periodos = this.periodos.sort();

      //Escoger los 15 partidos con mayor participación 
      for (var i = 0; i < 20; i++) {
        this.partidos.push(categorias_up2[i].key);
      }

      //Crear los check boxes
      this.addElement(this.partidos);


      //Armar la estructura de la data correlacionada
      this.partidos = this.partidos.slice(0, 6);
      this.datos_por_anio = this.get_correlaciones(this.periodos, this.partidos, this.datos);
      this.crear_viz(this.datos_por_anio, this.partidos, this.periodos);

    });
  }

  update_viz(datos_por_anio, partidos_selected, periodos) {
    this.year = this.bigg.selectAll("g")
      .data(datos_por_anio);

    var newyears = this.year.enter().append("g")
      .attr("transform", (d, i) => `translate(${(this.width * d.idkey) + this.cellSize * 1.5}, ${this.height * d.idparty + this.cellSize * 1.5})`);

    this.ps = newyears
      .selectAll("rect")
      .data(d => d.values, function (d) { return d.column_a + d.column_b; })
      .enter().append("rect")
      .attr("x", (d) => { return this.x(d.column); })
      .attr("y", (d) => { return this.y(d.row); })
      .attr("width", this.x.bandwidth())
      .attr("height", this.y.bandwidth())
      .style("fill", (d) => { return this.c(d.correlation); })
      .style("opacity", 1);



    this.year.attr("transform", (d, i) => `translate(${(this.width * d.idkey) + this.cellSize * 1.5}, ${this.height * d.idparty + this.cellSize * 1.5})`);

    this.year.exit().remove();
    //Update things to be update

    this.ps = this.year
      .selectAll("rect")
      .data(d => d.values, function (d) { return d.column_a + d.column_b; });

    this.ps.enter().append("rect")
      .attr("x", (d) => { return this.x(d.column); })
      .attr("y", (d) => { return this.y(d.row); })
      .attr("width", this.x.bandwidth())
      .attr("height", this.y.bandwidth())
      .style("fill", (d) => { return this.c(d.correlation); })
      .style("opacity", 1);

    this.ps.transition().duration(750)
      .attr("x", (d) => { return this.x(d.column); })
      .attr("y", (d) => { return this.y(d.row); })
      .style("fill", (d) => { return this.c(d.correlation); })

    this.ps.exit().remove();



    var y_axis = d3.axisLeft(this.y).tickFormat((d, i) => { return this.columns[i]; });

    this.tituloy = this.bigtity.selectAll("g")
      .data(partidos_selected);

    var t1 = this.tituloy.enter().append("g")
      .attr("transform", (d, i) => `translate(1, ${(this.height * i) + this.cellSize * 1.5})`);

    t1.append("text")
      .attr("x", 860)
      .attr("y", this.height / 2)
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text(d => d);


    this.tituloy.exit().remove();

    this.tituloy.attr("transform", (d, i) => `translate(1, ${(this.height * i) + this.cellSize * 1.5})`);

    this.titulosy_text = this.tituloy.selectAll("text").data(function (d) { return [d]; })
      .text(d => d);


    var contenedor_ejey = this.bigtity2.selectAll(".axisy_cont")
      .data(partidos_selected);

    var e1 = contenedor_ejey.enter()
      .append("g")
      .attr("class", "axisy_cont")
      .attr("transform", (d, i) => `translate(1, ${(this.height * i) + this.cellSize * 1.5})`);


    //Agregar el eje y
    e1.append("g")
      .attr("class", "y axis")
      .call(y_axis)
      .attr("transform", "translate(75,0)")
      .selectAll("text")
      .attr("x", -10)
      .attr("text-anchor", "end")
    contenedor_ejey.exit().remove();

  }


  crear_viz(datos_por_anio, partidos, periodos) {

    //Manipulación del svg


    var svg1 = d3.select("#matrix");
    this.svg = svg1.append("g").attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");


    this.x = d3.scaleBand()
      .range([0, this.width - this.margin.left])
      .paddingInner(this.padding)
      .domain(d3.range(1, this.rows + 1));

    this.y = d3.scaleBand()
      .range([0, this.height - this.margin.top])
      .paddingInner(this.padding)
      .domain(d3.range(1, this.rows + 1));

    this.c = chroma.scale(["tomato", "white", "steelblue"])
      .domain([this.extent[0], 0, this.extent[1]]);


    var x_axis = d3.axisTop(this.x).tickFormat((d, i) => { return this.columns[i]; });
    var y_axis = d3.axisLeft(this.y).tickFormat((d, i) => { return this.columns[i]; });




    this.bigg = this.svg.append("g");
    //Contenedor de los años
    this.year = this.bigg.selectAll("g")
      .data(datos_por_anio)
      .enter().append("g")
      .attr("transform", (d, i) => `translate(${(this.width * d.idkey) + this.cellSize * 1.5}, ${this.height * d.idparty + this.cellSize * 1.5})`);
    //Pinta la matrix de correlaciones
    this.ps = this.year
      .selectAll("rect")
      .data(d => d.values, function (d) { return d.column_a + d.column_b; });

    this.ps
      .enter().append("rect")
      .attr("x", (d) => { return this.x(d.column); })
      .attr("y", (d) => { return this.y(d.row); })
      .attr("width", this.x.bandwidth())
      .attr("height", this.y.bandwidth())
      .style("fill", (d) => { return this.c(d.correlation); })
      .style("opacity", 1e-6)
      .style("opacity", 1);



    //Contenedor título de años
    const titulox = this.svg.append("g")
      .selectAll("g")
      .data(periodos)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${(this.width * i) + this.cellSize * 1.5},1)`);

    //Texto años
    const titulosx_text = titulox.append("text")
      .attr("x", (this.width / 2) + 7)
      .attr("y", 5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(d => d);

    //Contenedor título de partido
    this.bigtity = this.svg.append("g");
    this.tituloy = this.bigtity
      .selectAll("g")
      .data(partidos)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(1, ${(this.height * i) + this.cellSize * 1.5})`);

    //Texto partido
    this.titulosy_text = this.tituloy.append("text")
      .attr("x", 680)
      .attr("y", this.height / 2)
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text(d => d)


    //Agregar el eje x
    titulox.append("g")
      .attr("class", "x axis")
      .call(x_axis)
      .attr("transform", "translate(0 ,75)")
      .selectAll("text")
      .attr("transform", "rotate(330)")
      .attr("x", 5)
      .attr("text-anchor", "start")

    this.bigtity2 = this.svg.append("g");
    var contenedor_ejey = this.bigtity2
      .selectAll("g")
      .data(partidos)
      .enter()
      .append("g")
      .attr("class", "axisy_cont")
      .attr("transform", (d, i) => `translate(1, ${(this.height * i) + this.cellSize * 1.5})`);


    //Agregar el eje y
    this.ejeytext = contenedor_ejey.append("g")
      .attr("class", "y axis")
      .call(y_axis)
      .attr("transform", "translate(75,0)")
      .selectAll("text")
      .attr("x", -10)
      .attr("text-anchor", "end")


    //Eventos: tool tip
    d3.selectAll("rect")
      .on("mouseover", function (d) {

        d3.select(this).classed("selected", true);
        var tooltip = d3.select(".tooltip");
        tooltip.transition()
          .duration(300)
          .style("opacity", .75);

        tooltip.html(d.column_x + ", " + d.column_y + " = " + d.correlation.toFixed(2))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY + 10) + "px");

      })
      .on("mouseout", function () {

        d3.selectAll("rect").classed("selected", false);

        d3.select(".tooltip").transition()
          .duration(300)
          .style("opacity", 0);

      })
      .on("mousemove", function () {
        d3.select(".tooltip").style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY + 10) + "px");
      });

  }

  get_periodos(datos) {

    var lookup = {};
    var items = datos;
    var result = [];

    for (var item, i = 0; item = items[i++];) {
      var name = item.anio;

      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }

    return result;
  }


  get_correlaciones(periodos, partidos, datos) {

    //Armar la estructura de la data 
    this.datos_por_anio = [];
    var dpa = [];
    var iditem = -1;
    var idparty = -1;
    periodos.forEach((item) => {
      iditem++;
      idparty = -1;
      partidos.forEach((party) => {
        idparty++;
        //Revisar los datos a mostrar  (2014)
        var data_partido = datos.filter((d) => { return d.partido === party && d.anio === item });

        var dat1 = {}
        var totdat = {}
        data_partido.forEach((o, i, a) => {
          if (typeof dat1[o.zona] == "undefined") {
            dat1[o.zona] = {};
            dat1[o.zona][o.tipo] = o.votos;
            dat1[o.zona]["zona"] = o.zona;
          } else {
            dat1[o.zona][o.tipo] = o.votos
          }
          if (typeof totdat[o.zona] == "undefined") {
            totdat[o.zona] = o.votos;
          } else {
            totdat[o.zona] += o.votos;
          }
        })

        var dat2 = [];
        for (var i in dat1) {
          this.columns.forEach((item) => {
            dat1[i][item] = dat1[i][item] / totdat[dat1[i].zona];
          })
          dat2.push(dat1[i]);
        }

        //Calcular correlaciones
        var corr = jz.arr.correlationMatrix(dat2, this.columns);
        var grid = data2grid.grid(corr);
        this.rows = d3.max(grid, function (d) { return d.row; });
        this.datos_por_anio.push({ "key": item, "idkey": iditem, "party": party, "idparty": idparty, "values": grid });


      });
    });


    return this.datos_por_anio;
  }



  addElement(partidos) {


    var contenedor = document.getElementById('checkbox_container_id');
    var num = 0;
    partidos.forEach(function (item) {

      num++;
      var div_wrapper = document.createElement('div');
      div_wrapper.className = 'clr-checkbox-wrapper';
      contenedor.appendChild(div_wrapper);

      var input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'checkbox' + num;
      input.value = item;
      input.className = 'clr-checkbox';
      div_wrapper.appendChild(input);

      var label = document.createElement('label');
      label.className = 'clr-control-label';
      label.setAttribute("for", 'checkbox' + num);

      var label_text = document.createTextNode(item);
      label.appendChild(label_text)
      div_wrapper.appendChild(label);


    });

  }

  //al presionar el boton
  calculate_correlation() {

    var partidos_selected = this.get_party_selected();

    //Armar la estructura de la data correlacionada
    this.datos_por_anio = this.get_correlaciones(this.periodos, partidos_selected, this.datos);
    //crear_viz(datos_por_anio, partidos, periodos);

    console.log("datos_por_anio - desde el boton", this.datos_por_anio);
    console.log(this.periodos);
    console.log(partidos_selected);
    this.update_viz(this.datos_por_anio, partidos_selected, this.periodos);

  }

  get_party_selected() {

    var partidos_selected = [];
    var wrapper = document.getElementById("checkbox_container_id");
    var lista = wrapper.getElementsByTagName('input');
    for (var f = 0; f < lista.length; f++) {
      if (lista[f].type == 'checkbox') {
        if (lista[f].checked == true) {
          partidos_selected.push(lista[f].value);
        }
      }

    }

    if (partidos_selected.length > 6) {
      partidos_selected = partidos_selected.slice(0, 6);
    }

    return partidos_selected;

  }

}
