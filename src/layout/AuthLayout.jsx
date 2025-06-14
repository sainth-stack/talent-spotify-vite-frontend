import React from "react";
import {AuthToken} from "utilities";
import {Redirect} from "react-router-dom";

export function AuthLayout(props) {
  return <div>{AuthToken == null ? <div>{props.children}</div> : <Redirect to="/admin/dashboard" />}</div>;
}
