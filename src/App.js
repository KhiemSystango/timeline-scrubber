import React, { useState } from "react";
import "./App.css";
import ZoomableLineChart from "./ZoomableLineChart";
import ZoomableBarChart2 from "./ZoomableBarChart2";
import ZoomableBarChart3 from "./ZoomableBarChart3";
import ZoomableBarChart4 from "./ZoomableBarChart4";
import Timeline from "./Timeline";
import Zoom1 from "./Zoom1";
import Zoom2 from "./Zoom2";
const data = require("./flights.json");

function App() {
  const [data1, setData1] = useState(
    Array.from({ length: 50 }, () => Math.round(Math.random() * 100))
  );

  return (
    <React.Fragment>
      <h2>Timeline</h2>
      {/* <ZoomableLineChart data={data1} /> */}
      {/* <ZoomableBarChart2 data={data} /> */}
      {/* <ZoomableBarChart3 data={data} /> */}
      {/* <ZoomableBarChart4 data={data} /> */}
      <Timeline data={data} />
      {/* <Zoom1 data={data}/> */}
      {/* <Zoom2 data={data} /> */}
      {/* <button
        onClick={() => setData([...data, Math.round(Math.random() * 100)])}
      >
        Add data
      </button> */}
    </React.Fragment>
  );
}

export default App;
