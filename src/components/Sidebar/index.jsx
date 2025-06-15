/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { links } from "./routes/routes";
import { NavLink, useLocation } from "react-router-dom";
import "./styles.scss";
import AdminActivities from "./AdminActivities"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import packageJson from "../../../package.json";
import { AuthLineManager, AuthRole, LoadingIndicator } from "utilities";
import arrow from 'assets/images/arrow.svg'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { keyresults } from "reducer";
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const [, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [show, setShow] = useState(false);
  let existingPrivileges = useSelector(store => store.user.privileges);
  const [privileges,] = useState(existingPrivileges !== null ? existingPrivileges : []);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const fetchPrivileges = () => {
    try {
      setLoading(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  useEffect(() => {
    fetchPrivileges();
  }, [])
  const { t } = useTranslation(); // Initialize useTranslation hook

  return (
    <div className="shadow sidebar-scroll vh-100 sticky-top zindex99 sidebar_new_styles">
      <ul className="sidebar-list-items pl-3 ">
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


        {(privileges && privileges.length > 0) || AuthRole === "Super Admin" ? (
          ((privileges && privileges.length > 0) ||
            AuthRole === "Super Admin") &&
          links().length > 0 &&
          links().map(({ icon, title, link }, index) => (
            <span key={index}>
              {link === "/admin/objectives" ? (
                <a
                  href={link}
                  className={`  text-light text-decoration-none ${
                    pathname === "/admin/objectives" ? "text-active" : ""
                  }`}
                  key={index}
                >
                  {" "}
                  <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
                    <img
                      src={icon}
                      className="sidebar-list-icon"
                      alt="sidebar-icon"
                    />
                    <span className="link-text">{t(`${title}`)}</span>
                  </li>
                </a>
              ) : (
                <NavLink
                  to={link}
                  className={` sidebar_new_link text-light text-decoration-none ${
                    (pathname === "/admin/dashboard/me" &&
                      link === "/admin/dashboard/me") ||
                    (pathname === "/admin/dashboard/myteam" &&
                      link === "/admin/dashboard/myteam")
                      ? "text-active"
                      : ""
                  }`}
                  onClick={() => {
                    if (pathname === "/admin/keyresults") {
                      dispatch(
                        keyresults({ message: "data", data: [], success: true })
                      );
                    }
                  }}
                  activeClassName="text-active"
                  key={index}
                >
                  {" "}
                  <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
                    <img
                      src={icon}
                      className="sidebar-list-icon"
                      alt="sidebar-icon"
                    />
                    <span className="link-text">{t(`${title}`)}</span>
                  </li>
                </NavLink>
              )}
            </span>
          ))
        ) : (
          <LoadingIndicator size="2" />
        )}
        {((privileges &&
          privileges.length > 0 &&
          privileges.filter(
            (privilege) => privilege.page === "Roles and Privileges"
          ).length > 0 &&
          privileges.filter(
            (privilege) => privilege.page === "Roles and Privileges"
          )[0].view) ||
          AuthRole === "Super Admin" ||
          AuthRole === "HR Admin" ||
          AuthLineManager === "" ||
          AuthLineManager === null) && (
          <div>
            <div className="adminActivities">
              {t(`Sidebar.AdminActivities`)}
            </div>
            <AdminActivities AuthRole={AuthRole} privilege={privileges} />
          </div>
        )}
      </ul>
      {/* <p className="m-3 fs-10" style={{ color: "#f8f9fa" }}>Version 0.1 (Last Updated On: {window.moment(packageJson.buildDate).format("DD/MM/YYYY hh:mm:ss A")})</p> */}
    </div>
  );
}
