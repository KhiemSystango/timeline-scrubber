import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisBottom,
  axisLeft,
  zoom,
  map,
  scaleTime,
  extent,
  pointer,
  mouse,
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a ZoomableLineChart
 */

function ZoomableBarChart2({ data, id = "myZoomableLineChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();
  const [display, setDisplay] = useState({ date: null, value: 0 });

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const X = map(data, (v, i) => new Date(v.date));
    const Y = map(data, (v, i) => v.value);

    // scales + line generator
    const xScale = scaleTime()
      .domain(extent(X))
      .range([10, width - 10]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yScale = scaleLinear()
      .domain([0, max(Y)])
      .range([height - 10, 10]);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    svgContent
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("cx", (d) => xScale(new Date(d.date)))
      .attr("cy", (d) => yScale(d.value))
      .on("click", function (e, d) {
        setDisplay(d);
      });

    // const vertical = select(wrapperRef.current)
    //   .append("div")
    //   .attr("class", "remove")
    //   .style("position", "absolute")
    //   .style("z-index", "19")
    //   .style("width", "1px")
    //   .style("height", "300px")
    //   .style("top", "0px")
    //   .style("bottom", "30px")
    //   .style("left", "0px")
    //   .style("background", "black");

    // select(wrapperRef.current)
    //   .on("click", function (e) {
    //     const coords = pointer(e, this);
    //     const x = Math.round(xScale.invert(coords[0]));
    //     console.log(new Date(x));
    //     vertical.style("left", coords[0] + "px");
    //   })
    // .on("mouseover", function () {
    // mousex = d3.mouse(this);
    // mousex = mousex[0] + 5;
    // vertical.style("left", mousex + "px");
    // });

    // svg.on("mousemove touchmove", (event) => {
    //   const x = d3.pointer(event, svg.node())[0] + 0.5;
    //   rule.attr("x1", x).attr("x2", x);
    // });

    // svg.on("click", function (e, d, i, f) {
    //   const coords = pointer(e, this);
    //   console.log(e, d, i, f);
    //   const x = Math.round(xScale.invert(coords[0]));
    //   console.log(x);
    // });

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);
  }, [currentZoomState, data, dimensions]);

  return (
    <React.Fragment>
      <div
        ref={wrapperRef}
        style={{ marginBottom: "2rem", position: "relative" }}
      >
        <svg ref={svgRef} style={{ height: "300px" }}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
      <div>{display.date}</div>
      <div>{display.value}</div>
    </React.Fragment>
  );
}

export default ZoomableBarChart2;
