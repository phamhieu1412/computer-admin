import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";

import "react-toastify/dist/ReactToastify.css";
import "../css/page.css";
import { actions as CustomerActions } from "../redux/CustomersReducer";

import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
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
  const { list, isFetching } = customerReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [infoEdit, setInfoEdit] = useState({});

  useEffect(() => {
    dispatch(CustomerActions.getCustomers());
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
    openModal();
  };
  const editItem = (item) => {
    setInfoEdit(item);
    openModal();
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
    setSelectedFile(undefined);
    setVisibleModal(false);
  };

  const addNewInfo = () => {
    // dispatch(
    //   CustomerActions.createBanner(
    //     {
    //       name: infoEdit.name ? infoEdit.name : "",
    //       image_url: "",
    //       description: infoEdit.description ? infoEdit.description : "",
    //       is_active: infoEdit.is_active,
    //       url: "#",
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
  const updateInfo = () => {
    // dispatch(
    //   CustomerActions.updateBanner(
    //     infoEdit.id,
    //     {
    //       description: infoEdit.description,
    //       is_active: infoEdit.is_active,
    //       name: infoEdit.name,
    //       image_url: infoEdit.image_url,
    //       url: "#",
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
        <td>{item.full_name}</td>
        <td>{item.phone}</td>
        <td>{numToDate(item.created_date)}</td>
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
            <h4>Ảnh</h4>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {selectedFile ? (
                <img src={preview} style={{ width: "100px" }} />
              ) : (
                infoEdit.image_url && (
                  <img src={infoEdit.image_url} style={{ width: "100px" }} />
                )
              )}
              <input type="file" accept="image/*" onChange={onChangeImage} />
            </div>
          </div>
          <div className="id-item-edit">
            <h4>Mô tả</h4>
            <input
              placeholder="Nhập mô tả"
              type="text"
              onChange={onChangeDescription}
              value={infoEdit.description && infoEdit.description}
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

export default Customers;
