// src/router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts
// import { AdminLayout } from "./layout/AdminLayout";
// import { AuthLayout } from "./layout/AuthLayout";
// import { CandidateLayout } from "./layout/CandidateLayout";

// Pages
import RecruitmentManagement from "./pages/vihanga/pages/Recruitment";
import ApplyforLeave from "./pages/vihanga/pages/employeePortal/absencetimeoff/applyforLeave";
import NotFoundPage from "./NotFoundPage";
import CandidateCreate from './pages/vihanga/pages/Recruitment/sections/candidateDetails/index';

// Auth Pages (example)

const router = createBrowserRouter([
  // Auth routes
  {
    path: "/auth",
    // element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <div style={{ padding: "2rem", fontSize: "1.25rem", textAlign: "center" }}>
        🔒 This is an auth Layout.
      </div>
      }
    ]
  },

  // Admin routes
  {
    path: "/admin",
    // element: <AdminLayout />,
    children: [
      {
        path: "recruitment",
        element: <RecruitmentManagement />
      },
      {
        path: "recruitment/candidate/create",
        element: <CandidateCreate />
      },
      {
        path: "recruitment/candidate/create/:candidateId", 
        element: <CandidateCreate />
      },
      // Add more admin child routes here
    ]
  },

  // Candidate or Employee routes
  {
    path: "/candidate",
    // element: <CandidateLayout />,
    children: [
      {
        path: "apply-leave",
        element: <div style={{ padding: "2rem", fontSize: "1.25rem", textAlign: "center" }}>
        🔒 This is an Candidate Layout.
      </div>
      }
      // Add more employee/candidate routes here
    ]
  },

  // Catch-all 404 route
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;
