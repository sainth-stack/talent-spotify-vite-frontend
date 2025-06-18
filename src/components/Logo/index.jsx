import React from 'react'
import { Link } from 'react-router-dom'
// import appLogo1 from '../../assets/images/appLogo.jpg'
// import logo2 from '../../assets/images/logo2.png'

import appLogo1 from "../../assets/images/AppNewLogo.png";
import logo2 from "../../assets/images/AppNewLogo.png";

import { useTranslation } from 'react-i18next'

export default function Logo({ logoImg = "1" }) {
  const {t} = useTranslation()
  return (
    <>
      <Link to="/" className="text-decoration-none">
        <div className="d-flex">
          <img
            src={logoImg === "2" ? logo2 : appLogo1}
            className="appLogo"
            alt="applogo"
          />
          &nbsp;&nbsp;
          {/* <p className="text-dark logoText"><span className="talent">{t("Navbar.TALENT")}</span><span className="spotify">{t("Navbar.SPOTIFY")}</span></p> */}
        </div>
      </Link>
    </>
  );
}
