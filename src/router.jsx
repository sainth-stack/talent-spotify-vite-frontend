// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import RecruitmentManagement from "./pages/vihanga/pages/Recruitment/index";
import NotFoundPage from "./NotFoundPage";
import ApplyforLeave from './pages/vihanga/pages/employeePortal/absencetimeoff/applyforLeave/index';

const router = createBrowserRouter([
  {
    path: "/",
     element: <ApplyforLeave />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
