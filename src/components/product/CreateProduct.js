import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from "antd";

import "antd/dist/antd.css";
import "../../css/page.css";
import UploadImage from "./UploadImage";

const CreateProduct = ({ onCancelModalCreate, addNewInfo }) => {
  const manufacturerReducer = useSelector((state) => state.ManufacturerReducer);
  const categoryReducer = useSelector((state) => state.CategoryReducer);
  const [data, setData] = useState({
    name: "",
    code: "",
    price: 0,
    description: "",
    specification: "",
    user_manual: "",
    warranty: "",
    avatar_url: "",
    other_images_url: "",
    inventory_number: 0,
    discount_percent: 0,
    discount_value: 0,
    is_active: 0,
    is_top: 0,
    product_unit: 0,
    category_id: 0,
    manufacturer_id: 0,
  });
  const [dataImg, setDataImg] = useState([]);

  const onChangeName = (e) => {
    setData({ ...data, name: e.target.value });
  };
  const onChangeCode = (e) => {
    setData({ ...data, code: e.target.value });
  };
  const onChangePrice = (e) => {
    setData({ ...data, price: e });
  };
  const onChangeInventory = (e) => {
    setData({ ...data, inventory_number: e });
  };
  const onChangePercent = (e) => {
    setData({ ...data, discount_percent: e });
  };
  const onChangeDescription = (e) => {
    setData({ ...data, description: e.target.value });
  };
  const onChangeUserManual = (e) => {
    setData({ ...data, user_manual: e.target.value });
  };
  const onChangeWarranty = (e) => {
    setData({ ...data, warranty: e.target.value });
  };
  const onChangeSpecification = (e) => {
    setData({ ...data, specification: e.target.value });
  };
  const onChangeCategory = (id) => {
    setData({ ...data, category_id: id });
  };
  const onChangeManufacturer = (id) => {
    setData({ ...data, manufacturer_id: id });
  };
  const onChangeActive = (checked) => {
    setData({ ...data, is_active: checked });
  };
  const onChangeIsTop = (checked) => {
    setData({ ...data, is_top: checked });
  };
  const onChangeProductUnit = (id) => {
    setData({ ...data, product_unit: id });
  };
  const onChangeImg = (arr) => {
    setDataImg(arr);
  };

  const onOk = () => {
    addNewInfo(data, dataImg);
  };

  return (
    <div className="form-create-product">
      <div className="block-form">
        <span style={{ width: "50px" }}>T??n</span>
        <Input
          value={data.name}
          placeholder="Nh???p t??n"
          style={{ flexGrow: 1 }}
          onChange={onChangeName}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>M?? s???n ph???m</span>
        <Input
          value={data.code}
          placeholder="Nh???p m??"
          style={{ flexGrow: 1 }}
          onChange={onChangeCode}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>????n v??? s???n ph???m</span>
        <Select style={{ width: "100%" }} onChange={onChangeProductUnit}>
          <Select.Option value={1}>C??i</Select.Option>
          <Select.Option value={2}>B???</Select.Option>
          <Select.Option value={3}>Chi???c</Select.Option>
        </Select>
      </div>

      <UploadImage onChangeImg={onChangeImg} />

      <div className="number-block-form">
        <div className="block-form">
          <span style={{ width: "50px" }}>Gi?? nh???p</span>
          <InputNumber
            placeholder="Nh???p gi??"
            style={{ flexGrow: 1 }}
            formatter={(value) =>
              `${value} ???`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            min={0}
            step="500"
            onChange={onChangePrice}
            value={data.price}
          />
        </div>
        <div className="block-form">
          <span style={{ width: "50px" }}>S??? l?????ng t???n</span>
          <InputNumber
            style={{ flexGrow: 1 }}
            min={0}
            onChange={onChangeInventory}
            value={data.inventory_number}
          />
        </div>
        <div className="block-form">
          <span style={{ width: "50px" }}>Ph???n tr??m gi???m gi??</span>
          <InputNumber
            style={{ flexGrow: 1 }}
            defaultValue={10}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
            onChange={onChangePercent}
            value={data.discount_percent}
          />
        </div>
      </div>

      <div className="block-form">
        <span style={{ width: "50px" }}>M?? t??? s???n ph???m</span>
        <Input.TextArea
          placeholder="Nh???p m?? t???"
          style={{ flexGrow: 1 }}
          onChange={onChangeDescription}
          value={data.description}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>M?? t??? h?????ng d???n s??? d???ng</span>
        <Input
          style={{ flexGrow: 1 }}
          onChange={onChangeUserManual}
          value={data.user_manual}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>M?? t??? b???o h??nh</span>
        <Input
          style={{ flexGrow: 1 }}
          onChange={onChangeWarranty}
          value={data.warranty}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>M?? t??? th??ng s???</span>
        <Input
          style={{ flexGrow: 1 }}
          onChange={onChangeSpecification}
          value={data.specification}
        />
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>Ch???n danh m???c</span>
        <Select style={{ width: "100%" }} onChange={onChangeCategory}>
          {categoryReducer?.list?.length > 0 &&
            categoryReducer.list.map((man) => (
              <Select.Option key={man.id} value={man.id}>
                {man.name}
              </Select.Option>
            ))}
        </Select>
      </div>
      <div className="block-form">
        <span style={{ width: "50px" }}>Ch???n h??ng s???n xu???t</span>
        <Select style={{ width: "100%" }} onChange={onChangeManufacturer}>
          {manufacturerReducer?.list?.length > 0 &&
            manufacturerReducer.list.map((man) => (
              <Select.Option key={man.id} value={man.id}>
                {man.name}
              </Select.Option>
            ))}
        </Select>
      </div>

      <div className="switch-block-form">
        <div className="block-form">
          <span style={{ width: "50px" }}>Tr???ng th??i k??ch ho???t</span>
          <Switch onChange={onChangeActive} checked={data.is_active} />
        </div>
        <div className="block-form">
          <span style={{ width: "50px" }}>L??n s???n ph???m b??n ch???y nh???t</span>
          <Switch onChange={onChangeIsTop} checked={data.is_top} />
        </div>
      </div>

      <div className="block-action-form">
        <Button onClick={onOk}>?????ng ??</Button>
        <Button onClick={onCancelModalCreate}>Hu??? b???</Button>
      </div>
    </div>
  );
};

export default CreateProduct;
