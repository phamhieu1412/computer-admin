import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import HeadText from "./HeadText";
import Loading from "../../components/loading/Loading";

import {
  API_STATISTICS_PROPERTIES_BY_CITY,
  API_STATISTICS_ROOMS_BY_PROPERTY,
  API_STATISTICS_ROOMS_BY_CITY,
} from "../../constants";

import PropertiesByCity from "./PropertiesByCity";
import RoomsByProperty from "./RoomsByProperty";

const General = (props) => {
  const [data, set_data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, set_tab] = useState("PROPERTIES_BY_CITY");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        let dt = {
          properties_by_city: null,
          rooms_by_property: null,
          rooms_by_city: null,
        };
        let response = await fetch(API_STATISTICS_PROPERTIES_BY_CITY, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) throw new Error("Error");
        let result = await response.json();
        if (!result.status) throw new Error("Error");
        dt.properties_by_city = result.data;

        response = await fetch(API_STATISTICS_ROOMS_BY_PROPERTY, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) throw new Error("Error");
        result = await response.json();
        if (!result.status) throw new Error("Error");
        dt.rooms_by_property = result.data;

        response = await fetch(API_STATISTICS_ROOMS_BY_CITY, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) throw new Error("Error");
        result = await response.json();
        if (!result.status) throw new Error("Error");
        dt.rooms_by_city = result.data;

        set_data(dt);
        setLoading(false);
      } catch (err) {
        throw err;
      }
    };
    load();
  }, []);

  let Render = <div />;

  if (data) {
    switch (tab) {
      case "PROPERTIES_BY_CITY":
        Render = <PropertiesByCity data={data} />;
        break;
      case "ROOMS_BY_PROPERTY":
        Render = <RoomsByProperty data={data} />;
        break;
    }
  }

  return (
    <div>
      <HeadText>Danh mục - Tổng quan</HeadText>
      <div className="tab">
        <button
          style={
            tab === "PROPERTIES_BY_CITY"
              ? {
                  backgroundColor: "#ccc",
                  padding: "5px 15px",
                  marginRight: 10,
                }
              : {
                  padding: "5px 15px",
                  marginRight: 10,
                }
          }
          onClick={() => set_tab("PROPERTIES_BY_CITY")}
        >
          Chỗ nghỉ theo thành phố
        </button>
        <button
          style={
            tab === "ROOMS_BY_PROPERTY"
              ? {
                  backgroundColor: "#ccc",
                  padding: "5px 15px",
                  marginRight: 10,
                }
              : {
                  padding: "5px 15px",
                  marginRight: 10,
                }
          }
          onClick={() => set_tab("ROOMS_BY_PROPERTY")}
        >
          Phòng theo khách sạn
        </button>
      </div>
      {loading ? <Loading /> : <div style={{ margin: "0 auto" }}>{Render}</div>}
    </div>
  );
};

export default General;