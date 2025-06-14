// toast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = ({ type = "success", message, time = 4000 }) => {
  const config = {
    position: "top-right",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  if (Array.isArray(message)) {
    message.forEach((item) => {
      toast[item.type || type](item.message, config);
    });
  } else {
    toast[type](message, config);
  }
};
