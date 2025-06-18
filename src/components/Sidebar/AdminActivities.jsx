import React from "react";
import setup from "../../assets/svg/setups.svg";
import previlages from "../../assets/svg/previlages.svg";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminRoutes } from "../../layout/AppRoutes";

export default function AdminActivities() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div>
      <div
        className="setup text-light"
        data-toggle="collapse"
        data-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
          <img src={setup} className="sidebar-list-icon" alt="settings" />
          <span className="link-text">{t("Sidebar.setups")}</span>
        </li>
      </div>
      <div className="collapse" id="collapseExample">
        {adminRoutes.map(({ icon, title, link }, index) => (
          <NavLink
            to={link}
            className={`sidebar_new_link text-light text-decoration-none ${
              pathname === link ? "active-nav-item" : ""
            }`}
            key={index}
            exact
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
      </div>
      <div
        className="previliges text-light"
        data-toggle="collapse"
        data-target="#collapseExample2"
        aria-expanded="false"
        aria-controls="collapseExample2"
      >
        <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
          <img src={previlages} className="sidebar-list-icon" alt="settings" />
          <span className="link-text">{t("Sidebar.privileges")}</span>
        </li>
      </div>
      <div className="collapse" id="collapseExample2">
        {adminRoutes.map(({ icon, title, link }, index) => (
          <NavLink
            to={link}
            className={`sidebar_new_link text-light text-decoration-none ${
              pathname === link ? "active-nav-item" : ""
            }`}
            key={index}
            exact
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
      </div>
    </div>
  );
}