import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements AfterContentInit {
  databyparty = [];
  databyelection = [];
  allElectionTypes = [];
  allPartyNames = [];
  width = 800;
  private _year;
  private _zone;
  private _selected_axis = "party";
  g;

  set selected_axis(_sa) {
    this._selected_axis = _sa;
    this.drawRadar();
  }

  get selected_axis() {
    return this._selected_axis;
  }

  @Input() set year(_y: String) {
    this._year = _y;
    //console.log("set year to radarchart");
    this.updateChart();
  };

  @Input() set zone(_z) {
    //console.log("Updating zone to radarchart")
    this._zone = _z;
    this.updateChart();
  };


  constructor(private http: HttpClient) { }

  ngOnInit() {

  }


  updateChart() {
    if (typeof (this._zone) === "undefined") {
      return;
    }
    //d3.select("#radar-svg").selectAll("svg").remove();
    this.databyparty = [];
    this.allElectionTypes = [];
    this.databyelection = [];
    this.allPartyNames = [];
    var options = { anio: this._year, limit: 10 };
    if (this._zone.value !== -1) {
      options['zona'] = +this._zone.value;
    }
    //console.log(this._zone, this._year, options);
    this.http.post<[]>("api/senado/groupedbypartyandzone", options).subscribe((datav) => {
      this.databyelection = this.databyelection.concat(datav);
      for (var i = 0; i < datav.length; i++) {
        this.updatePartyAxis(datav[i], "Senado");
      }
      this.allElectionTypes.push("Senado");

      this.http.post<[]>("api/presidencia_v1/groupedbypartyandzone", options).subscribe((datav) => {
        this.databyelection = this.databyelection.concat(datav);
        for (var i = 0; i < datav.length; i++) {
          this.updatePartyAxis(datav[i], "PresidenciaV1");
        }
        this.allElectionTypes.push("PresidenciaV1");

        this.http.post<[]>("api/presidencia_v2/groupedbypartyandzone", options).subscribe((datav) => {
          this.databyelection = this.databyelection.concat(datav);
          for (var i = 0; i < datav.length; i++) {
            this.updatePartyAxis(datav[i], "PresidenciaV2");
          }
          this.allElectionTypes.push("PresidenciaV2");

          this.http.post<[]>("api/camara/groupedbypartyandzone", options).subscribe((dataa) => {
            this.databyelection = this.databyelection.concat(dataa);
            for (var i = 0; i < dataa.length; i++) {

              this.updatePartyAxis(dataa[i], "Camara");
            }
            this.allElectionTypes.push("Camara");
            options.anio = options.anio + 1;

            this.http.post<[]>("api/alcaldia/groupedbypartyandzone", options).subscribe((dataa) => {
              this.databyelection = this.databyelection.concat(dataa);
              for (var i = 0; i < dataa.length; i++) {

                this.updatePartyAxis(dataa[i], "Alcaldia");
              }
              this.allElectionTypes.push("Alcaldia");
              this.http.post<[]>("api/concejo/groupedbypartyandzone", options).subscribe((datacon) => {
                this.databyelection = this.databyelection.concat(datacon);
                for (var i = 0; i < datacon.length; i++) {

                  this.updatePartyAxis(datacon[i], "Concejo");
                }
                this.allElectionTypes.push("Concejo");
                this.http.post<[]>("api/jal/groupedbypartyandzone", options).subscribe((datacon) => {
                  this.databyelection = this.databyelection.concat(datacon);
                  for (var i = 0; i < datacon.length; i++) {

                    this.updatePartyAxis(datacon[i], "JAL");
                  }

                  this.allElectionTypes.push("JAL");

                  //console.log(this.databyelection);
                  this.allPartyNames = [];
                  this.databyelection = this.databyelection.map((d) => {
                    if (!this.allPartyNames.includes(d.partido)) {
                      this.allPartyNames.push(d.partido);
                    }
                    return { axis: d.partido, value: d.votos, tipo: d.tipo }
                  });
                  this.databyelection = d3.nest()
                    .key(function (d) { return d.tipo; })
                    .entries(this.databyelection);
                  this.databyelection = this.databyelection.map((d) => { return { name: d.key, values: d.values } })

                  this.databyparty = this.databyparty.filter((d) => { return d.values.length > 2 });

                  //console.log(this.databyelection);
                  this.drawRadar();
                })
              })
            })
          })
        })
      })
    })
  }

  ngAfterContentInit() {
    //this.updateChart();
    var svg = d3.select("#radar-svg").append("svg").attr("width", this.width).attr("height", 600);
    //Append a g element		
    this.g = svg.append("g")
      .attr("transform", "translate(100,100)");
  }

  updatePartyAxis(party, election) {
    var p = null;
    for (var i = 0; i < this.databyparty.length; i++) {
      if (this.databyparty[i].name === party.partido) {
        p = this.databyparty[i];
        break;
      }
    }

    if (p === null) {
      p = {
        name: party.partido,
        values: [],
        total: 0
      }
      this.databyparty.push(p);
    }

    p.values.push(
      {
        axis: election,
        value: party.votos
      }
    )


    p.total = p.total + party.votos;
  }

  drawRadar() {
    //data = data.filter((d) => { return d.values.length > 2 });

    var data = this.databyelection;
    var allAxis = this.allPartyNames;
    if (this.selected_axis !== "party") {
      data = this.databyparty;
      allAxis = this.allElectionTypes;
    }

    console.log("all axis", allAxis);

    var color = d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.name))
    var width = this.width;
    var height = 600;
    var plotxpos = (1 / 2) * width
    var plotypos = (1 / 2) * height
    var plotwidth = height - 50
    var plotheight = height - 50

    this.g.attr("transform", `translate(${plotxpos},${plotypos})`);

    //var color = d3.scaleOrdinal([NQColors.purple, NQColors.red])

    var radarChartOptions = {
      xpos: plotxpos,
      ypos: plotypos,
      w: plotwidth,
      h: plotheight,
      maxValue: 45,
      levels: 5,
      roundStrokes: true,
      color: color,
      dotRadius: 4,
      //textColor: NQTextColors.white,
      textColor: "black",
      opacityCircles: 0.1,
      circlecolor: "ccc",
      valuelabelformat: ".0f",
      valuelabelsize: 14,
      labelsize: 12,
      legednames: [],
      legendoptions_legendtitle: "",
      legendoptions_xcorretion: 0,
      legendoptions_legendsize: 16,
      legendoptions_ypadbetweenlines: 26,
      legendoptions_ypadposbetweenpatchandtext: 12,
      legendoptions_patchsquaresize: 12,
    };

    //Call function to draw the Radar chart
    this.RadarChart(".radarChart", data, allAxis, radarChartOptions);
  }




  RadarChart(id, data, allAxis, options) {
    //console.log("data en radar", data);
    /*
    Function RadarChart
    Adapted version from an original version written
    by Nadieh Bremer,
    https://www.visualcinnamon.com/2015/10/different-look-d3-radar-chart
    Used and modified under MIT license.
    */

    var width = this.width;
    var height = 600;

    var cfg = {
      xpos: 100,
      ypos: 100,
      w: this.width,				     //Width of the circle
      h: 600,				     //Height of the circle
      levels: 5,				     //How many levels or inner circles should there be drawn
      maxValue: 0, 			     //What is the value that the biggest circle will represent
      labelFactor: 1.25, 	     //How much farther than the radius of the outer circle should the labels be placed
      opacityArea: 0.1, 	     //The opacity of the area of the blob
      dotRadius: 7, 			     //The size of the colored circles of each blog
      opacityCircles: 0.1, 	     //The opacity of the circles of each blob
      circlecolor: "#CDCDCD",     //Base color of circle	 
      strokeWidth: 1.5, 		     //The width of the stroke around each blob
      roundStrokes: false,	     //If true the area and stroke will follow a round path (cardinal-closed)
      textColor: "red",	     // Default color of texts
      valuelabelformat: ".2f",    // Default formatting of level values
      valuelabelsize: 10,	     // Default size of value labels (in pixels)
      labelsize: 8,	     		 // Default size of labels (in pixels)	 
      legednames: null,
      legendoptions_xcorretion: -2000,
      legendoptions_ycorretion: 0,
      legendoptions_legendtitle: "",
      legendoptions_legendsize: 2,
      legendoptions_ypadaftertitle: 20,
      legendoptions_xpadafterpatch: 20,
      legendoptions_ypadbetweenlines: 20,
      legendoptions_ypadposbetweenpatchandtext: 9,
      legendoptions_patchsquaresize: 10,
      color: d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.name))
    };


    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
      for (var i in options) {
        if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
      }//for i
    }//if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, (d) => {
      return d3.max(d.values, (v) => {
        return v.value;
      })
    }));


    var total = allAxis.length,					//The number of different axes
      radius = Math.min(cfg.w / 2.5, cfg.h / 2.5), 	//Radius of the outermost circle
      Format = d3.format(cfg.valuelabelformat),		//Formatting for levels texts
      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

    console.log("angle slice", angleSlice);

    //Scale for the radius
    //var rScale = d3.scale.linear()
    var rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes

    //Draw the background circles
    //console.log(d3.range(1, (cfg.levels + 1)).reverse());
    this.g.selectAll(".gridCircle")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function (d, i) { return radius / cfg.levels * d; })
      .style("fill", cfg.circlecolor)
      .style("stroke", cfg.circlecolor)
      .style("fill-opacity", cfg.opacityCircles);


    //Text indicating at what value each level is
    this.g.selectAll(".axisLabel")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", function (d) { return -d * radius / cfg.levels; })
      .attr("dy", "0.4em")
      .style("font-size", cfg.valuelabelsize + "px")
      .style("fill", cfg.textColor)
      .text(function (d, i) { return Format(maxValue * d / cfg.levels); });

    var axislabels = this.g.selectAll(".axisLabel")
      .data(d3.range(1, (cfg.levels + 1)).reverse());
    axislabels.text(function (d, i) { return Format(maxValue * d / cfg.levels); });


    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center

    var domAllAxis = this.g.selectAll(".axis")
      .data(allAxis);

    var axis = domAllAxis.enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function (d, i) { console.log("enter", i); return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", cfg.labelsize + "px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      //.style("fill",cfg.textColor)		
      .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
      .text(function (d) { return d })

    domAllAxis.select("line")
      .transition()
      .duration(200)
      .attr("x2", function (d, i) { console.log("enter", i); return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })

    domAllAxis.select(".legend")
      .transition().duration(200)
      .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
      .text(function (d) { return d })

    domAllAxis.exit().remove();
    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
    //The radial line function
    var radarLine = d3.lineRadial().curve(d3.curveBasisClosed)
      .radius(function (d) { return rScale(d.value); })
      .angle(function (d, i) { return i * angleSlice; });

    if (cfg.roundStrokes) {
      //radarLine.interpolate("cardinal-closed");
      radarLine.curve(d3.curveCardinalClosed)
    }

    //Create a wrapper for the blobs
    var blobwrappers = this.g.selectAll(".radarWrapper")
      .data(data);

    var blobWrapper = blobwrappers
      .enter().append("g")
      .attr("class", "radarWrapper");

    blobwrappers.exit().remove();



    //Append the backgrounds	
    /* blobWrapper
       .append("path")
       .attr("class", "radarArea")
       .attr("d", (d, i) => { return radarLine(d.values); })
       .style("fill", (d) => { return cfg.color(d.name); })
       .style("fill-opacity", cfg.opacityArea)
       .on('mouseover', function (d, i) {
         //Dim all blobs
         d3.selectAll(".radarArea")
           .transition().duration(200)
           .style("fill-opacity", 0.1);
         //Bring back the hovered over blob
         d3.select(this)
           .transition().duration(200)
           .style("fill-opacity", 0.7);
       })
       .on('mouseout', function () {
         //Bring back all blobs
         d3.selectAll(".radarArea")
           .transition().duration(200)
           .style("fill-opacity", cfg.opacityArea);
       });
 */

    //Create the outlines	
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) { return radarLine(d.values); })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", (d) => { return cfg.color(d.name) })
      .style("fill", "none")
      .on("mouseover", function (d, i) {
        partyTooltip
          .transition()
          .duration(750)
          .style('opacity', 1);

        partyTooltip.select(".party-tooltip")
          .text(d.name);


        d3.selectAll(".radarStroke")
          .style("stroke-width", "0.5px")
          .style("stroke", "gray");
        d3.select(this).style("stroke-width", "5px")
          .style("stroke", (d) => { return cfg.color(d.name) });
      }).on("mouseout", function (d, i) {
        d3.selectAll(".radarStroke")
          .style("stroke-width", cfg.strokeWidth + "px")
          .style("stroke", (d) => { return cfg.color(d.name) });
        partyTooltip
          .transition()
          .duration(190)
          .style('opacity', 0);
      })



    //Append the circles
    blobWrapper.selectAll(".radarCircle")
      .data(function (d, i) { return d.values; })
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
      //.style("fill", function(d,i,j) { return cfg.color(j); }) // this does not work in v4...
      .style("fill", "gray")
      .style("fill-opacity", 0.8)
      .on("mouseover", function (d, i) {
        let newX = parseFloat(d3.select(this).attr('cx')) - 10;
        let newY = parseFloat(d3.select(this).attr('cy')) - 10;

        tooltip
          .attr('x', newX)
          .attr('y', newY)
          .text(Format(d.value))
          .transition().duration(200)
          .style('opacity', 1);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200)
          .style("opacity", 0);
      });

    blobwrappers.select(".radarStroke").transition().duration(750)
      .attr("d", function (d, i) { return radarLine(d.values); })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", (d) => { return cfg.color(d.name) })
      .style("fill", "none");

    blobwrappers.select(".radarArea")
      .transition()
      .duration(750)
      .attr("d", (d, i) => { return radarLine(d.values); })
      .style("fill", (d) => { return cfg.color(d.name); });

    blobwrappers.selectAll(".radarCircle")
      .data(function (d, i) { return d.values; })
      .transition()
      .duration(500)
      .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
      .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); });

    blobwrappers.selectAll(".radarCircle")
      .data(function (d, i) { return d.values; })
      .exit().remove();


    ////////////////////////////////////////////
    /////////// Legend ////////////////
    ////////////////////////////////////////////
    /*
        if (cfg.legednames != null) {
          var text = this.svg.append("text")
            .attr("x", cfg.xpos + radius + cfg.legendoptions_xcorretion)
            .attr("y", cfg.ypos - radius + cfg.legendoptions_ycorretion)
            .attr("font-size", cfg.legendoptions_legendsize + "px")
            .attr("fill", cfg.textColor)
            .text(cfg.legendoptions_legendtitle);
    
          //Initiate Legend	
          var legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            ;
          //Create colour squares
          legend.selectAll('rect')
            .data(data)
            .enter()
            .append("rect")
            .attr("x", cfg.xpos + radius + cfg.legendoptions_xcorretion)
            .attr("y", function (d, i) { return cfg.ypos - radius + cfg.legendoptions_ycorretion + cfg.legendoptions_ypadaftertitle + i * cfg.legendoptions_ypadbetweenlines; })
            .attr("width", cfg.legendoptions_patchsquaresize)
            .attr("height", cfg.legendoptions_patchsquaresize)
            .style("fill", (d) => { return cfg.color(d.name); })
            ;
          //Create text next to squares
          legend.selectAll('text')
            .data(data)
            .enter()
            .append("text")
            .attr("x", cfg.xpos + radius + cfg.legendoptions_xcorretion + cfg.legendoptions_xpadafterpatch)
            .attr("y", (d, i) => { return cfg.ypos - radius + cfg.legendoptions_ycorretion + cfg.legendoptions_ypadaftertitle + i * cfg.legendoptions_ypadbetweenlines + cfg.legendoptions_ypadposbetweenpatchandtext })
            .attr("font-size", cfg.legendoptions_legendsize + "px")
            .attr("fill", cfg.textColor)
            .text(function (d) { return d.name + ": " + d.total; })
            ;
        }//legendnames
    */


    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = this.g.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");






    //Set up the small tooltip for when you hover over a circle
    var tooltip = this.g.append("text")
      .style("fill", cfg.textColor)
      .attr("class", "tooltip")
      .style("opacity", 0);

    var partyTooltip = this.g.append("g")
      .attr("transform", "translate(-350, -200)")
      .style("opacity", 0);

    partyTooltip.append("rect").attr("width", 280).attr("height", 40)
      .style("fill", "black")
      .attr("rx", 20)
      .attr("ry", 20)
      .style("opacity", 0.5);

    partyTooltip.append("text")
      .style("fill", "white")
      .attr("x", 10)
      .attr("y", 25)
      .attr("class", "party-tooltip")
      .text("prueba de tooltip");

    //*/

  }//RadarChart
}


