import React, { useEffect, useState } from "react";
import { adminActivityLinks } from "routes/routes";
import setup from "../../assets/svg/setups.svg";
import { NavLink } from "react-router-dom";
import previlages from "assets/svg/previlages.svg";
import "./styles.scss";
import { useLocation } from "react-router-dom";
import { rolesAndPrevilages } from "routes/routes";
import { AuthRole } from "utilities";
import { useTranslation } from "react-i18next";

export default function AdminActivities(props) {
  let { pathname } = useLocation();
  const { t } = useTranslation();

  const [routes, setRoutes] = useState(rolesAndPrevilages)
  useEffect(() => {
    if (props.AuthRole === 'HR Admin') {
      const previlages = props.privilege.filter((item) => item.category === 'Previleges')
      const finalRoutes = routes.filter((route) => {
        const finPreviliges = previlages.filter((item) => (item.page === route.title && item.view))
        return finPreviliges.length > 0
      })
      setRoutes(finalRoutes)
    }
  }, [props])

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
        {adminActivityLinks
          .slice(AuthRole === "HR Admin" ? 1 : 0, adminActivityLinks.length)
          .map(({ icon, title, link }, index) => (
            <NavLink
              to={link}
              className="sidebar_new_link text-light text-decoration-none"
              activeClassName="active-nav-item"
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
        {routes?.map(({ icon, title, link }, index) => (
          <NavLink
            to={link}
            className="sidebar_new_link text-light text-decoration-none"
            activeClassName="active-nav-item"
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