import produce from "immer";

import { API_URLS } from "../configs/api";
import { apiCall } from "../utils/api";
import {
  isCallingApi,
  isSuccessfulApiCall,
  isFailedApiCall,
} from "./actionDedicate";
import { PREFIX, typesWithPrefix } from "./config";
import { url } from "..//configs/api";
import { actions as AuthActions } from "../redux/AuthReducer";

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, RECEIPTS } =
  PREFIX;

const _types = typesWithPrefix(RECEIPTS);
const TYPE = {
  CREATE: _types("CREATE"),
  GET_ID: _types("GET_ID"),
  GET_ALL: _types("GET_ALL"),
  GET_DETAIL: _types("GET_DETAIL"),
};

export const actions = {
  createReceipt: (payload, meta) => async (dispatch) => {
    const api = API_URLS.RECEIPTS.createReceipt(payload);
    const { response } = await apiCall(api);

    if (response.status === 200 && response.data && response.data.data) {
      meta.onSuccess("Tạo thành công");
      dispatch(actions.getReceipts());
    } else {
      meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
    }
  },

  gettingAll: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [RECEIPTS, API_CALLING] },
  }),
  getAllSuccess: (payload) => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [RECEIPTS, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllFailure: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [RECEIPTS, API_CALLED_FAILURE] },
  }),
  getReceipts: () => async (dispatch) => {
    dispatch(actions.gettingAll());
    const api = API_URLS.RECEIPTS.getReceipts();
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        dispatch(actions.getAllSuccess(data));
      } else {
        dispatch(actions.getAllFailure());
      }
    } else {
      dispatch(actions.getAllFailure());
    }
  },

  gettingDetail: () => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [RECEIPTS, API_CALLING] },
  }),
  getDetailSuccess: (payload) => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [RECEIPTS, API_CALLED_SUCCESS] },
    payload,
  }),
  getDetailFailure: () => ({
    type: TYPE.GET_DETAIL,
    meta: { prefix: [RECEIPTS, API_CALLED_FAILURE] },
  }),
  getDetailReceipt: (id) => async (dispatch) => {
    dispatch(actions.gettingDetail());
    const api = API_URLS.RECEIPTS.getDetailReceipt(id);
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
    } else if (status && status === 401) {
      dispatch(AuthActions.logOut());
    } else {
      dispatch(actions.getDetailFailure());
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

    case TYPE.GET_ALL:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
        draft.list = action.payload;
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
        draft.list = [];
      }
      break;

    default:
  }
}, initialState);
