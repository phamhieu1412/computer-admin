import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { Switch } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "../css/page.css";
import { actions as CustomerActions } from "../redux/CustomersReducer";

import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
import FilterContent from "../components/customer/FilterContent";
import {
  numToDate,
  customStyles,
  notificationToast,
  successNotificationToast,
} from "../utils/numberFormatter";

const customerTableHead = [
  "id",
  "Tên",
  "Số diện thoại",
  "Ngày tạo",
  "Cập nhập",
];

const Customers = () => {
  const dispatch = useDispatch();
  const customerReducer = useSelector((state) => state.CustomerReducer);
  const { list, isFetching, isFetchingDetail, detail } = customerReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalFilter, setVisibleModalFilter] = useState(false);

  useEffect(() => {
    dispatch(CustomerActions.getCustomers());
  }, []);

  const renderHead = (item, index) => {
    return <th key={index}>{item}</th>;
  };
  const deleteItem = (id) => {
    dispatch(
      CustomerActions.deleteCustomer(id, {
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
    setVisibleModalFilter(false);
  };

  const detailCustomer = (id) => {
    dispatch(CustomerActions.getDetailCustomer(id));
    setVisibleModal(true);
  };

  const renderBody = (item, index) => {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td>{item.full_name}</td>
        <td>{item.phone}</td>
        <td>{numToDate(item.created_date)}</td>
        <td>
          <div style={{ display: "flex", displayDirection: "row" }}>
            <a
              style={{ width: "40px" }}
              onClick={() => detailCustomer(item.id)}
            >
              <div style={{ padding: "0px" }} className="notification-item">
                <i
                  style={{ marginRight: "0px" }}
                  className="bx bx-list-ul"
                ></i>
              </div>
            </a>
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
        <h2 className="page-header">Quản lý khách hàng</h2>
        <a
          className="btn-header-title"
          onClick={() => setVisibleModalFilter(true)}
        >
          <i className="bx bx-filter-alt" style={{ color: "white" }}></i>
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
        isOpen={visibleModalFilter}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="modal-banner" style={{ width: "500px" }}>
          <h2 className="header-item-edit">Tìm kiếm theo</h2>
          <FilterContent onCancelModalCreate={closeModal} />
        </div>
      </Modal>

      <Modal
        isOpen={visibleModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="modal-banner" style={{ width: "500px" }}>
          <h2 className="header-item-edit">Thông tin khách hàng</h2>
          {isFetchingDetail ? (
            <Loading />
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>id</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={detail.id}
                  />
                </div>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>Tên</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={detail.full_name}
                  />
                </div>
              </div>

              <div className="id-item-edit">
                <h4>Ảnh</h4>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <img src={detail.avatar_url} style={{ width: "100px" }} />
                </div>
              </div>
              <div className="id-item-edit">
                <h4>Địa chỉ</h4>
                <input
                  type="text"
                  disabled={true}
                  style={{ opacity: "0.6" }}
                  value={`${detail.ward}, ${detail.district}, ${detail.province}`}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>Email</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={detail.email}
                  />
                </div>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>Số điện thoại</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={detail.phone}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>Giới tính</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={detail.gender ? "Nam" : "Nữ"}
                  />
                </div>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>Ngày tạo</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={numToDate(detail.created_date)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>Ngày cập nhập thông tin</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={numToDate(detail.modified_date)}
                  />
                </div>
                <div className="id-item-edit" style={{ width: "47%" }}>
                  <h4>Ngày cập nhập mật khẩu</h4>
                  <input
                    type="text"
                    disabled={true}
                    style={{ opacity: "0.6" }}
                    value={numToDate(detail.modified_date_password)}
                  />
                </div>
              </div>

              <div className="id-item-edit">
                <h4>Active</h4>
                <Switch checked={detail.is_active} disabled={true} />
              </div>
              <div
                className="action-modal"
                style={{ justifyContent: "flex-end" }}
              >
                <button className="close" onClick={closeModal}>
                  Đóng
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Customers;
