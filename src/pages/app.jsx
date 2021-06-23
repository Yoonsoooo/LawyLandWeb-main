//import Login from './login.jsx'
//import Layout from './layout.jsx'
import React from "react";
import ReactDOM from "react-dom";
import {
  Route,
  Switch,
  BrowserRouter,
  Redirect,
  withRouter,
} from "react-router-dom";
import { Login, Layout } from "./index.async.jsx";

(function () {
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route
          path="/Login"
          render={(props) =>
            sessionStorage.getItem("user") ? (
              <Redirect
                to={{
                  pathname: "/homepage/home",
                }}
              />
            ) : (
              <Login {...props} />
            )
          }
        />
        <Route
          path="/homepage"
          render={(props) =>
            sessionStorage.getItem("user") ? (
              <Layout {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                }}
              />
            )
          }
        />
      </Switch>
    </BrowserRouter>,
    document.getElementById("app_render_place")
  );
})();
