import React from "react";

import Project5 from "./project5";
import Project6 from "./project6";
import Project7 from "./project7";
import Project8 from "./project8";
import "./App.css";

const projects = [null, null, null, null, null, Project5, Project6, Project7, Project8];
const ProjectNum = 8;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {projects[ProjectNum]()}
      </header>
    </div>
  );
}

export default App;
