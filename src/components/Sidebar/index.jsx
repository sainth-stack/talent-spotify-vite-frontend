import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTranslation } from "react-i18next";
import { sidebarRoutes } from "../../layout/AppRoutes";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div className="shadow bg-danger sidebar-scroll vh-100 sticky-top zindex99 sidebar_new_styles">
      <ul className="sidebar-list-items pl-3">
        <div
          className="d-flex justify-content-center align-items-center rounded-circle bg-white shadow-sm mr-3"
          style={{ width: "50px", height: "50px", zIndex: 99 }}
        >
          {show ? (
            <ArrowForwardIosIcon
              className="img-fluid"
              onClick={() => {
                document.body.classList.toggle("sidebar-icon-only");
                setShow(!show);
              }}
              style={{ cursor: "pointer", fontSize: "20px" }}
            />
          ) : (
            <ArrowBackIosNewIcon
              className="img-fluid"
              onClick={() => {
                document.body.classList.toggle("sidebar-icon-only");
                setShow(!show);
              }}
              style={{ cursor: "pointer", fontSize: "20px" }}
            />
          )}
        </div>

        {sidebarRoutes.length > 0 &&
          sidebarRoutes.map(({ icon, title, link }, index) => (
            <NavLink
              to={link}
              className={`sidebar_new_link text-light text-decoration-none ${
                pathname === link ? "text-active" : ""
              }`}
              key={index}
            >
              <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
                <img
                  src={icon}
                  className="sidebar-list-icon"
                  alt="sidebar-icon"
                />
                <span className="link-text">{t(`${title}`)}</span>
              </li>
            </NavLink>
          ))}
      </ul>
    </div>
  );
}