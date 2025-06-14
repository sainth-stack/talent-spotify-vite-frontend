import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // ✅ Make sure this is imported
import { store2 } from './service/helpers';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store2}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
