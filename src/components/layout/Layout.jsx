import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./layout.css";

import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";
import Login from "../../pages/Login";

import ThemeAction from "../../redux/actions/ThemeAction";
import { actions as AuthActions } from "../../redux/AuthReducer";

const Layout = () => {
  const themeReducer = useSelector((state) => state.ThemeReducer);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(AuthActions.logOut());
  };

  useEffect(() => {
    const themeClass = localStorage.getItem("themeMode", "theme-mode-light");
    const colorClass = localStorage.getItem("colorMode", "theme-mode-light");

    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
    // dispatch(
    //   AuthActions.login(
    //     { username: 'admin', password: 'admin123' },
    //     {
    //       onSuccess: () => {
    //       },
    //       onFailure: (textError) => {
    //       },
    //     }
    //   )
    // );
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route
          render={(props) => (
            <div
              className={`layout ${themeReducer.mode} ${themeReducer.color}`}
            >
              <Sidebar {...props} />
              <div className="layout__content">
                <TopNav logout={logout} />
                <div className="layout__content-main">
                  <Routes />
                </div>
              </div>
            </div>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Layout;
