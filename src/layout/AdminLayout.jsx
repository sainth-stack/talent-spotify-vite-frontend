import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import useWindowSize from "../components/UseWindowSize";
import NewTopHeader from "../components/Navbar/newTopHeader";

export function AdminLayout({ children }) {
  const isMobile = useWindowSize();
  const location = useLocation();

  const isProfilePage = ["profile", "feedback", "document-upload"].some(
    (keyword) => location.pathname.toLowerCase().includes(keyword)
  );

  return (
    <div className="row p-0 m-0">
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 m-0 bg-light">
        {isProfilePage ? (
          <>
            {/* <NewTopHeader /> */}
            <div className="p-0 m-0 w-100">{children}</div>
          </>
        ) : (
          <>
            <Navbar />
            <div className="d-flex justify-content-between">
              <div className={isMobile ? "d-none d-md-block d-lg-block" : ""}>
                <Sidebar />
              </div>
              <div className="p-0 m-0 w-100">{children}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}