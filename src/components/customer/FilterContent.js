import React, { useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { Input, Button, Select, DatePicker } from "antd";

import "antd/dist/antd.css";
import "../../css/page.css";
import { actions as CustomerActions } from "../../redux/CustomersReducer";

const FilterContent = ({ onCancelModalCreate }) => {
  const dispatch = useDispatch();
  const [dataSend, setDataSend] = useState({});

  const onOk = () => {
    dispatch(CustomerActions.getCustomers({ ...dataSend }));
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
    setDataSend({ ...dataSend, full_name: e.target.value });
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
          <span style={{ width: "50px" }}>Nhập tên khách hàng cần tìm</span>
          <Input onChange={onChangeOrderCode} />
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
            <Select.Option value="created_date">Ngày tạo</Select.Option>
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
