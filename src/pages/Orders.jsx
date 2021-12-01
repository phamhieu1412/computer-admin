import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Pagination, Modal, Button, Input, Popover } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "../css/page.css";
import { actions as OrderActions } from "../redux/OrdersReducer";

import Table from "../components/table/Table";
import Loading from "../components/loading/Loading";
import FilterContent from "../components/order/FilterContent";
import DetailOrder from "../components/order/DetailOrder";
import {
  numToDate,
  notificationToast,
  successNotificationToast,
} from "../utils/numberFormatter";

const customerTableHead = [
  "id",
  "Người mua",
  "Địa chỉ nhận",
  "Trạng thái",
  "Ngày tạo",
  "Ngày cập nhập",
  "Active",
  "Cập nhập",
];

const Products = () => {
  const dispatch = useDispatch();
  const orderReducer = useSelector((state) => state.OrderReducer);
  const { list, isFetching, meta, detail, isFetchingDetail, filter } =
    orderReducer;
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [pageCur, setPageCur] = useState(1);
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(
      OrderActions.getOrders({
        page: 1,
        page_size: 10,
      })
    );
  }, []);

  const editItem = (id) => {
    dispatch(OrderActions.getDetailOrder(id));
    setTimeout(() => {
      setVisibleModal(true);
    }, 300);
  };
  const deleteItem = (id) => {
    dispatch(
      OrderActions.cancelOrder(
        id,
        {
          status: 7,
          cancel_reason: reason,
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

  const closeModal = () => {
    setVisibleModal(false);
    setVisibleFilter(false);
  };
  const onChangePage = (page, pageSize) => {
    setPageCur(page);
    dispatch(
      OrderActions.getOrders({
        ...filter,
        page: page,
        page_size: pageSize,
      })
    );
  };

  const updateInfo = (id, payload) => {
    if (!payload.status) {
      return;
    }
    if (
      (payload.status === 5 && !payload.expected_delivery) ||
      (payload.status === 6 && !payload.delivered_date)
    ) {
      notificationToast("Hãy chọn ngày");
      return;
    }
    dispatch(
      OrderActions.updateStatus(id, payload, {
        onSuccess: (text) => {
          setVisibleModal(false);
          successNotificationToast(text);
        },
        onFailure: (textError) => {
          notificationToast(textError);
        },
      })
    );
  };

  const renderStatusOrder = (status) => {
    let str = "";
    if (status === 1 || status === 2) {
      str = "Chờ thanh toán";
    } else if (status === 3 || status === 4) {
      str = "Chờ lấy hàng";
    } else if (status === 5) {
      str = "Đang giao";
    } else if (status === 6) {
      str = "Đã giao";
    } else if (status === 7) {
      str = "Đã hủy";
    }
    return str;
  };

  const renderChooseMethodDelivery = (id) => {
    return (
      <div className="block-form">
        <span style={{ width: "50px" }}>Lý do huỷ đơn</span>
        <Input
          onChange={(e) => setReason(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <Button onClick={() => deleteItem(id)}>Đồng ý</Button>
      </div>
    );
  };

  const onOpenFilter = () => {
    setVisibleFilter(true);
  };

  const renderHead = (item, index) => {
    return <th key={index}>{item}</th>;
  };
  const renderBody = (item, index) => {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td>
          {item.order_delivery_address.full_name} -{" "}
          {item.order_delivery_address.phone}
        </td>
        <td>
          {item.order_delivery_address.district},{" "}
          {item.order_delivery_address.address}
        </td>
        <td>{renderStatusOrder(item.status)}</td>
        <td>{numToDate(item.created_date)}</td>
        <td>{numToDate(item.modified_date)}</td>
        <td>{item.is_active ? "Hiển thị" : "Ẩn"}</td>
        <td>
          <div style={{ display: "flex", displayDirection: "row" }}>
            <a onClick={() => editItem(item.id)}>
              <div className="notification-item">
                <i className="bx bx-edit-alt"></i>
              </div>
            </a>
            <Popover
              style={{ margin: "0px" }}
              content={() => renderChooseMethodDelivery(item.id)}
              trigger="click"
              placement="left"
            >
              <a>
                <div className="notification-item">
                  <i className="bx bx-trash"></i>
                </div>
              </a>
            </Popover>
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
          <h2 className="page-header">Danh sách đơn hàng</h2>
          <a className="btn-header-title" onClick={onOpenFilter}>
            <i className="bx bx-filter-alt" style={{ color: "white" }}></i>
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
        title="Tìm kiếm theo"
        visible={visibleFilter}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <FilterContent onCancelModalCreate={closeModal} />
      </Modal>

      <Modal
        title="Cập nhập thông tin"
        visible={visibleModal}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        {!isFetchingDetail ? (
          <DetailOrder
            detail={detail}
            onCancelModalCreate={closeModal}
            updateInfo={updateInfo}
          />
        ) : (
          <Loading />
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Products;
