import produce from "immer";

import { API_URLS } from "../configs/api";
import { apiCall } from "../utils/api";
import {
  isCallingApi,
  isSuccessfulApiCall,
  isFailedApiCall,
} from "./actionDedicate";
import { PREFIX, typesWithPrefix } from "./config";
import { actions as AuthActions } from "../redux/AuthReducer";

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, ORDERS } = PREFIX;

const _types = typesWithPrefix(ORDERS);
const TYPE = {
  GET_ALL: _types("GET_ALL"),
  GET_DETAIL: _types("GET_DETAIL"),
  UPDATE_STATUS: _types("UPDATE_STATUS"),
  UPDATE_STATUS_AND_TIME: _types("UPDATE_STATUS_AND_TIME"),
  UPDATE_DATE: _types("UPDATE_DATE"),
  CANCEL_ORDER: _types("CANCEL_ORDER"),
};

export const actions = {
  gettingAll: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [ORDERS, API_CALLING] },
  }),
  getAllSuccess: (payload) => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [ORDERS, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllFailure: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [ORDERS, API_CALLED_FAILURE] },
  }),
  getOrders: (params) => async (dispatch) => {
    dispatch(actions.gettingAll());
    const api = API_URLS.ORDERS.getOrders(params);
    const { response, status } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        dispatch(
          actions.getAllSuccess({ data, page: params.page, filter: params })
        );
      } else {
        dispatch(actions.getAllFailure());
      }
    } else if (status && status === 401) {
      dispatch(AuthActions.logOut());
    } else {
      dispatch(actions.getAllFailure());
    }
  },

  gettingDetail: () => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [ORDERS, API_CALLING] },
  }),
  getDetailSuccess: (payload) => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [ORDERS, API_CALLED_SUCCESS] },
    payload,
  }),
  getDetailFailure: () => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [ORDERS, API_CALLED_FAILURE] },
  }),
  getDetailOrder: (id) => async (dispatch) => {
    dispatch(actions.gettingDetail());
    const api = API_URLS.ORDERS.getDetailOrder(id);
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

  updateStatus: (id, payload, meta) => async (dispatch) => {
    const api = API_URLS.ORDERS.updateStatus(id, payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.message.status === "success"
    ) {
      meta.onSuccess("Cập nhập thành công");
      dispatch(
        actions.getOrders({
          page: 1,
          page_size: 10,
        })
      );
    } else {
      meta.onFailure("Cập nhập không thành công! Vui lòng thử lại.");
    }
  },

  cancelOrder: (id, payload, meta) => async (dispatch) => {
    const api = API_URLS.ORDERS.cancelOrder(id, payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code == 200 &&
      response.data.message.status === "success"
    ) {
      meta.onSuccess("Xoá thành công");
      dispatch(
        actions.getOrders({
          page: 1,
          page_size: 10,
        })
      );
    } else {
      meta.onFailure("Xoá không thành công! Vui lòng thử lại.");
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
  filter: {},
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

    case TYPE.GET_ALL:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
        draft.list = action.payload.data.items;
        draft.meta.total = action.payload.data.total;
        draft.meta.page = action.payload.data.page;
        draft.meta.filter = action.payload.filter;
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
        draft.list = [];
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
