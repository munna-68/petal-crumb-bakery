import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initMotionSystem } from "./lib/motion";

initMotionSystem();

createRoot(document.getElementById("root")!).render(<App />);

