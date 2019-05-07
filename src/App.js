import React from "react";

import Project5 from "./project5";
import Project6 from "./project6";
import Project7 from "./project7";
import "./App.css";

const projects = [null, null, null, null, null, Project5, Project6, Project7];

function App() {
  let projectNum = 7;

  return (
    <div className="App">
      <header className="App-header">
        {projects[projectNum]()}
      </header>
    </div>
  );
}

export default App;
