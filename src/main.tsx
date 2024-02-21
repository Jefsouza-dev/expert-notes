import React from "react";
import { render } from "react-dom";
import { App } from "./app";
import { Toaster } from "sonner";
import "./index.css";

render(
  <React.StrictMode>
    <App />
    <Toaster richColors />
  </React.StrictMode>,
  document.getElementById("root")
);
