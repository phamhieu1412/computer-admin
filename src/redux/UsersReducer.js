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
import { actions as AppActions } from "../redux/AppRedux";

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, STAFF } = PREFIX;

const _types = typesWithPrefix(STAFF);
const TYPE = {
  CREATE: _types("CREATE"),
  FORGOT_PASSWORD: _types("FORGOT_PASSWORD"),
  UPDATE: _types("UPDATE"),
  GET_ALL: _types("GET_ALL"),
  DELETE: _types("DELETE"),
};

export const actions = {
  creating: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [STAFF, API_CALLING] },
  }),
  createSuccess: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [STAFF, API_CALLED_SUCCESS] },
  }),
  createFailure: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [STAFF, API_CALLED_FAILURE] },
  }),
  createUser: (payload, meta) => async (dispatch) => {
    dispatch(actions.creating());

    const api = API_URLS.USER.createUser(payload);
    const { response } = await apiCall(api);

    if (response?.status === 200 && response.data && response.data.data) {
      dispatch(actions.createSuccess());
      meta.onSuccess("Tạo thành công");
      dispatch(actions.getUsers());
    } else {
      dispatch(actions.createFailure());
      meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
    }
  },

  editUser: (id, payload, meta) => async (dispatch) => {
    const api = API_URLS.USER.editUser(id, payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.message.status === "success"
    ) {
      meta.onSuccess("Cập nhập thành công");
      dispatch(actions.getUsers());
    } else {
      meta.onFailure("Cập nhập không thành công! Vui lòng thử lại.");
    }
  },

  forgotPassword: (payload, meta) => async (dispatch) => {
    const api = API_URLS.USER.forgotPassword(payload);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.message.status === "success"
    ) {
      meta.onSuccess("Đã gửi email thành công");
      dispatch(actions.getUsers());
    } else {
      meta.onFailure("Đã gửi email không thành công! Vui lòng thử lại.");
    }
  },

  gettingAll: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [STAFF, API_CALLING] },
  }),
  getAllSuccess: (payload) => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [STAFF, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllFailure: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [STAFF, API_CALLED_FAILURE] },
  }),
  getUsers: () => async (dispatch) => {
    dispatch(actions.gettingAll());
    const api = API_URLS.USER.getUsers();
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

  deleting: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [STAFF, API_CALLING] },
  }),
  deleteSuccess: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [STAFF, API_CALLED_SUCCESS] },
  }),
  deleteFailure: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [STAFF, API_CALLED_FAILURE] },
  }),
  deleteUser: (id, meta) => async (dispatch) => {
    dispatch(actions.deleting());
    const api = API_URLS.USER.deleteUser(id);
    const { response } = await apiCall(api);

    if (response?.status === 200 && response.data && response.data.code == 200) {
      dispatch(actions.deleteSuccess());
      meta.onSuccess("Xoá thành công");
      dispatch(actions.getUsers());
    } else {
      dispatch(actions.deleteFailure());
      meta.onFailure("Xoá không thành công! Vui lòng thử lại.");
    }
  },
};

const initialState = {
  isFetching: false,
  list: [],
  detail: {},
  meta: {
    page: 1,
    elementOfPage: 10,
    total: 0,
    total_pages: 0,
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

    case TYPE.GET_ALL:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
        draft.list = action.payload.items;
        draft.meta.total = action.payload.total;
        draft.meta.total_pages = action.payload.total_pages;
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

    default:
  }
}, initialState);
