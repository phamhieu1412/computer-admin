import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
// import Modal from "react-modal";
import { Pagination, Modal } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "../css/page.css";
import { url } from "../configs/api";
import { actions as ProductActions } from "../redux/ProductsReducer";
import { actions as CategoryActions } from "../redux/CategoriesReducer";
import { actions as ManufacturerActions } from "../redux/ManufacturersReducer";
import { actions as AppActions } from "../redux/AppRedux";

import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
import CreateProduct from "../components/product/CreateProduct";
import EditProduct from "../components/product/EditProduct";
import OutOfStock from "../components/product/OutOfStock";
import ProductsInventory from "../components/product/ProductsInventory";
import {
  numToDate,
  customStyles,
  notificationToast,
  successNotificationToast,
  numberToVnd,
} from "../utils/numberFormatter";

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

const Products = () => {
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.ProductReducer);
  const { list, isFetching, meta } = productReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalCreate, setVisibleModalCreate] = useState(false);
  const [visibleOutOfStock, setVisibleOutOfStock] = useState(false);
  const [visibleInventory, setVisibleInventory] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [pageCur, setPageCur] = useState(1);
  const [infoEdit, setInfoEdit] = useState({});

  useEffect(() => {
    dispatch(
      ProductActions.getProducts({
        page: 1,
        page_size: 10,
      })
    );
    dispatch(
      ProductActions.getProductsOutOfStock({
        page: 1,
        page_size: 10,
      })
    );
    dispatch(
      ProductActions.getReportProducts({
        page: 1,
        page_size: 10,
      })
    );
    dispatch(CategoryActions.getCategories());
    dispatch(ManufacturerActions.getManufacturers());
  }, []);
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const renderHead = (item, index) => {
    return <th key={index}>{item}</th>;
  };

  const createItem = (item) => {
    setInfoEdit({});
    setVisibleModalCreate(true);
  };
  const editItem = (item) => {
    setInfoEdit(item);
    dispatch(ProductActions.getDetailProduct(item.id));
    setTimeout(() => {
      setVisibleModal(true);
    }, 300);
  };
  const deleteItem = (id) => {
    dispatch(
      ProductActions.deleteProduct(id, {
        onSuccess: (text) => {
          successNotificationToast(text);
        },
        onFailure: (textError) => {
          notificationToast(textError);
        },
      })
    );
  };

  const closeModal = () => {
    dispatch(
      ProductActions.getProductsOutOfStock({
        page: 1,
        page_size: 10,
      })
    );
    dispatch(
      ProductActions.getReportProducts({
        page: 1,
        page_size: 10,
      })
    );
    setSelectedFile(undefined);
    setVisibleModal(false);
    setVisibleModalCreate(false);
    setVisibleOutOfStock(false);
    setVisibleInventory(false);
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

  const addNewInfo = async (data, dataImg) => {
    if (
      dataImg.length !== 2 ||
      data.code === "" ||
      data.description === "" ||
      data.name === "" ||
      data.specification === "" ||
      data.user_manual === "" ||
      data.warranty === ""
    ) {
      notificationToast("Hãy nhập đủ thông tin");
      return;
    }
    let arrayImg = [];
    for (let i = 0; i < dataImg.length; i++) {
      const res = await dispatch(
        AppActions.uploadImage(dataImg[i].originFileObj)
      );
      if (res?.data?.resource_id) {
        arrayImg.push(res.data.resource_id);
      } else {
        arrayImg.push("");
      }
    }
    dispatch(
      ProductActions.createProduct(
        {
          ...data,
          avatar_url: arrayImg[0] ? `${url}/file/${arrayImg[0]}` : "",
          other_images_url: arrayImg[1] ? `${url}/file/${arrayImg[1]}` : "",
        },
        {
          onSuccess: (text) => {
            setVisibleModalCreate(false);
            successNotificationToast(text);
          },
          onFailure: (textError) => {
            notificationToast(textError);
          },
        }
      )
    );
  };
  const updateInfo = async (data, dataImg) => {
    if (
      data.code === "" ||
      data.description === "" ||
      data.name === "" ||
      data.specification === "" ||
      data.user_manual === "" ||
      data.warranty === ""
    ) {
      notificationToast("Hãy nhập đủ thông tin");
      return;
    }
    if (dataImg.length > 0) {
      let arrayImg = [];
      for (let i = 0; i < dataImg.length; i++) {
        const res = await dispatch(
          AppActions.uploadImage(dataImg[i].originFileObj)
        );
        if (res?.data?.resource_id) {
          arrayImg.push(res.data.resource_id);
        } else {
          arrayImg.push("");
        }
      }

      dispatch(
        ProductActions.updateCategory(
          {
            ...data,
            avatar_url: arrayImg[0] ? `${url}/file/${arrayImg[0]}` : "",
            other_images_url: arrayImg[1] ? `${url}/file/${arrayImg[1]}` : "",
          },
          data.id,
          {
            onSuccess: (text) => {
              setVisibleModalCreate(false);
              successNotificationToast(text);
            },
            onFailure: (textError) => {
              notificationToast(textError);
            },
          }
        )
      );
      return;
    }

    dispatch(
      ProductActions.updateCategory(data, data.id, {
        onSuccess: (text) => {
          setVisibleModalCreate(false);
          successNotificationToast(text);
        },
        onFailure: (textError) => {
          notificationToast(textError);
        },
      })
    );
  };

  const onChangeImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };
  const onChangeName = (e) => {
    setInfoEdit({ ...infoEdit, name: e.target.value });
  };
  const onChangeDescription = (e) => {
    setInfoEdit({ ...infoEdit, description: e.target.value });
  };

  const handleOptionChange = (e) => {
    setInfoEdit({ ...infoEdit, is_active: e.target.value });
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
      <div
        className="header-title"
        style={{ justifyContent: "space-between", marginBottom: "20px" }}
      >
        <div className="header-title">
          <h2 className="page-header">Danh sách sản phẩm</h2>
          <a className="btn-header-title" onClick={createItem}>
            <i className="bx bx-add-to-queue" style={{ color: "white" }}></i>
          </a>
        </div>
        <div className="action-header-title">
          <a
            className="btn-header-title btn-action-header"
            onClick={() => setVisibleOutOfStock(true)}
          >
            Sản phẩm sắp hết hàng
          </a>
          <a
            className="btn-header-title btn-action-header"
            onClick={() => setVisibleInventory(true)}
          >
            Tồn kho
          </a>
          <a
            className="btn-header-title btn-action-header"
            href={`${url}/api/v1/manage/products/report/download`}
          >
            Xuất Excel
          </a>
        </div>
      </div>

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
                    bodyData={list}
                    renderBody={(item, index) => renderBody(item, index)}
                    scroll={{ x: 600 }}
                  />
                </div>
              ) : (
                <Loading />
              )}
              <Pagination
                // defaultCurrent={meta.page}
                total={meta.total}
                page={meta.page}
                pageSize={meta.elementOfPage}
                size="default"
                showSizeChanger={false}
                onChange={onChangePage}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Cập nhập thông tin"
        visible={visibleModal}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <EditProduct
          infoEdit={infoEdit}
          onCancelModalCreate={closeModal}
          updateInfo={updateInfo}
        />
      </Modal>

      <Modal
        title="Thêm mới sản phẩm"
        visible={visibleModalCreate}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <CreateProduct
          onCancelModalCreate={closeModal}
          addNewInfo={addNewInfo}
        />
      </Modal>

      <Modal
        title="Danh sách sản phẩm sắp hết hàng"
        className="modal-products"
        visible={visibleOutOfStock}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <OutOfStock onCancelModalCreate={closeModal} addNewInfo={addNewInfo} />
      </Modal>

      <Modal
        title="Danh sách sản phẩm tồn kho"
        className="modal-products"
        visible={visibleInventory}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <ProductsInventory onCancelModalCreate={closeModal} />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Products;
