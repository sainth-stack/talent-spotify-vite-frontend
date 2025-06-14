import { axiosInstance, logout } from "./utilities";

export var api = async function ({
  method = "get",
  api,
  body,
  status = false,
  token = "",
  baseURL = "auth",
}) {
  return await new Promise((resolve, reject) => {
    // setting token
    axiosInstance.defaults.headers.common["Authorization"] =
      localStorage.getItem("user") !== null
        ? `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
        : "";

    axiosInstance[method](`${getServiceUrl("production")}${api}`, body ? body : "")
      .then((data) => {
        resolve(statusHelper(status, data));
      })
      .catch((error) => {
        try {
          if (error.response) {
            reject(statusHelper(status, error.response));
          } else {
            reject(error);
          }
        } catch (err) {
          reject(err);
        }
      });
  });
};

var statusHelper = (status, data) => {
  if (data.status === 401 || data.status === 403) {
    logout();
  }
  if (status) {
    return {
      status: data.status,
      ...data.data,
    };
  } else {
    return data.data;
  }
};

export let getServiceUrl = (baseURL) => {
  let finalURL = "";



  

  switch ("local") {
    case "production":
      finalURL = "https://talentspotifyapp.com/api/";
      break;
    case "ollaa-company":
      finalURL = "https://talentspotifyapp.com/api/";
      break;
    case "local":
      finalURL = "http://localhost:4000/api/";
      break;
    default:
      finalURL = "http://localhost:4000/api/";
      break;
  }
  return finalURL;
};
