import { Component, OnInit, AfterContentInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-party-arc-diagram',
  templateUrl: './party-arc-diagram.component.html',
  styleUrls: ['./party-arc-diagram.component.css']
})
export class PartyArcDiagramComponent implements OnInit, AfterContentInit {

  constructor(private http: HttpClient) { }

  partydata = {}
  svgNode;

  @Input() width;
  @Input() height;

  _showChart = false;

  @Input() set showChart(_sc) {
    this._showChart = _sc;
    if (this._showChart) {
      setTimeout(() => { this.createChart(this.partydata); }, 500);

    }
  }

  get showChart() {
    return this._showChart;
  }

  ngOnInit() {

  }

  ngAfterContentInit() {
    this.http.get<[]>("api/all/getcoaliciones").subscribe((data) => {
      this.partydata = data;
      //this.createChart(this.partydata);
    });
  }

  createChart(data) {
    this.svgNode = d3.select("#arc-svg2");
    this.svgNode.selectAll("g").remove();

    console.log("svgNode", this.svgNode.node());

    var i, j, node;
    var groupSep = 10;

    var index = 0;
    data.links = data.links.map((l) => {
      return { id: ++index, source: l.source, target: l.target, value: l.value };
    })

    data.nodes.sort((a, b) => d3.ascending(a, b));

    var nodeRadius = d3.scaleSqrt().range([1, 30]);

    var linkWidth = d3.scaleLinear().range([1.5, 2 * nodeRadius.range()[0]]);

    var margin = {
      top: nodeRadius.range()[1] + 1,
      right: nodeRadius.range()[1] + 1,
      bottom: nodeRadius.range()[1] + 1,
      left: nodeRadius.range()[1] + 1
    };

    var width = this.width - margin.left - margin.right;
    var height = this.height - margin.top - margin.bottom;

    var x = d3.scaleLinear().range([0, width]);
    var strength = d3.scaleLinear().domain([0, d3.max(data.links.map(d => d.value))]).range([1, 5]);


    this.svgNode.attr('class', 'arc')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    var g = this.svgNode.append('g')
      .attr('transform', 'translate(' + margin.left + ',-' + margin.top + ')');

    var x = d3.scaleBand()
      .domain(data.nodes)
      .range([0, width]);

    g.append('g').call(d3.axisBottom(x)).attr("transform", `translate(0, ${height / 2})`).selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .style("font-size", "7pt")
      .attr("transform", function (d) {
        return "rotate(-65)";
      });

    var link = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(data.links)
      .enter().append('path')
      .attr('id', (l) => { return "link-" + l.id })
      .attr('d', function (d) {
        var sourcex = x(d.source) + x.bandwidth() / 2;
        var targetx = x(d.target) + x.bandwidth() / 2;
        var ypos = height / 2;
        return ['M', sourcex, ypos, 'A',
          (sourcex - targetx) / 2, ',',
          (sourcex - targetx) / 2, 0, 0, ',',
          sourcex < targetx ? 1 : 0, targetx, ',', ypos]
          .join(' ');
      })
      .attr("fill", "transparent")
      .attr('stroke-width', (d) => { return strength(d.value) })
      .style('stroke', 'gray')
      .on('mouseover', function (d) {
        d3.select(this).style('stroke', '#d62333');
      })
      .on('mouseout', function (d) {
        d3.select(this).style('stroke', 'gray');
      });

    var linksToHighlight = [];
    g.selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("cx", (d) => { return x(d) + x.bandwidth() / 2 })
      .attr("cy", height / 2)
      .attr("r", 5)
      .style("fill", "steelblue")
      .on('mouseover', function (d) {
        d3.select(this).style('fill', 'black');
        //this.databyparty.filter((d) => { return d.values.length > 2 });

        linksToHighlight = data.links.filter((l) => { return l.target === d || l.source === d });
        data.links.forEach(lth => {
          if (linksToHighlight.includes(lth)) {
            g.select('#link-' + lth.id).transition().duration(100).style("stroke", "red");
          } else {
            g.select('#link-' + lth.id).transition().duration(100).style("opacity", "0.1");
          }
        })
      }).on('mouseout', function (d) {
        d3.select(this).style('fill', 'steelblue');
        data.links.forEach(lth => {
          if (linksToHighlight.includes(lth)) {
            g.select('#link-' + lth.id).transition().duration(100).style("stroke", "gray");
          } else {
            g.select('#link-' + lth.id).transition().duration(100).style("opacity", "1.0");
          }
        })
      })



    return this.svgNode.node();
  }

}
