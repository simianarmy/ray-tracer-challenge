import React from "react";

import Project5 from "./project5";
import Project6 from "./project6";
import "./App.css";

function App() {
  let projectNum = 6;
  const projects = [null, null, null, null, null, Project5, Project6];

  return (
    <div className="App">
      <header className="App-header">
        {projects[projectNum]()}
      </header>
    </div>
  );
}

export default App;
