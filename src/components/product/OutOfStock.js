import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
// import Modal from "react-modal";
import { Pagination, Modal } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "../../css/page.css";
// import { url } from "../configs/api";
import { actions as ProductActions } from "../../redux/ProductsReducer";
import { actions as CategoryActions } from "../../redux/CategoriesReducer";
import { actions as ManufacturerActions } from "../../redux/ManufacturersReducer";
import { actions as AppActions } from "../../redux/AppRedux";

import Table from "../../components/table/Table";
import Loading from "../loading/Loading";
import {
  numToDate,
  customStyles,
  notificationToast,
  successNotificationToast,
  numberToVnd,
} from "../../utils/numberFormatter";

const customerTableHead = [
  "id",
  "Tên",
  "Ảnh",
  "Giá nhập",
  "Giá bán",
  "Ngày tạo",
  "Ngày cập nhập",
  "active",
  "Cập nhập",
];

const OutOfStock = () => {
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.ProductReducer);
  const { listOutOfStock, isFetching, meta } = productReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalCreate, setVisibleModalCreate] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [pageCur, setPageCur] = useState(1);
  const [infoEdit, setInfoEdit] = useState({});

  const renderHead = (item, index) => {
    return <th key={index}>{item}</th>;
  };

  const createItem = (item) => {
    setInfoEdit({});
    setVisibleModalCreate(true);
  };
  const editItem = (item) => {
    setInfoEdit(item);
    setTimeout(() => {
      setVisibleModal(true);
    }, 300);
  };
  const deleteItem = (id) => {
    // dispatch(
    //   BannerActions.deleteBanner(id, {
    //     onSuccess: (text) => {
    //       successNotificationToast(text);
    //     },
    //     onFailure: (textError) => {
    //       notificationToast(textError);
    //     },
    //   })
    // );
  };

  const onChangePage = (page, pageSize) => {
    setPageCur(page);
    dispatch(
      ProductActions.getProducts({
        // ...meta,
        page: page,
        page_size: pageSize,
      })
    );
  };

  const renderBody = (item, index) => {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>
          <img
            style={{ height: "50px" }}
            src={item.avatar_url}
            placeholder={item.name}
          />
        </td>
        <td>{numberToVnd(item.price)}</td>
        <td>{numberToVnd(item.final_price)}</td>
        <td>{numToDate(item.created_date)}</td>
        <td>{numToDate(item.modified_date)}</td>
        <td>{item.is_active ? "Hiển thị" : "Ẩn"}</td>
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
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {!isFetching ? (
                <div style={{ marginBottom: "10px" }}>
                  <Table
                    limit="10"
                    headData={customerTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={listOutOfStock}
                    renderBody={(item, index) => renderBody(item, index)}
                    scroll={{ x: 600 }}
                  />
                </div>
              ) : (
                <Loading />
              )}
              {/* <Pagination
                // defaultCurrent={meta.page}
                total={meta.total}
                page={meta.page}
                pageSize={meta.elementOfPage}
                size="default"
                showSizeChanger={false}
                onChange={onChangePage}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutOfStock;
