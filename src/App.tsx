import React from "react";
import "./App.css";
import { useMatrix } from "./context/MatrixContext";
import { MatrixInput } from "./components/MatrixInput";
import { Matrix } from "./components/Matrix";

function App() {
  const { matrix } = useMatrix();

  return (
    <div className="">
      {matrix.rows ? <Matrix /> : <MatrixInput />}
    </div>
  );
}

export default App;
