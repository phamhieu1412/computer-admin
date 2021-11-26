import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";

import "react-toastify/dist/ReactToastify.css";
import "../css/page.css";
import { actions as SupplierActions } from "../redux/SupplierReducer";

import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
import {
  numToDate,
  customStyles,
  notificationToast,
  successNotificationToast,
  isVietnamesePhoneNumber,
  validateEmail,
} from "../utils/numberFormatter";

const customerTableHead = [
  "id",
  "Tên",
  "Số điện thoại",
  "Email",
  "Địa chỉ",
  "Ngày tạo",
  "Ngày cập nhập",
  "Cập nhập",
];

const Suppliers = () => {
  const dispatch = useDispatch();
  const supplierReducer = useSelector((state) => state.SupplierReducer);
  const { list, isFetching } = supplierReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [infoEdit, setInfoEdit] = useState({});

  useEffect(() => {
    dispatch(SupplierActions.getSuppliers());
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
      SupplierActions.deleteSupplier(id, {
        onSuccess: (text) => {
          successNotificationToast(text);
        },
        onFailure: (textError) => {
          notificationToast(textError);
        },
      })
    );
  };

  const openModal = () => {
    setVisibleModal(true);
  };
  const closeModal = () => {
    setVisibleModal(false);
  };

  const addNewInfo = () => {
    const statusPhone = isVietnamesePhoneNumber(infoEdit.phone);
    const statusEmail = validateEmail(infoEdit.email);

    if (!statusPhone) {
      notificationToast("Số điện thoại không hợp lệ!");
      return;
    }
    if (!statusEmail) {
      notificationToast("Email không hợp lệ!");
      return;
    }

    dispatch(
      SupplierActions.createSupplier(
        {
          name: infoEdit.name ? infoEdit.name : "",
          email: infoEdit.email ? infoEdit.email : "",
          phone: infoEdit.phone ? infoEdit.phone : "",
          address: infoEdit.address ? infoEdit.address : "",
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
    dispatch(
      SupplierActions.updateBanner(
        infoEdit.id,
        {
          name: infoEdit.name ? infoEdit.name : "",
          email: infoEdit.email ? infoEdit.email : "",
          phone: infoEdit.phone ? infoEdit.phone : "",
          address: infoEdit.address ? infoEdit.address : "",
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
    setInfoEdit({ ...infoEdit, name: e.target.value });
  };
  const onChangeEmail = (e) => {
    setInfoEdit({ ...infoEdit, email: e.target.value });
  };
  const onChangePhone = (e) => {
    setInfoEdit({ ...infoEdit, phone: e.target.value });
  };
  const onChangeAddress = (e) => {
    setInfoEdit({ ...infoEdit, address: e.target.value });
  };

  const renderBody = (item, index) => {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>{item.address}</td>
        <td>{numToDate(item.created_date)}</td>
        <td>{numToDate(item.modified_date)}</td>
        <td>
          <div style={{ display: "flex", displayDirection: "row" }}>
            <a onClick={() => editItem(item)}>
              <div className="notification-item">
                <i className="bx bx-edit-alt"></i>
              </div>
            </a>
            <a onClick={() => deleteItem(item.id)}>
              <div className="notification-item">
                <i className="bx bx-trash"></i>
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
        <h2 className="page-header">Nhà cung cấp</h2>
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
        contentLabel="Example Modal"
      >
        <div className="modal-banner">
          <h2 className="header-item-edit">Cập nhập thông tin</h2>
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
              value={infoEdit.name && infoEdit.name}
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
            <h4>Số điện thoại</h4>
            <input
              placeholder="Nhập số điện thoại "
              type="text"
              onChange={onChangePhone}
              value={infoEdit.phone && infoEdit.phone}
              maxLength={10}
            />
          </div>
          <div className="id-item-edit">
            <h4>Địa chỉ</h4>
            <input
              placeholder="Nhập địa chỉ"
              type="text"
              onChange={onChangeAddress}
              value={infoEdit.address && infoEdit.address}
            />
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

export default Suppliers;
