import "bootstrap/dist/css/bootstrap.css";
import "./App.scss";
import Window from "./Windows";

import React, { Suspense } from "react";
function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading</div>}>
        <Window />
      </Suspense>
    </div>
  );
}
export default App;
