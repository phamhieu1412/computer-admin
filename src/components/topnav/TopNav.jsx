import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import "./topnav.css";
import Dropdown from "../dropdown/Dropdown";
import ThemeMenu from "../thememenu/ThemeMenu";

import notifications from "../../assets/JsonData/notification.json";
import user_image from "../../assets/images/tuat.png";
import user_menu from "../../assets/JsonData/user_menus.json";

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img src={user.image} alt="" />
    </div>
    <div className="topnav__right-user__name">{user.display_name}</div>
  </div>
);

const TopNav = (props) => {
  const { logout } = props;
  const history = useHistory();
  const [curr_user, setCurr_user] = useState({
    display_name: "",
    image: "",
  });

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    const stringUserInfo = localStorage.getItem("userInfo");

    if (stringUserInfo?.length > 0) {
      const userInfo =
        stringUserInfo.length > 0 ? JSON.parse(stringUserInfo) : "";
      setCurr_user({
        display_name: userInfo.full_name,
        image: userInfo.avatar_url ? userInfo.avatar_url : user_image,
      });
    } else {
      history.push("/login");
    }
  };

  const onLogout = () => {
    logout();
    history.push("/login");
  };

  const renderUserMenu = (item, index) => {
    if (item.content === "Logout") {
      return (
        <a onClick={onLogout} key={index}>
          <div className="notification-item">
            <i className={item.icon}></i>
            <span>{item.content}</span>
          </div>
        </a>
      );
    }
    return (
      <Link to="/login" key={index}>
        <div className="notification-item">
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
          {/* dropdown here */}
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
