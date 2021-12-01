import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { Button, Select } from "antd";

import "antd/dist/antd.css";
import "../../css/page.css";
import { actions as ProductActions } from "../../redux/ProductsReducer";

const FilterContent = ({ onCancelModalCreate }) => {
  const dispatch = useDispatch();
  const [dataSend, setDataSend] = useState({});
  const manufacturerReducer = useSelector((state) => state.ManufacturerReducer);
  const categoryReducer = useSelector((state) => state.CategoryReducer);

  const onOk = () => {
    dispatch(
      ProductActions.getProducts({ ...dataSend, page: 1, page_size: 10 })
    );
    onCancelModalCreate();
  };

  const onChangeCategory = (id) => {
    setDataSend({ ...dataSend, category_id: id });
  };
  const onChangeManufacturer = (id) => {
    setDataSend({ ...dataSend, manufacturer_id: id });
  };

  const onChangeSort = (value) => {
    setDataSend({ ...dataSend, sort: value });
  };
  const onChangeOrder = (value) => {
    setDataSend({ ...dataSend, order_by: value });
  };

  return (
    <div className="form-create-product">
      <div className="number-block-form">
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Chọn danh mục</span>
          <Select style={{ width: "100%" }} onChange={onChangeCategory}>
            {categoryReducer?.list?.length > 0 &&
              categoryReducer.list.map((man) => (
                <Select.Option key={man.id} value={man.id}>
                  {man.name}
                </Select.Option>
              ))}
          </Select>
        </div>
        <div className="block-form" style={{ width: "48%" }}>
          <span style={{ width: "50px" }}>Chọn hãng sản xuất</span>
          <Select style={{ width: "100%" }} onChange={onChangeManufacturer}>
            {manufacturerReducer?.list?.length > 0 &&
              manufacturerReducer.list.map((man) => (
                <Select.Option key={man.id} value={man.id}>
                  {man.name}
                </Select.Option>
              ))}
          </Select>
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
