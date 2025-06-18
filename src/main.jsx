import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; 
import { store2 } from "./service/helpers";

import 'bootstrap/dist/css/bootstrap.min.css'; 
import './assets/scss/index.scss';             
import './assets/scss/icons/style.css';       



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store2}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
