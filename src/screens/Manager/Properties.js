import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Checkbox } from "antd";
import { useToasts } from "react-toast-notifications";
import * as actions from "../../actions";

import { custom_styles, API_PROPERTIES as api } from "../../constants";
import HeadText from "./HeadText";
import Loading from "../../components/loading/Loading";

Modal.setAppElement("#root");

const columns = [
  { name: "name", title: "Chỗ nghỉ", width: 10 },
  { name: "address", title: "Địa chỉ", width: 10 },
  { name: "phone", title: "Điện thoại", width: 10 },
  { name: "distance_from_center", title: "Cách trung tâm", width: 6 },
  { name: "description", title: "Mô tả", width: 24 },
  { name: "is_near_beach", title: "Gần biển", width: 6 },
  { name: "rank", title: "Xếp hạng", width: 6 },
  { name: "meal", title: "Bữa ăn", width: 6 },
  { name: "city_id", title: "Thành phố", width: 6 },
  { name: "property_type_id", title: "Loại chỗ nghỉ", width: 6 },
];

const item_per_page = 4;

const Properties = (props) => {
  const [loading, setLoading] = useState(false);

  const { addToast } = useToasts();

  const [data, set_data] = useState([]);
  const [ins_open, set_ins_open] = useState(false);
  const [upd_open, set_upd_open] = useState(false);
  const [del_open, set_del_open] = useState(false);
  const [ins_data, set_ins_data] = useState({
    name: "Khách sạn 1",
    address: "Trần Cung",
    phone: "0366918587",
    distance_from_center: 100,
    description: "Mô tả",
    is_near_beach: 1,
    rank: 5,
    meal: 4,
    city_id: "1",
    id_property_type: "1",
  });
  const [upd_data, set_upd_data] = useState({
    _id: "",
    name: "",
    address: "",
    phone: "",
    distance_from_center: 0,
    description: "",
    is_near_beach: 0,
    rank: 0,
    meal: 0,
    city_id: "",
    id_property_type: "",
  });
  const [del_data, set_del_data] = useState("");
  const [page_current, set_page_current] = useState(0);
  const [search, set_search] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await actions.fet(api, set_data, token);
        setLoading(false);
      } catch (err) {}
    };
    load();
  }, []);

  let data2 = data;
  if (search !== "")
    data2 = data2.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );

  const page_max = Math.ceil(data2.length / item_per_page) - 1;
  const pages = [];
  let page_left = page_current - 3,
    page_right = page_current + 3;
  if (page_left < 0) page_left = 0;
  if (page_right > page_max) page_right = page_max;
  for (let i = page_left; i <= page_right; i++) pages.push(i + 1);

  if (page_max >= 0 && page_current > page_max) set_page_current(page_max);

  const item_min = page_current * item_per_page;
  const item_max =
    page_max === page_current
      ? data2.length
      : (page_current + 1) * item_per_page;

  const goto = (page) => {
    if (page < 0) page = 0;
    else if (page > page_max) page = page_max;
    if (page !== page_current) set_page_current(page);
  };

  const action = async (type) => {
    try {
      const token = localStorage.getItem("token");
      switch (type) {
        case 0:
          await actions.ins(api, set_data, ins_data, token);
          break;
        case 1:
          await actions.upd(api, set_data, upd_data, token);
          break;
        case 2:
          await actions.del(api, set_data, del_data, token);
          break;
      }
      addToast("Thành công", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    } catch (err) {
      addToast(err.toString(), {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    }
  };

  return (
    <div>
      <HeadText>Quản lý - Chỗ nghỉ</HeadText>

      <div className="table-data">
        {loading ? (
          <Loading />
        ) : (
          <table>
            {columns.map((item) => (
              <col width={`${item.width}%`} />
            ))}
            <tbody>
              <tr>
                <td colSpan={columns.length + 1} style={{ height: 28 }}>
                  <div
                    style={{ display: "flex", flex: 1, flexDirection: "row" }}
                  >
                    <div style={{ textAlign: "center", flex: 2 }}>
                      <div
                        style={{
                          display: "inline-block",
                          width: 25,
                          height: 22,
                          color: "#888",
                          cursor: "pointer",
                        }}
                        onClick={() => goto(0)}
                      >
                        &laquo;
                      </div>
                      {pages.map((item) => (
                        <div
                          style={{
                            display: "inline-block",
                            width: 25,
                            height: 22,
                            backgroundColor:
                              item === page_current + 1 ? "#007ad9" : "#fff",
                            color: item === page_current + 1 ? "#fff" : "#888",

                            cursor: "pointer",
                          }}
                          onClick={() => goto(item - 1)}
                        >
                          {item}
                        </div>
                      ))}
                      <div
                        style={{
                          display: "inline-block",
                          width: 25,
                          height: 22,
                          color: "#888",
                          cursor: "pointer",
                        }}
                        onClick={() => goto(page_max)}
                      >
                        &raquo;
                      </div>
                    </div>
                    <input
                      value={search}
                      style={{
                        marginRight: 10,
                        width: 110,
                        border: "1px solid #aaa",
                        borderRadius: 3,
                        paddingLeft: 8,
                      }}
                      placeholder="Tìm kiếm ..."
                      onChange={(e) => set_search(e.target.value)}
                    />
                    <div style={{ flex: 1, textAlign: "right" }}>
                      Tổng: {data2.length}
                      <button
                        style={{ marginLeft: 15 }}
                        onClick={() => set_ins_open(true)}
                      >
                        <i className="bx bx-add-to-queue"></i>
                        <span
                          style={{
                            marginLeft: 8,
                            marginRight: 6,
                          }}
                        >
                          Thêm mới
                        </span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                {columns.map((item) => (
                  <th>{item.title}</th>
                ))}
                <th>Thao tác</th>
              </tr>
              {data2.slice(item_min, item_max).map((item) => (
                <tr>
                  {columns.map((i) => (
                    <td>{item[i.name]}</td>
                  ))}
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => {
                        set_upd_data(item);
                        set_upd_open(true);
                      }}
                    >
                      <i className="bx bx-edit-alt"></i>
                    </button>
                    <button
                      onClick={() => {
                        set_del_data(item);
                        set_del_open(true);
                      }}
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal
        id="ins"
        isOpen={ins_open}
        onRequestClose={() => set_ins_open(false)}
        style={custom_styles}
        contentLabel="Ins"
      >
        <div>
          <table>
            <tbody>
              <tr>
                <td>Chỗ nghỉ</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={ins_data.name}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        name: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Địa chỉ</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={ins_data.address}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        address: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Điện thoại</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={ins_data.phone}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        phone: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Cách trung tâm</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={ins_data.distance_from_center}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        distance_from_center: parseInt(event.target.value),
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Mô tả</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={ins_data.description}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        description: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Gần biển</td>
                <td>
                  <Checkbox
                    checked={ins_data.is_near_beach}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        is_near_beach: 1 - ins_data.is_near_beach,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Xếp hạng</td>
                <td>
                  <select
                    style={{
                      width: 216,
                      height: 30,
                      paddingLeft: 10,
                    }}
                    value={ins_data.rank}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        rank: parseInt(event.target.value),
                      })
                    }
                  >
                    <option value={0}>0 &#9733;</option>
                    <option value={1}>1 &#9733;</option>
                    <option value={2}>2 &#9733;</option>
                    <option value={3}>3 &#9733;</option>
                    <option value={4}>4 &#9733;</option>
                    <option value={5}>5 &#9733;</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Bữa ăn</td>
                <td>
                  <select
                    style={{
                      width: 216,
                      height: 30,
                      paddingLeft: 10,
                    }}
                    value={ins_data.meal}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        meal: parseInt(event.target.value),
                      })
                    }
                  >
                    <option value={0}>Không có</option>
                    <option value={1}>Bữa sáng</option>
                    <option value={2}>Bữa sáng và trưa</option>
                    <option value={3}>Bữa sáng và tối</option>
                    <option value={4}>Cả ba bữa</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Id thành phố</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={ins_data.city_id}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        city_id: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Id loại chỗ nghỉ</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={ins_data.id_property_type}
                    onChange={(event) =>
                      set_ins_data({
                        ...ins_data,
                        id_property_type: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <button
              className="btn-edit"
              onClick={() => {
                action(0);
                set_ins_open(false);
              }}
            >
              Thêm
            </button>
            <button className="btn-cancel" onClick={() => set_ins_open(false)}>
              Huỷ
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        id="upd"
        isOpen={upd_open}
        onRequestClose={() => set_upd_open(false)}
        style={custom_styles}
        contentLabel="Upd"
      >
        <div>
          <table>
            <tbody>
              <tr>
                <td>Chỗ nghỉ</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={upd_data.name}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        name: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Địa chỉ</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={upd_data.address}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        address: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Điện thoại</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={upd_data.phone}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        phone: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Cách trung tâm</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={upd_data.distance_from_center}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        distance_from_center: parseInt(event.target.value),
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Mô tả</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={upd_data.description}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        description: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Gần biển</td>
                <td>
                  <Checkbox
                    checked={upd_data.is_near_beach}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        is_near_beach: 1 - upd_data.is_near_beach,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Xếp hạng</td>
                <td>
                  <select
                    style={{
                      width: 216,
                      height: 30,
                      paddingLeft: 10,
                    }}
                    value={upd_data.rank}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        rank: parseInt(event.target.value),
                      })
                    }
                  >
                    <option value={0}>0 &#9733;</option>
                    <option value={1}>1 &#9733;</option>
                    <option value={2}>2 &#9733;</option>
                    <option value={3}>3 &#9733;</option>
                    <option value={4}>4 &#9733;</option>
                    <option value={5}>5 &#9733;</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Bữa ăn</td>
                <td>
                  <select
                    style={{
                      width: 216,
                      height: 30,
                      paddingLeft: 10,
                    }}
                    value={upd_data.meal}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        meal: parseInt(event.target.value),
                      })
                    }
                  >
                    <option value={0}>Không có</option>
                    <option value={1}>Bữa sáng</option>
                    <option value={2}>Bữa sáng và trưa</option>
                    <option value={3}>Bữa sáng và tối</option>
                    <option value={4}>Cả ba bữa</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Id thành phố</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={upd_data.city_id}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        city_id: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Id loại chỗ nghỉ</td>
                <td>
                  <input
                    style={{
                      width: 200,
                      height: 24,
                      paddingLeft: 10,
                    }}
                    value={upd_data.id_property_type}
                    onChange={(event) =>
                      set_upd_data({
                        ...upd_data,
                        id_property_type: event.target.value,
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <button
              className="btn-edit"
              onClick={() => {
                action(1);
                set_upd_open(false);
              }}
            >
              Sửa
            </button>
            <button className="btn-cancel" onClick={() => set_upd_open(false)}>
              Huỷ
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        id="del"
        isOpen={del_open}
        onRequestClose={() => set_del_open(false)}
        style={custom_styles}
        contentLabel="Del"
      >
        <div>Bạn có chắc chắn muốn xóa không?</div>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button
            className="btn-edit"
            onClick={() => {
              action(2);
              set_del_open(false);
            }}
          >
            Ok
          </button>
          <button className="btn-cancel" onClick={() => set_del_open(false)}>
            Hủy
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Properties;
