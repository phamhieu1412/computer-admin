import React from "react";

import { Select, Spin } from "antd";
import debounce from "lodash/debounce";

import "antd/dist/antd.css";
import { url } from "../../configs/api";
import { apiCallDebounce } from "../../utils/api";

function DebounceSelect({ fetchOptions, debounceTimeout = 500, ...props }) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

async function fetchUserList(keyword) {
  console.log("fetching user", keyword);
  const response = await apiCallDebounce({
    endPoint: `${url}/api/v1/manage/products/search`,
    method: "POST",
    headers: { Authorization: localStorage.getItem("token") },
    payload: {
      page: 1,
      page_size: 15,
      keyword,
    },
  });
  let array = [];
  if (
    response.response?.status === 200 &&
    response.response.data &&
    response.response.data.code === 200 &&
    response.response.data.message.status === "success"
  ) {
    const data = response.response.data.data.items;
    for (let i = 0; i < data.length; i++) {
      array.push({
        label: data[i].name,
        id: data[i].id,
        value: data[i].id,
      });
    }
  }

  return array;
}

const SearchInput = ({ dataTempChooseProducts, setTempProduct }) => {
  const [value, setValue] = React.useState([]);

  const onChangeListProduct = (newValue) => {
    const item = dataTempChooseProducts.find((i) => i.key === newValue.key);
    if (!item) {
      setTempProduct({ key: newValue.value, label: newValue.label });
    }
  };
  return (
    <DebounceSelect
      // mode="multiple"
      showArrow={false}
      filterOption={false}
      showSearch
      value={value}
      placeholder="Nhập và chọn sản phẩm"
      fetchOptions={fetchUserList}
      onChange={(newValue) => onChangeListProduct(newValue)}
      style={{
        width: "800px",
      }}
    />
  );
};

export default SearchInput;
