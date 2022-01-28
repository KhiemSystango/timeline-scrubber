import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

/**
 * Component that renders a ZoomableLineChart
 */

function Zoom2({ data }) {
  const divRef = useRef();
  const [value, setValue] = useState(0);

  // will be called initially and on every data change
  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 960 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([0, width]);

    const xAxis = d3.axisBottom(xScale).tickSize(-height);

    const zoom = d3.zoom().on("zoom", zoomed);

    const svg = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);
    // .on("click", function (d) {
    //   console.log(d.value);
    // });

    const content = svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "red");

    content
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("cx", (value, index) => xScale(value.date))
      // .attr("cy", (value, index) => yScale(value.value))
      // .attr("x", (i) => xScale(X[i]))
      // .attr("y", (i) => yScale(Y[i]))
      // .attr("height", (i) => yScale(0) - yScale(Y[i]))
      .on("click", function (e, i, d) {
        console.log(e, i, d);
      });

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // svg.on("click", function (e, d, i, f) {
    //   const coords = d3.pointer(e, this);
    //   console.log(e, d, i, f);
    //   const x = Math.round(xScale.invert(coords[0]));
    //   console.log(x);
    // });

    function zoomed(e) {
      const newX = e.transform.rescaleX(xScale);
      svg.select(".x.axis").call(d3.axisBottom(newX).tickSize(-height));
    }
  }, []);

  return (
    <React.Fragment>
      <div ref={divRef}></div>
      <div>{value}</div>
    </React.Fragment>
  );
}

export default Zoom2;
