import produce from "immer";

import { API_URLS } from "../configs/api";
import { apiCall } from "../utils/api";
import {
  isCallingApi,
  isSuccessfulApiCall,
  isFailedApiCall,
} from "./actionDedicate";
import { PREFIX, typesWithPrefix } from "./config";

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, PRODUCTS } =
  PREFIX;

const _types = typesWithPrefix(PRODUCTS);
const TYPE = {
  GET_PRODUCTS: _types("GET_PRODUCTS"),
  GET_DETAIL: _types("GET_DETAIL"),
  UPDATE_PRODUCTS: _types("UPDATE_PRODUCTS"),
  GET_PRODUCTS_OUT_OF_STOCK: _types("GET_PRODUCTS_OUT_OF_STOCK"),
  GET_PRODUCTS_INVENTORY: _types("GET_PRODUCTS_INVENTORY"),
  CREATE_PRODUCTS: _types("CREATE_PRODUCTS"),
  DELETE: _types("DELETE"),
};

export const actions = {
  creating: () => ({
    type: TYPE.CREATE_PRODUCTS,
    meta: { prefix: [PRODUCTS, API_CALLING] },
  }),
  createSuccess: () => ({
    type: TYPE.CREATE_PRODUCTS,
    meta: { prefix: [PRODUCTS, API_CALLED_SUCCESS] },
  }),
  createFailure: () => ({
    type: TYPE.CREATE_PRODUCTS,
    meta: { prefix: [PRODUCTS, API_CALLED_FAILURE] },
  }),
  createProduct: (payload, meta) => async (dispatch) => {
    dispatch(actions.creating());
    const api = API_URLS.PRODUCTS.createProduct(payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.message.status === "success"
    ) {
      dispatch(actions.createSuccess());
      meta.onSuccess("Tạo thành công");
      dispatch(
        actions.getProducts({
          page: 1,
          page_size: 10,
        })
      );
    } else {
      dispatch(actions.createFailure());
      meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
    }
  },

  gettingAll: () => ({
    type: TYPE.GET_PRODUCTS,
    meta: { prefix: [PRODUCTS, API_CALLING] },
  }),
  getAllSuccess: (payload) => ({
    type: TYPE.GET_PRODUCTS,
    meta: { prefix: [PRODUCTS, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllFailure: () => ({
    type: TYPE.GET_PRODUCTS,
    meta: { prefix: [PRODUCTS, API_CALLED_FAILURE] },
  }),
  getProducts: (payload) => async (dispatch) => {
    dispatch(actions.gettingAll());
    const api = API_URLS.PRODUCTS.getProducts(payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        dispatch(actions.getAllSuccess({ data, page: payload.page }));
      } else {
        dispatch(actions.getAllFailure());
      }
    } else {
      dispatch(actions.getAllFailure());
    }
  },

  gettingDetail: () => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [PRODUCTS, API_CALLING] },
  }),
  getDetailSuccess: (payload) => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [PRODUCTS, API_CALLED_SUCCESS] },
    payload,
  }),
  getDetailFailure: () => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [PRODUCTS, API_CALLED_FAILURE] },
  }),
  getDetailProduct: (id) => async (dispatch) => {
    dispatch(actions.gettingDetail());
    const api = API_URLS.PRODUCTS.getDetailProduct(id);
    const { response, status } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        dispatch(actions.getDetailSuccess(data));
      } else {
        dispatch(actions.getDetailFailure());
      }
    } else {
      dispatch(actions.getDetailFailure());
    }
  },

  updateCategory: (payload, id, meta) => async (dispatch) => {
    const api = API_URLS.PRODUCTS.updateProduct(id, payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.message.status === "success"
    ) {
      meta.onSuccess("Cập nhập thành công");
      dispatch(
        actions.getProducts({
          page: 1,
          page_size: 10,
        })
      );
    } else {
      meta.onFailure("Cập nhập không thành công! Vui lòng thử lại.");
    }
  },

  deleting: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [PRODUCTS, API_CALLING] },
  }),
  deleteSuccess: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [PRODUCTS, API_CALLED_SUCCESS] },
  }),
  deleteFailure: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [PRODUCTS, API_CALLED_FAILURE] },
  }),
  deleteProduct: (id, meta) => async (dispatch) => {
    dispatch(actions.deleting());
    const api = API_URLS.PRODUCTS.deleteProduct(id);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code == 200 &&
      response.data.message.status === "success"
    ) {
      dispatch(actions.deleteSuccess());
      meta.onSuccess("Xoá thành công");
      dispatch(
        actions.getProducts({
          page: 1,
          page_size: 10,
        })
      );
    } else {
      dispatch(actions.deleteFailure());
      meta.onFailure("Xoá không thành công! Vui lòng thử lại.");
    }
  },

  gettingAllOutOfStock: () => ({
    type: TYPE.GET_PRODUCTS_OUT_OF_STOCK,
    meta: { prefix: [PRODUCTS, API_CALLING] },
  }),
  getAllOutOfStockSuccess: (payload) => ({
    type: TYPE.GET_PRODUCTS_OUT_OF_STOCK,
    meta: { prefix: [PRODUCTS, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllOutOfStockFailure: () => ({
    type: TYPE.GET_PRODUCTS_OUT_OF_STOCK,
    meta: { prefix: [PRODUCTS, API_CALLED_FAILURE] },
  }),
  getProductsOutOfStock: (payload) => async (dispatch) => {
    dispatch(actions.gettingAllOutOfStock());
    const api = API_URLS.PRODUCTS.getProductsOutOfStock(payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        dispatch(actions.getAllOutOfStockSuccess(data));
      } else {
        dispatch(actions.getAllOutOfStockFailure());
      }
    } else {
      dispatch(actions.getAllOutOfStockFailure());
    }
  },

  gettingAllInventory: () => ({
    type: TYPE.GET_PRODUCTS_INVENTORY,
    meta: { prefix: [PRODUCTS, API_CALLING] },
  }),
  getAllInventorySuccess: (payload) => ({
    type: TYPE.GET_PRODUCTS_INVENTORY,
    meta: { prefix: [PRODUCTS, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllInventoryFailure: () => ({
    type: TYPE.GET_PRODUCTS_INVENTORY,
    meta: { prefix: [PRODUCTS, API_CALLED_FAILURE] },
  }),
  getReportProducts: (params) => async (dispatch) => {
    dispatch(actions.gettingAllInventory());
    const api = API_URLS.PRODUCTS.getReportProducts(params);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        dispatch(actions.getAllInventorySuccess({ data, page: params.page }));
      } else {
        dispatch(actions.getAllInventoryFailure());
      }
    } else {
      dispatch(actions.getAllInventoryFailure());
    }
  },
};

const initialState = {
  isFetching: false,
  list: [],
  detail: {},
  isFetchingDetail: false,
  meta: {
    page: 1,
    elementOfPage: 10,
    total: 0,
  },
  listOutOfStock: [],
  isFetchingOutOfStock: false,
  listInventory: [],
  isFetchingInventory: false,
  metaInventory: {
    page: 1,
    elementOfPage: 10,
    total: 0,
  },
};

export const reducer = produce((draft, action) => {
  switch (action.type) {
    case TYPE.CREATE:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
      }
      break;

    case TYPE.GET_PRODUCTS:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
        draft.list = action.payload.data.items;
        draft.meta.total = action.payload.data.total;
        draft.meta.page = action.payload.data.page;
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
        draft.list = [];
      }
      break;

    case TYPE.GET_PRODUCTS_OUT_OF_STOCK:
      if (isCallingApi(action)) {
        draft.isFetchingOutOfStock = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetchingOutOfStock = false;
        draft.listOutOfStock = action.payload.items;
      }
      if (isFailedApiCall(action)) {
        draft.isFetchingOutOfStock = false;
        draft.listOutOfStock = [];
      }
      break;

    case TYPE.GET_PRODUCTS_INVENTORY:
      if (isCallingApi(action)) {
        draft.isFetchingInventory = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetchingInventory = false;
        draft.listInventory = action.payload.data.items;
        draft.metaInventory.total = action.payload.data.total;
        draft.metaInventory.page = action.payload.data.page;
      }
      if (isFailedApiCall(action)) {
        draft.isFetchingInventory = false;
        draft.listInventory = [];
      }
      break;

    case TYPE.DELETE:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
      }
      break;

    case TYPE.UPDATE:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
      }
      break;

    case TYPE.GET_DETAIL:
      if (isCallingApi(action)) {
        draft.isFetchingDetail = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetchingDetail = false;
        draft.detail = action.payload;
      }
      if (isFailedApiCall(action)) {
        draft.isFetchingDetail = false;
        draft.detail = {};
      }
      break;

    default:
  }
}, initialState);
