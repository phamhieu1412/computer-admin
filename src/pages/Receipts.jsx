import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { Select, InputNumber } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "../css/page.css";
import "antd/dist/antd.css";
import { actions as ReceiptActions } from "../redux/ReceiptsReducer";
import { actions as SupplierActions } from "../redux/SupplierReducer";
import { actions as ProductActions } from "../redux/ProductsReducer";

import EditProductReceipt from "../components/EditProductReceipt";
import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
import {
  numToDate,
  customStyles,
  notificationToast,
  numberToVnd,
} from "../utils/numberFormatter";

const { Option } = Select;
const customerTableHead = ["id", "Ngày tạo", "Danh sách sản phẩm"];
const productTableHead = ["id", "Tên", "Giá", "Số lượng"];

const Receipts = () => {
  const dispatch = useDispatch();
  const receiptReducer = useSelector((state) => state.ReceiptReducer);
  const supplierReducer = useSelector((state) => state.SupplierReducer);
  const productReducer = useSelector((state) => state.ProductReducer);
  const { list, isFetching } = receiptReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalAdd, setVisibleModalAdd] = useState(false);
  const [infoEdit, setInfoEdit] = useState([]);
  const [data, setData] = useState({});
  const [dataChooseProducts, setDataChooseProducts] = useState([]);
  const [dataTempChooseProducts, setDataTempChooseProducts] = useState([]);

  useEffect(() => {
    dispatch(ReceiptActions.getReceipts());
    dispatch(SupplierActions.getSuppliers());
    dispatch(
      ProductActions.getProducts({
        page: 1,
        page_size: 10,
        category_id: 1,
      })
    );
  }, []);

  const renderHead = (item, index) => {
    return <th key={index}>{item}</th>;
  };

  const createItem = () => {
    setInfoEdit([]);
    setVisibleModalAdd(true);
  };
  const editItem = (item) => {
    setInfoEdit(item.receipt_products);
    openModal();
  };

  const openModal = () => {
    setVisibleModal(true);
  };
  const closeModal = () => {
    setVisibleModal(false);
    setVisibleModalAdd(false);
  };

  const handleChangeSupplier = (id) => {
    setData({
      ...data,
      supplier_id: id,
    });
  };
  const handleChangeProduct = (id) => {
    setDataChooseProducts([...dataChooseProducts, id]);
    setDataChooseProducts([...dataChooseProducts, id]);
  };

  const addNewInfo = () => {
    // if (infoEdit.name === "" || !selectedFile) {
    //   notificationToast("Hãy nhập đủ thông tin!");
    //   return;
    // }
    // dispatch(
    //   ReceiptActions.createManufacturer(
    //     {
    //       name: infoEdit.name,
    //       image_url: "",
    //       description: infoEdit.description ? infoEdit.description : "",
    //     },
    //     selectedFile,
    //     {
    //       onSuccess: (text) => {
    //         closeModal();
    //         successNotificationToast(text);
    //       },
    //       onFailure: (textError) => {
    //         notificationToast(textError);
    //       },
    //     }
    //   )
    // );
  };

  const renderBody = (item, index) => {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td>{numToDate(item.created_date)}</td>
        <td>
          <a onClick={() => editItem(item)}>
            <div className="notification-item">
              <i className="bx bx-list-ul"></i>
            </div>
          </a>
        </td>
      </tr>
    );
  };
  const renderBodyProduct = (item, index) => {
    return (
      <tr key={`product-${index}`}>
        <td>{item.product.id}</td>
        <td style={{ width: "600px" }}>{item.product.name}</td>
        <td>{numberToVnd(item.price)}</td>
        <td>{item.quantity}</td>
      </tr>
    );
  };

  return (
    <div>
      <div className="header-title">
        <h2 className="page-header">Phiếu nhập hàng</h2>
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
        ariaHideApp={false}
      >
        <div className="modal-banner">
          <h2 className="header-item-edit">Chi tiết phiếu</h2>
          {infoEdit.id && (
            <div className="id-item-edit">
              <h4>id</h4>
              <p style={{ opacity: 0.5 }}>{infoEdit.id}</p>
            </div>
          )}
          {infoEdit?.length > 0 && (
            <Table
              limit="10"
              headData={productTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              bodyData={infoEdit}
              renderBody={(item, index) => renderBodyProduct(item, index)}
            />
          )}
          <div className="action-modal">
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

      <Modal
        isOpen={visibleModalAdd}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="modal-banner">
          <h2 className="header-item-edit">Thêm hàng</h2>
          {supplierReducer?.list?.length > 0 &&
            productReducer?.list?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Select
                  defaultValue="Chọn nhà sản xuất"
                  style={{ margin: "10px 0" }}
                  onChange={handleChangeSupplier}
                >
                  {supplierReducer.list.map((supplier) => (
                    <Option value={supplier.id} key={supplier.id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  defaultValue="Chọn sản phẩm"
                  style={{ margin: "10px 0" }}
                  onChange={handleChangeProduct}
                >
                  {productReducer.list.map((product) => (
                    <Option value={product.id} key={product.id}>
                      {product.name}
                    </Option>
                  ))}
                </Select>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px 0",
                  }}
                >
                  <InputNumber
                    defaultValue={1000}
                    formatter={(value) =>
                      `${value} ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "49%" }}
                    // onChange={onChange}
                  />
                  <InputNumber
                    placeholder="Nhập số lượng"
                    style={{ width: "49%" }}
                  />
                </div>

                <EditProductReceipt />
              </div>
            )}
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Receipts;
