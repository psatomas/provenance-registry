import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { WalletProvider } from "./lib/WalletProvider";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WalletProvider>
            <App />
        </WalletProvider>
    </StrictMode>
);