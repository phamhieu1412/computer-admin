import React, { useState } from "react";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { Input, Button, Select, DatePicker, Switch } from "antd";

import "antd/dist/antd.css";
import "../../css/page.css";
import {
  numToDate,
  numberToVnd,
  notificationToast,
} from "../../utils/numberFormatter";

const DetailOrder = ({ onCancelModalCreate, updateInfo, detail }) => {
  const [id, setId] = useState(detail.id ? detail.id : 1);
  const [data, setData] = useState({
    created_date: detail.created_date ? detail.created_date : 0,
    modified_date: detail.modified_date ? detail.modified_date : "",
    delivered_date: detail.delivered_date ? detail.delivered_date : 0,
    delivery_method: detail.delivery_method ? detail.delivery_method : 0,
    expected_delivery: detail.expected_delivery ? detail.expected_delivery : 0,
    final_total_price: detail.final_total_price ? detail.final_total_price : 0,
    id: detail.id ? detail.id : 0,
    is_active: detail.is_active ? detail.is_active : true,
    note: detail.note ? detail.note : "",
    order_code: detail.order_code ? detail.order_code : "",
    order_delivery_address: detail.order_delivery_address
      ? detail.order_delivery_address
      : {},
    order_vat_invoice: detail.order_vat_invoice ? detail.order_vat_invoice : {},
    order_products: detail.order_products ? detail.order_products : [],
    is_active: detail.is_active ? detail.is_active : 0,
    status: detail.status ? detail.status : 1,
    vat_invoice: detail.vat_invoice ? detail.vat_invoice : false,
  });
  const [dataSend, setDataSend] = useState({});

  const onOk = () => {
    updateInfo(data.id, dataSend);
  };

  const onChangeDate = (value) => {
    if (id === 4) {
      setDataSend({ status: dataSend.status });
    } else if (id === 5) {
      const dateMoment = moment(value).unix();
      setDataSend({ status: dataSend.status, expected_delivery: dateMoment });
    } else if (id === 6) {
      const dateMoment = moment(value).unix();
      setDataSend({ status: dataSend.status, delivered_date: dateMoment });
    }
  };

  const onChangeStatus = (id) => {
    if (data.status >= id) {
      notificationToast("Không được chọn trạng thái này");
      return;
    }
    setId(id);
    setDataSend({ status: id });
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

  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  return (
    <div className="form-create-product">
      <div className="number-block-form">
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Id</span>
          <Input value={detail.id} disabled />
        </div>
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Mã đơn</span>
          <Input value={detail.order_code} disabled />
        </div>
      </div>

      <div className="number-block-form">
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Trạng thái đơn</span>
          <Input value={renderStatusOrder(detail.status)} disabled />
        </div>
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Phương thức vận chuyển</span>
          <Input
            value={
              detail.delivery_method === 1 ? "Giao tận nơi" : "Lấy tại cửa hàng"
            }
            disabled
          />
        </div>
      </div>

      <div className="block-form">
        <span style={{ width: "50px" }}>Tổng giá</span>
        <Input
          value={numberToVnd(detail.final_total_price)}
          disabled
          style={{ flexGrow: 1 }}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>Ghi chú</span>
        <Input.TextArea style={{ flexGrow: 1 }} disabled value={data.note} />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>Thông tin và địa chỉ người mua</span>
        <Input
          value={`${detail.order_delivery_address.district}, ${detail.order_delivery_address.address} - ${detail.order_delivery_address.full_name} - ${detail.order_delivery_address.phone}`}
          disabled
          style={{ flexGrow: 1 }}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>Danh sách sản phẩm</span>
      </div>

      <div className="number-block-form">
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Ngày tạo đơn</span>
          <Input
            style={{ flexGrow: 1 }}
            disabled
            value={numToDate(data.note)}
          />
        </div>
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Ngày cập nhập đơn</span>
          <Input
            style={{ flexGrow: 1 }}
            disabled
            value={numToDate(data.modified_date)}
          />
        </div>
      </div>

      <div className="block-form">
        <span style={{ width: "50px" }}>Thông tin công ty</span>
        <Input
          style={{ flexGrow: 1 }}
          disabled
          value={`${detail.order_vat_invoice.company_name} - ${detail.order_vat_invoice.company_address} - ${detail.order_vat_invoice.tax_identification_number}`}
        />
      </div>

      <div className="number-block-form">
        <div className="block-form">
          <span style={{ width: "50px" }}>Active</span>
          <Switch checked={detail.is_active} disabled={true} />
        </div>
        <div className="block-form">
          <span style={{ width: "50px" }}>Có in hoá đơn</span>
          <Switch checked={detail.vat_invoice} disabled={true} />
        </div>
      </div>

      {data.status !== 7 && (
        <div className="number-block-form">
          <div className="block-form" style={{ width: "48%" }}>
            <span style={{ width: "50px" }}>Chuyển trạng thái đơn hàng</span>
            <Select
              style={{ width: "100%" }}
              onChange={onChangeStatus}
              defaultValue={"Chọn trạng thái"}
            >
              <Select.Option value={4}>Chờ lấy hàng</Select.Option>
              <Select.Option value={5}>Đang giao</Select.Option>
              <Select.Option value={6}>Đã giao</Select.Option>
            </Select>
          </div>
          {(id === 5 || id === 6) && (
            <div
              className="block-form"
              style={{ width: "48%", display: "flex", flexDirection: "column" }}
            >
              <span>Chọn ngày</span>
              <DatePicker
                onChange={onChangeDate}
                disabledDate={disabledDate}
                showTime
                className="date-choose"
              />
            </div>
          )}
        </div>
      )}

      <div className="block-action-form">
        <Button onClick={onOk}>Đồng ý</Button>
        <Button onClick={onCancelModalCreate}>Huỷ bỏ</Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DetailOrder;
