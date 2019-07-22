import React from "react";

import Project5 from "./project5";
import Project6 from "./project6";
import Project7 from "./project7";
import Project8 from "./project8";
import Project9 from "./project9";
import Project10 from "./project10";
import Project11 from "./project11";
import Project12 from "./project12";
import Project13 from "./project13";
import Project14 from "./project14";
import Project15 from "./project15";
import "./App.css";

const projects = [
  null,
  null,
  null,
  null,
  null,
  Project5,
  Project6,
  Project7,
  Project8,
  Project9,
  Project10,
  Project11,
  Project12,
  Project13,
  Project14,
  Project15
];

function App() {
  return (
    <div className="App">
      <header className="App-header">{projects[projects.length-1]()}</header>
    </div>
  );
}

export default App;
