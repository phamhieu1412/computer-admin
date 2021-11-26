import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "../css/login.css";
import "react-toastify/dist/ReactToastify.css";
import { actions as AuthActions } from "../redux/AuthReducer";

const notificationToast = (text) =>
  toast.error(text, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [info, setInfo] = useState({ email: "", password: "" });

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      AuthActions.login(
        { email: info.email, password: info.password },
        {
          onSuccess: () => {
            history.push("/dashboard");
          },
          onFailure: (textError) => {
            notificationToast(textError);
          },
        }
      )
    );
  };

  const onChangeEmail = (e) => {
    setInfo({ ...info, email: e.target.value });
  };
  const onChangePassword = (e) => {
    setInfo({ ...info, password: e.target.value });
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <form onSubmit={submitHandler}>
        <div className="form-inner">
          <h2>Đăng nhập</h2>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="email"
              id="email"
              value={info.email}
              onChange={onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              className="password"
              id="password"
              value={info.password}
              onChange={onChangePassword}
            />
          </div>

          <input type="submit" value="Đăng Nhập" />
        </div>
      </form>
    </div>
  );
};

export default Login;
