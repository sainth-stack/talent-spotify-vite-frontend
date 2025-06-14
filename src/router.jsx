// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import RecruitmentManagement from "./pages/vihanga/pages/Recruitment/index";
import NotFoundPage from "./NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
     element: <RecruitmentManagement />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
