import arrow from "../assets/svg/add.svg";

// routes.js

// Admin Routes (for admin layout)
export const adminRoutes = [
  {
    icon: arrow,
    title: "Recruitment",
    link: "/admin/recruitment",
    privilegePage: "Recruitment",
  },
  {
    icon: arrow,
    title: "Team Leave",
    link: "/admin/privileges/team-leave",
    privilegePage: "Team Leave",
  },
  {
    icon: arrow,
    title: "Leave Type",
    link: "/admin/privileges/leave-type",
    privilegePage: "Leave Type",
  },
  {
    icon: arrow,
    title: "Eligibility Criteria",
    link: "/admin/privileges/eligibility",
    privilegePage: "Eligibility Criteria",
  },
];

// Sidebar Routes (for general sidebar, shared between roles where applicable)
export const sidebarRoutes = [
  {
    icon: arrow,
    title: "Apply for Leave",
    link: "/privileges/apply-leave",
    privilegePage: "Apply for Leave",
  },
  {
    icon: arrow,
    title: "Time Tracking",
    link: "/privileges/time-tracking",
    privilegePage: "Time Tracking",
  },
  {
    icon: arrow,
    title: "Time History",
    link: "/privileges/time-history",
    privilegePage: "Time History",
  },
];

// Employee Routes (for employee layout)
export const employeeRoutes = [
  {
    icon: arrow,
    title: "Apply for Leave",
    link: "/employee/apply-leave",
    privilegePage: "Apply for Leave",
  },
  {
    icon: arrow,
    title: "Time Tracking",
    link: "/employee/time-tracking",
    privilegePage: "Time Tracking",
  },
  {
    icon: arrow,
    title: "Time History",
    link: "/employee/time-history",
    privilegePage: "Time History",
  },
];