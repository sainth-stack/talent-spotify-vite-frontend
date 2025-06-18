import React, { useState, useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { LoadingIndicator, Validator } from "utilities";
import { login, maLogin } from "../../action/UserAct";
import "./styles.scss";
import eye from "../../assets/svg/eye-fill.svg";
import eye2 from "../../assets/svg/eye-slash.svg";
import { getPrivilege } from "../../action/PrivilegesAct";
import { history } from "../../service/helpers";
import { getPrivileges, setCompanyId, setUser, setUserData } from "../../reducer/userSlice";
import { Link } from "react-router-dom";
import { imageURLs } from "utilities/imageURLs";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const { t } = useTranslation(); // Use useTranslation hook
  const user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
  const privileges = localStorage.getItem("privileges") !== null ? JSON.parse(localStorage.getItem("privileges")) : null;
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [toggle2, setToggle] = useState(false);
  const [, forceUpdate] = useState(false);
  const dispatch = useDispatch();
  const [, setError] = useState(false);
  const validator = Validator();

  const submitLogin = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      setLoading(true);
      let response = dispatch(
        login({
          email: username,
          password: password,
        })
      );
      response
        .then((res) => {
          if (res) {
            localStorage.setItem("user", JSON.stringify(res));
            localStorage.setItem("userRole", JSON.stringify(res.role));
            localStorage.setItem("userRoleId", JSON.stringify(res._id));
            localStorage.setItem("userData", JSON.stringify({ ownerId: res._id, ownerName: res.name }));
            localStorage.setItem("selectedTab", JSON.stringify({ tab: "me" }));
            localStorage.setItem("companyId", JSON.stringify(res.companyId));
            setLoading(false);
            setError("");
            dispatch(setUser({ payload: res }));
            dispatch(setUserData({ payload: { ownerId: res._id, ownerName: res.name } }));
            dispatch(setCompanyId(res.companyId));
            let role = res.role;
            let response = dispatch(getPrivilege(role, res.companyId));
            response.then(({ data, message }) => {
              if (data !== undefined && data.length > 0) {
                localStorage.setItem("privileges", JSON.stringify(data[0].privileges));
                dispatch(getPrivileges(data[0].privileges))
                history.push("/admin/dashboard/me");
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            });
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const toggle = () => {
    setToggle(!toggle2);
  };

  useEffect(() => {
    if (user !== null && privileges !== null) {
      history.replace("/admin/dashboard/me")
    }
  }, [user, privileges]);


  // const handleMicrosoftLogin = async () => {
  //   const data = await loginWithMicrosoft()
  //   const decoded = jwtDecode(data.accessToken);
  //   const email = decoded?.email
  //   maLoginUser(email)
  // }


  const maLoginUser = (email) => {
    setLoading(true);
    let response = dispatch(
      maLogin({
        email: email,
      })
    );
    response
      .then((res) => {
        if (res) {
          localStorage.setItem("user", JSON.stringify(res));
          localStorage.setItem("userRole", JSON.stringify(res.role));
          localStorage.setItem("userRoleId", JSON.stringify(res._id));
          localStorage.setItem("userData", JSON.stringify({ ownerId: res._id, ownerName: res.name }));
          localStorage.setItem("selectedTab", JSON.stringify({ tab: "me" }));
          localStorage.setItem("companyId", JSON.stringify(res.companyId));
          setLoading(false);
          setError("");
          dispatch(setUser({ payload: res }));
          dispatch(setUserData({ payload: { ownerId: res._id, ownerName: res.name } }));
          dispatch(setCompanyId(res.companyId));
          let role = res.role;
          let response = dispatch(getPrivilege(role, res.companyId));
          response.then(({ data, message }) => {
            if (data !== undefined && data.length > 0) {
              localStorage.setItem("privileges", JSON.stringify(data[0].privileges));
              dispatch(getPrivileges(data[0].privileges))
              history.push("/admin/dashboard/me");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          });
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <Suspense fallback={t('Login.Loading')}>
      <div className="container-fluid row m-0 p-0 vh-100">
        <div className="col-md-6 col-xs-12 col-sm-12 text-center pt-lg-5 mt-lg-5">
          <div className="pt-5">
            <img className="logo1" src={imageURLs.Logo} alt="Logo" width={330} />
          </div>
          <div className="row mt-3">
            <div className="col-md-9 col-lg-9 col-sm-12 col-xs-12 mx-auto">
              <h2 className="mb-5">
                {t('Login.PageTitle')}
              </h2>
              <form onSubmit={submitLogin} className="pr-lg-5 pl-lg-5">
                <div className="form-group d-flex flex-column" style={{ textAlign: "start" }}>
                  <label className="label2 fs13 ">{t('Login.UsernameLabel')}*</label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type="text"
                    className="form-control border"
                    id="username"
                    name="username"
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setMessage("")}
                  />
                </div>
                <div className="form-group d-flex flex-column mt-3" style={{ textAlign: "start" }}>
                  <label className="label2 fs13 ">{t('Login.PasswordLabel')}*</label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type={toggle2 ? "text" : "password"}
                    className="form-control border"
                    id="password"
                    name="password"
                    value={password}
                    maxLength={16}
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setMessage("")}
                  />
                  <div className="relative">
                    <img className="eye3" src={toggle2 ? eye2 : eye} onClick={toggle} alt="Toggle Visibility" />
                  </div>
                  <span className="error-message">{message}</span>
                </div>
                <div className="d-flex flex-row-reverse mb-4">
                  <Link to="/auth/forgotpassword">
                    <span className="fs-12 cursor-pointer">
                      {t('Login.ForgotPassword')}
                    </span>
                  </Link>
                </div>
                <button
                  className="font-weight-bold text-uppercase w-100 text-white border-0 login2 mb-3"
                  style={{ backgroundColor: "#466657", borderRadius: "40px", height: "40px" }}
                  type={loading ? "button" : "submit"}
                  disabled={loading}
                >
                  {loading ? t("Login.LoggingIn") : t('Login.PageTitle')} {loading ? <LoadingIndicator size={"1"} /> : null}
                </button>

                <span>{t("Login.or")}</span>

                <button
                  className="w-100 text-black"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    background: 'white'
                  }}
                  type="button"
                  disabled={loading}
                  // onClick={() => handleMicrosoftLogin()}
                >
                  <div className="border" style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: '50%',
                    borderRadius: "40px",
                    height: "40px",
                    gap: '10px'
                  }}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                      alt="Microsoft Logo"
                      style={{ height: "20px", width: "20px" }}
                    />
                    {loading ? t("Login.loadingIn") : t("Login.MLogin")} {loading ? <LoadingIndicator size={"1"} /> : null}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6 p-0 m-0 bg-biscuit text-center pt-4 pb-4 d-none d-lg-block">
          <h5 className="text-green font-weight-bold mt-2">{t("Login.WelcomeMessage")}</h5>
          <h3 className="mt-3">{t("Login.Tagline")}</h3>
          <div className="d-flex justify-content-center">
            <div className="col-md-10">
              <img className="img-fluid p-3" src={imageURLs.logobg} alt="Background" />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
