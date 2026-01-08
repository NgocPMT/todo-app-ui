import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DayjsWrapper from "./components/DayjsWrapper.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DayjsWrapper>
      <App />
    </DayjsWrapper>
  </StrictMode>
);
