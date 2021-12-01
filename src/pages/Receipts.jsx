import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { Select, InputNumber, DatePicker, Input, Button } from "antd";
import moment from "moment";

import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";
import "../css/page.css";
import { actions as ReceiptActions } from "../redux/ReceiptsReducer";
import { actions as SupplierActions } from "../redux/SupplierReducer";
import { actions as ProductActions } from "../redux/ProductsReducer";

import EditProductReceipt from "../components/EditProductReceipt";
import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
import SearchInput from "../components/receipts/SearchInput";
import {
  numToDate,
  customStyles,
  notificationToast,
  numberToVnd,
  successNotificationToast,
} from "../utils/numberFormatter";

const { Option } = Select;
const customerTableHead = ["id", "Ngày tạo", "Danh sách sản phẩm"];
const productTableHead = ["id", "Tên", "Giá", "Số lượng"];

const Receipts = () => {
  const dispatch = useDispatch();
  const receiptReducer = useSelector((state) => state.ReceiptReducer);
  const supplierReducer = useSelector((state) => state.SupplierReducer);
  const productReducer = useSelector((state) => state.ProductReducer);
  const { list, isFetching, detail, isFetchingDetail } = receiptReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalAdd, setVisibleModalAdd] = useState(false);
  const [infoEdit, setInfoEdit] = useState([]);
  const [data, setData] = useState({});
  const [dataChooseProducts, setDataChooseProducts] = useState([]);
  const [dataTempChooseProducts, setDataTempChooseProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});

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
    dispatch(ReceiptActions.getDetailReceipt(item.id));
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
  const onChangeQuantity = (value) => {
    setTempProduct({ ...tempProduct, quantity: value });
  };
  const onChangePrice = (value) => {
    setTempProduct({ ...tempProduct, price: value });
  };

  const createReceipt = () => {
    if (
      dataTempChooseProducts.length === 0 ||
      !data.created_date ||
      !data.supplier_id
    ) {
      notificationToast("Hãy nhập đủ thông tin");
      return;
    }
    let arr = [];
    for (let i = 0; i < dataTempChooseProducts.length; i++) {
      const element = dataTempChooseProducts[i];
      arr.push({
        product_id: element.key,
        price: element.price,
        quantity: element.quantity,
      });
    }
    dispatch(
      ReceiptActions.createReceipt(
        {
          ...data,
          receipt_products: arr,
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

  const addToTable = () => {
    if (!tempProduct.quantity || !tempProduct.price || !tempProduct.key) {
      notificationToast("Hãy nhập đủ thông tin");
      return;
    }
    setDataTempChooseProducts([
      ...dataTempChooseProducts,
      {
        key: tempProduct.key,
        label: tempProduct.label,
        quantity: tempProduct.quantity,
        price: tempProduct.price,
      },
    ]);
    setTempProduct({});
  };
  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };
  const onChangeDate = (value) => {
    setData({
      ...data,
      created_date: moment(value).unix(),
    });
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
        {!isFetchingDetail ? (
          <div className="modal-banner">
            <h2 className="header-item-edit">Chi tiết phiếu</h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "48%" }}>
                <span>Tên nhà cung cấp</span>
                <Input value={detail?.supplier?.id} disabled />
              </div>
              <div style={{ width: "48%" }}>
                <span>Địa chỉ</span>
                <Input value={detail?.supplier?.address} disabled />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "48%" }}>
                <span style={{ width: "100%" }}>Số điện thoại</span>
                <Input value={detail?.supplier?.phone} disabled />
              </div>
              <div style={{ width: "48%" }}>
                <span style={{ width: "100%" }}>Email</span>
                <Input value={detail?.supplier?.email} disabled />
              </div>
            </div>

            {detail?.receipt_products?.length > 0 && (
              <Table
                limit="10"
                headData={productTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={detail.receipt_products}
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
        ) : (
          <div className="modal-banner">
            <Loading />
          </div>
        )}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "10px 0",
                  }}
                >
                  <Select
                    defaultValue="Chọn nhà cung cấp"
                    style={{ width: "48%" }}
                    onChange={handleChangeSupplier}
                    onSearch
                  >
                    {supplierReducer.list.map((supplier) => (
                      <Option value={supplier.id} key={supplier.id}>
                        {supplier.name}
                      </Option>
                    ))}
                  </Select>

                  <DatePicker
                    onChange={onChangeDate}
                    disabledDate={disabledDate}
                    showTime
                    className="date-choose"
                    style={{ width: "48%" }}
                  />
                </div>
                <SearchInput
                  dataTempChooseProducts={dataTempChooseProducts}
                  setTempProduct={setTempProduct}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px 0",
                  }}
                >
                  <InputNumber
                    defaultValue={100000}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    style={{ width: "48%" }}
                    onChange={onChangePrice}
                  />
                  <InputNumber
                    placeholder="Nhập số lượng"
                    style={{ width: "48%" }}
                    onChange={onChangeQuantity}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px 0",
                  }}
                >
                  <Input
                    disabled={true}
                    value={tempProduct.label && tempProduct.label}
                    style={{ width: "80%" }}
                  />

                  <Button onClick={addToTable} style={{ width: "15%" }}>
                    Thêm
                  </Button>
                </div>

                <EditProductReceipt
                  dataTempChooseProducts={dataTempChooseProducts}
                  setDataTempChooseProducts={setDataTempChooseProducts}
                />
              </div>
            )}
          <Button
            onClick={createReceipt}
            style={{ width: "20%", marginTop: "20px", float: "right" }}
            type="primary"
          >
            Tạo phiếu nhập
          </Button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Receipts;
