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

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, CUSTOMER } =
  PREFIX;

const _types = typesWithPrefix(CUSTOMER);
const TYPE = {
  GET_ALL: _types("GET_ALL"),
  DELETE: _types("DELETE"),
};

export const actions = {
  gettingAll: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [CUSTOMER, API_CALLING] },
  }),
  getAllSuccess: (payload) => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [CUSTOMER, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllFailure: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [CUSTOMER, API_CALLED_FAILURE] },
  }),
  getCustomers: () => async (dispatch) => {
    dispatch(actions.gettingAll());
    const api = API_URLS.CUSTOMER.getCustomers();
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

  deleting: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [CUSTOMER, API_CALLING] },
  }),
  deleteSuccess: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [CUSTOMER, API_CALLED_SUCCESS] },
  }),
  deleteFailure: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [CUSTOMER, API_CALLED_FAILURE] },
  }),
  deleteCustomer: (id, meta) => async (dispatch) => {
    dispatch(actions.deleting());
    const api = API_URLS.CUSTOMER.deleteCustomer(id);
    const { response } = await apiCall(api);

    if (response.status === 200 && response.data && response.data.code == 200) {
      dispatch(actions.deleteSuccess());
      meta.onSuccess("Xoá thành công");
      dispatch(actions.getCustomers());
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

    default:
  }
}, initialState);
