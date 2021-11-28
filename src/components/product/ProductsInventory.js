import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Modal } from "antd";

import "react-toastify/dist/ReactToastify.css";
import "../../css/page.css";
// import { url } from "../configs/api";
import { actions as ProductActions } from "../../redux/ProductsReducer";

import Table from "../../components/table/Table";
import Loading from "../loading/Loading";
import { numToDate, numberToVnd } from "../../utils/numberFormatter";

const customerTableHead = [
  "id",
  "Tên",
  "Ảnh",
  "Giá nhập",
  "Giá bán",
  "Ngày tạo",
  "Ngày cập nhập",
];

const ProductsInventory = ({ visibleInventory }) => {
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.ProductReducer);
  const { listInventory, isFetchingInventory, meta } = productReducer;
  const [pageCur, setPageCur] = useState(1);

  const renderHead = (item, index) => {
    return <th key={index}>{item}</th>;
  };

  const onChangePage = (page, pageSize) => {
    setPageCur(page);
    dispatch(
      ProductActions.getReportProducts({
        // ...meta,
        page: page,
        page_size: pageSize,
      })
    );
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
      </tr>
    );
  };

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {!isFetchingInventory ? (
                <div style={{ marginBottom: "10px" }}>
                  <Table
                    limit="10"
                    headData={customerTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={listInventory}
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
                page={pageCur}
                pageSize={meta.elementOfPage}
                size="default"
                showSizeChanger={false}
                onChange={onChangePage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsInventory;
