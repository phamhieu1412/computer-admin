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

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, SUPPLIER } =
  PREFIX;

const _types = typesWithPrefix(SUPPLIER);
const TYPE = {
  CREATE: _types("CREATE"),
  UPDATE: _types("UPDATE"),
  GET_ALL: _types("GET_ALL"),
  DELETE: _types("DELETE"),
};

export const actions = {
  creating: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [SUPPLIER, API_CALLING] },
  }),
  createSuccess: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [SUPPLIER, API_CALLED_SUCCESS] },
  }),
  createFailure: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [SUPPLIER, API_CALLED_FAILURE] },
  }),
  createSupplier: (payload, meta) => async (dispatch) => {
    dispatch(actions.creating());

    const api = API_URLS.SUPPLIER.createSupplier(payload);
    const { response } = await apiCall(api);

    if (response?.status === 200 && response.data && response.data.data) {
      dispatch(actions.createSuccess());
      meta.onSuccess("Tạo thành công");
      dispatch(actions.getSuppliers());
    } else {
      dispatch(actions.createFailure());
      meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
    }
  },

  gettingAll: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [SUPPLIER, API_CALLING] },
  }),
  getAllSuccess: (payload) => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [SUPPLIER, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllFailure: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [SUPPLIER, API_CALLED_FAILURE] },
  }),
  getSuppliers: () => async (dispatch) => {
    dispatch(actions.gettingAll());
    const api = API_URLS.SUPPLIER.getSuppliers();
    const { response, status } = await apiCall(api);

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
    } else if (status && status === 401) {
      dispatch(AuthActions.logOut());
    } else {
      dispatch(actions.getAllFailure());
    }
  },

  updating: () => ({
    type: TYPE.UPDATE,
    meta: { prefix: [SUPPLIER, API_CALLING] },
  }),
  updateSuccess: (payload) => ({
    type: TYPE.UPDATE,
    meta: { prefix: [SUPPLIER, API_CALLED_SUCCESS] },
    payload,
  }),
  updateFailure: () => ({
    type: TYPE.UPDATE,
    meta: { prefix: [SUPPLIER, API_CALLED_FAILURE] },
  }),
  updateBanner: (id, payload, meta) => async (dispatch) => {
    dispatch(actions.updating());

    const api = API_URLS.SUPPLIER.updateSupplier(id, payload);
    const { response } = await apiCall(api);
    if (response?.status === 200 && response.data && response.data.data) {
      const data = response.data.data;
      dispatch(actions.updateSuccess(data));
      meta.onSuccess("Chỉnh sửa thành công");
      dispatch(actions.getSuppliers());
    } else {
      dispatch(actions.updateFailure());
      meta.onFailure("Chỉnh sửa không thành công! Vui lòng thử lại.");
    }
  },

  deleting: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [SUPPLIER, API_CALLING] },
  }),
  deleteSuccess: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [SUPPLIER, API_CALLED_SUCCESS] },
  }),
  deleteFailure: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [SUPPLIER, API_CALLED_FAILURE] },
  }),
  deleteSupplier: (id, meta) => async (dispatch) => {
    dispatch(actions.deleting());
    const api = API_URLS.SUPPLIER.deleteSupplier(id);
    const { response } = await apiCall(api);

    if (response?.status === 200 && response.data && response.data.code == 200) {
      dispatch(actions.deleteSuccess());
      meta.onSuccess("Xoá thành công");
      dispatch(actions.getSuppliers());
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
        draft.list = action.payload;
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
