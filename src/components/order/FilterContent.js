import React, { useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { Input, Button, Select, DatePicker } from "antd";

import "antd/dist/antd.css";
import "../../css/page.css";
import { actions as OrderActions } from "../../redux/OrdersReducer";

const FilterContent = ({ onCancelModalCreate }) => {
  const dispatch = useDispatch();
  const [dataSend, setDataSend] = useState({});

  const onOk = () => {
    dispatch(OrderActions.getOrders({ ...dataSend, page: 1, page_size: 10 }));
    onCancelModalCreate();
  };

  const onChangeDateFrom = (value) => {
    const dateMoment = moment(value).unix();
    setDataSend({ ...dataSend, from_date: dateMoment });
  };
  const onChangeDateTo = (value) => {
    const dateMoment = moment(value).unix();
    setDataSend({ ...dataSend, to_date: dateMoment });
  };

  const onChangeOrderCode = (e) => {
    setDataSend({ ...dataSend, order_code: e.target.value });
  };
  const onChangeStatus = (value) => {
    setDataSend({ ...dataSend, status: value });
  };
  const onChangeSort = (value) => {
    setDataSend({ ...dataSend, sort: value });
  };
  const onChangeOrder = (value) => {
    setDataSend({ ...dataSend, order_by: value });
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  return (
    <div className="form-create-product">
      <div className="number-block-form">
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Nhập mã đơn hàng cần tìm</span>
          <Input onChange={onChangeOrderCode} />
        </div>
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Chọn trạng thái đơn cần tìm</span>
          <Select
            style={{ width: "100%" }}
            onChange={onChangeStatus}
            defaultValue={"Chọn trạng thái"}
          >
            <Select.Option value={1}>Chờ thanh toán</Select.Option>
            <Select.Option value={2}>Khách đã chuyển tiền</Select.Option>
            <Select.Option value={3}>Đã nhận tiền</Select.Option>
            <Select.Option value={4}>Đóng gói</Select.Option>
            <Select.Option value={5}>Đang giao</Select.Option>
            <Select.Option value={6}>Đã giao thành công</Select.Option>
            <Select.Option value={7}>Huỷ</Select.Option>
          </Select>
        </div>
      </div>

      <div className="block-form">
        <span>Chọn khoảng thời gian</span>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DatePicker
            onChange={onChangeDateFrom}
            disabledDate={disabledDate}
            className="date-choose"
            style={{ width: "48%" }}
          />
          <DatePicker
            onChange={onChangeDateTo}
            disabledDate={disabledDate}
            className="date-choose"
            style={{ width: "48%" }}
          />
        </div>
      </div>

      <div className="number-block-form">
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Sắp xếp theo</span>
          <Select
            style={{ width: "100%" }}
            onChange={onChangeSort}
            defaultValue={"Chọn trường sắp xếp"}
          >
            <Select.Option value="full_name">Tên</Select.Option>
            <Select.Option value="final_total_price">Giá</Select.Option>
            <Select.Option value="created_date">Ngày tạo</Select.Option>
            <Select.Option value="expected_delivery">
              Ngày muốn giao
            </Select.Option>
            <Select.Option value="delivered_date">Ngày giao</Select.Option>
            <Select.Option value="status">Trạng thái</Select.Option>
          </Select>
        </div>
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Sắp xếp Tăng/Giảm</span>
          <Select
            style={{ width: "100%" }}
            onChange={onChangeOrder}
            defaultValue={"Chọn tăng/giảm"}
          >
            <Select.Option value="asc">Tăng</Select.Option>
            <Select.Option value="desc">Giảm</Select.Option>
          </Select>
        </div>
      </div>

      <div className="block-action-form">
        <Button onClick={onOk}>Đồng ý</Button>
        <Button onClick={onCancelModalCreate}>Huỷ bỏ</Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FilterContent;
