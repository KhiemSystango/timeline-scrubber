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
  bisector,
  event,
  axisTop,
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a ZoomableLineChart
 */

function Timeline({ data, id = "myZoomableLineChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const lulRef = useRef();
  const [currentZoomState, setCurrentZoomState] = useState();
  const [display, setDisplay] = useState({ date: null, value: 0 });

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const lul = select(lulRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const X = map(data, (v, i) => new Date(v.date));

    // scales + line generator
    const xScale = scaleTime()
      .domain(extent(X))
      .range([10, width - 10]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }
    const xAxis = axisTop(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const rule = svg.select(".vertical-line");

    const bisectDate = bisector(function (d, x) {
      return new Date(d.date) - x;
    }).right;

    let isDown = false;

    svg
      .on("mousedown", (event) => {
        svg.on(".zoom", null);
        isDown = true;
        event.stopPropagation();

        const x = pointer(event, svg.node())[0] + 0.5;
        rule.attr("x1", x + 1).attr("x2", x + 1);

        const coords = pointer(event, svg.node());
        const x0 = xScale.invert(coords[0]);
        const i = bisectDate(data, x0);
        let selectedData = data[i];
        setDisplay(selectedData);
      })
      .on("mousemove", (event) => {
        if (isDown) {
          const x = pointer(event, svg.node())[0] + 0.5;
          rule.attr("x1", x + 1).attr("x2", x + 1);

          const coords = pointer(event, svg.node());
          const x0 = xScale.invert(coords[0]);
          const i = bisectDate(data, x0);
          let selectedData = data[i];
          setDisplay(selectedData);
        }
      })
      .on("mouseup", (event) => {
        isDown = false;
        svg.call(zoomBehavior);
      });

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
      })
      .on("end", () => {
        isDown = false;
      });

    if (!isDown) {
      svg.call(zoomBehavior);
      lul.call(zoomBehavior);
    } else {
      svg.on(".zoom", null);
      lul.on(".zoom", null);
    }

    lul
      .on("mousedown", (event) => {
        lul.on(".zoom", null);
        isDown = true;
        event.stopPropagation();

        const x = pointer(event, svg.node())[0] + 0.5;
        rule.attr("x1", x + 1).attr("x2", x + 1);

        const coords = pointer(event, svg.node());
        const x0 = xScale.invert(coords[0]);
        const i = bisectDate(data, x0);
        let selectedData = data[i];
        setDisplay(selectedData);
      })
      .on("mousemove", (event) => {
        if (isDown) {
          const x = pointer(event, svg.node())[0] + 0.5;
          rule.attr("x1", x + 1).attr("x2", x + 1);

          const coords = pointer(event, svg.node());
          const x0 = xScale.invert(coords[0]);
          const i = bisectDate(data, x0);
          let selectedData = data[i];
          setDisplay(selectedData);
        }
      })
      .on("mouseup", (event) => {
        isDown = false;
        lul.call(zoomBehavior);
      });

    // const handleKeydown = (e) => {
    //   const x = pointer(e, svg.node())[0] + 0.5;
    //   rule.attr("x1", x + 1).attr("x2", x + 1);
    //   const coords = pointer(e, svg.node());
    //   const x0 = xScale.invert(coords[0]);
    //   const i = bisectDate(data, x0);
    //   let selectedData = data[i];
    //   setDisplay(selectedData);
    // };

    lul.call(zoomBehavior);

    // lulRef.current.addEventListener("click", handleKeydown);

    // return () => {
    //   lulRef.current.removeEventListener("click", handleKeydown);
    // };
  }, [currentZoomState, data, dimensions]);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <svg ref={svgRef} style={{ height: "40px" }}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis" style={{ color: "white" }} />
          <g className="y-axis" />
          <line
            className="vertical-line"
            stroke="#ffffff"
            y1="0"
            y2="75"
            x1="0"
            x2="0"
          ></line>
        </svg>
      </div>
      <div
        ref={lulRef}
        style={{
          backgroundColor: "#000",
          marginBottom: "2rem",
          height: "35px",
        }}
      ></div>
      <div>{display && display.date}</div>
      <div>{display && display.value}</div>
    </React.Fragment>
  );
}

export default Timeline;
