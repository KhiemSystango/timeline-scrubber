import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a ZoomableLineChart
 */

function Zoom1({ data, id = "myZoomableLineChart" }) {
  const divRef = useRef();

  // will be called initially and on every data change
  useEffect(() => {
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3
      .scaleTime()
      .domain([new Date(2012, 0, 1), new Date(2013, 0, 1)])
      .range([0, width]);

    var y = d3
      .scaleLinear()
      .domain([-height / 2, height / 2])
      .range([height, 0]);

    var xAxis = d3.axisBottom(x).tickSize(-height);

    var yAxis = d3.axisLeft(y).ticks(5).tickSize(-width);

    var zoom = d3.zoom().on("zoom", zoomed);

    var svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // svg
    //   .append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    //   .call(zoom)
    //   .on("mouseup", function (d) {
    //     console.log(x.domain());
    //   });

    svg.append("rect").attr("width", width).attr("height", height);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g").attr("class", "y axis").call(yAxis);

    function zoomed() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);
    }
  }, []);

  return (
    <React.Fragment>
      <div ref={divRef}></div>
    </React.Fragment>
  );
}

export default Zoom1;
