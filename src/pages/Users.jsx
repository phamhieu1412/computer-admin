import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { Button, Input, Popover } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "../css/page.css";
import { actions as UserActions } from "../redux/UsersReducer";

import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
import {
  numToDate,
  customStyles,
  notificationToast,
  successNotificationToast,
  validateEmail,
} from "../utils/numberFormatter";

const customerTableHead = [
  "id",
  "Tên",
  "Ngày tạo",
  "Ngày cập nhập",
  "Active",
  "Cập nhập",
];

const Users = () => {
  const dispatch = useDispatch();
  const usersReducer = useSelector((state) => state.UserReducer);
  const { list, isFetching } = usersReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [infoEdit, setInfoEdit] = useState({});
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(UserActions.getUsers());
  }, []);

  const renderHead = (item, index) => {
    return <th key={index}>{item}</th>;
  };

  const createItem = (item) => {
    setInfoEdit({});
    openModal();
  };
  const editItem = (item) => {
    setInfoEdit(item);
    openModal();
  };
  const deleteItem = (id) => {
    dispatch(
      UserActions.deleteUser(id, {
        onSuccess: (text) => {
          successNotificationToast(text);
        },
        onFailure: (textError) => {
          notificationToast(textError);
        },
      })
    );
  };
  const changePassword = (id) => {
    dispatch(
      UserActions.forgotPassword(
        {
          email: email,
        },
        {
          onSuccess: (text) => {
            successNotificationToast(text);
          },
          onFailure: (textError) => {
            notificationToast(textError);
          },
        }
      )
    );
  };

  const openModal = () => {
    setVisibleModal(true);
  };
  const closeModal = () => {
    setVisibleModal(false);
  };

  const addNewInfo = () => {
    const statusEmail = validateEmail(infoEdit.email);
    if (!statusEmail) {
      notificationToast("Email không hợp lệ!");
      return;
    }
    dispatch(
      UserActions.createUser(
        {
          full_name: infoEdit.full_name ? infoEdit.full_name : "",
          email: infoEdit.email ? infoEdit.email : "",
          is_active: infoEdit.is_active === "true" ? true : false,
          permission_group_id: 1,
        },
        {
          onSuccess: (text) => {
            closeModal();
            successNotificationToast(text);
          },
          onFailure: (textError) => {
            notificationToast(textError);
          },
        }
      )
    );
  };
  const updateInfo = () => {
    const statusEmail = validateEmail(infoEdit.email);
    if (!statusEmail) {
      notificationToast("Email không hợp lệ!");
      return;
    }
    dispatch(
      UserActions.editUser(
        infoEdit.id,
        {
          full_name: infoEdit.full_name ? infoEdit.full_name : "",
          email: infoEdit.email ? infoEdit.email : "",
          is_active: infoEdit.is_active === "true" ? true : false,
          permission_group_id: 1,
        },
        {
          onSuccess: (text) => {
            closeModal();
            successNotificationToast(text);
          },
          onFailure: (textError) => {
            notificationToast(textError);
          },
        }
      )
    );
  };

  const onChangeName = (e) => {
    setInfoEdit({ ...infoEdit, full_name: e.target.value });
  };
  const onChangeEmail = (e) => {
    setInfoEdit({ ...infoEdit, email: e.target.value });
  };

  const handleOptionChange = (e) => {
    setInfoEdit({ ...infoEdit, is_active: e.target.value });
  };

  const renderChooseMethodDelivery = (id) => {
    return (
      <div className="block-form">
        <span style={{ width: "50px" }}>Email lấy lại mật khẩu</span>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <Button onClick={() => changePassword(id)}>Đồng ý</Button>
      </div>
    );
  };

  const renderBody = (item, index) => {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td>{item.full_name}</td>
        <td>{numToDate(item.created_date)}</td>
        <td>{numToDate(item.modified_date)}</td>
        <td>{item.is_active ? "Active" : "NotActive"}</td>
        <td>
          <div style={{ display: "flex", displayDirection: "row" }}>
            <a style={{ width: "40px" }} onClick={() => editItem(item)}>
              <div style={{ padding: "0px" }} className="notification-item">
                <i
                  style={{ marginRight: "0px" }}
                  className="bx bx-edit-alt"
                ></i>
              </div>
            </a>
            <Popover
              style={{ margin: "0px" }}
              content={() => renderChooseMethodDelivery(item.id)}
              trigger="click"
              placement="left"
            >
              <a style={{ width: "40px" }}>
                <div style={{ padding: "0px" }} className="notification-item">
                  <i style={{ marginRight: "0px" }} className="bx bx-key"></i>
                </div>
              </a>
            </Popover>

            <a style={{ width: "40px" }} onClick={() => deleteItem(item.id)}>
              <div style={{ padding: "0px" }} className="notification-item">
                <i style={{ marginRight: "0px" }} className="bx bx-trash"></i>
              </div>
            </a>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <div className="header-title">
        <h2 className="page-header">Quản lý người dùng</h2>
        <a className="btn-header-title" onClick={createItem}>
          <i className="bx bx-add-to-queue" style={{ color: "white" }}></i>
        </a>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {!isFetching ? (
                <Table
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={list}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={visibleModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="modal-banner">
          <h2 className="header-item-edit">
            {infoEdit.id ? "Cập nhập thông tin" : "Thêm mới nhân viên"}
          </h2>
          {infoEdit.id && (
            <div className="id-item-edit">
              <h4>id</h4>
              <p style={{ opacity: 0.5 }}>{infoEdit.id}</p>
            </div>
          )}
          <div className="id-item-edit">
            <h4>Tên</h4>
            <input
              placeholder="Nhập tên"
              type="text"
              onChange={onChangeName}
              value={infoEdit.full_name && infoEdit.full_name}
            />
          </div>
          <div className="id-item-edit">
            <h4>Email</h4>
            <input
              placeholder="Nhập email"
              type="text"
              onChange={onChangeEmail}
              value={infoEdit.email && infoEdit.email}
            />
          </div>
          <div className="id-item-edit">
            <h4>Active</h4>
            <div>
              <input
                type="radio"
                value="true"
                name="active"
                onChange={handleOptionChange}
                checked={
                  (infoEdit.is_active == true ||
                    infoEdit.is_active == "true") &&
                  "true"
                }
              />
              <input
                type="radio"
                value="false"
                name="active"
                onChange={handleOptionChange}
                checked={
                  (infoEdit.is_active == false ||
                    infoEdit.is_active == "false") &&
                  "false"
                }
              />
            </div>
          </div>
          <div className="action-modal">
            <button
              className="update"
              onClick={infoEdit.id ? updateInfo : addNewInfo}
              disabled={isFetching === true ? true : false}
            >
              {infoEdit.id ? "Cập nhập" : "Thêm mới"}
            </button>
            <button
              className="close"
              onClick={closeModal}
              disabled={isFetching === true ? true : false}
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Users;
