import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MatrixProvider } from "./context/MatrixContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <MatrixProvider>
    <App />
  </MatrixProvider>
);
