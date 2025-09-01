// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./styles.css";
import App from "./App";

// Crea el cliente
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //  Envuelve tu App en el proveedor
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
