import produce from "immer";

import { API_URLS } from "../configs/api";
import { apiCall } from "../utils/api";
import {
  isCallingApi,
  isSuccessfulApiCall,
  isFailedApiCall,
} from "./actionDedicate";
import { PREFIX, typesWithPrefix } from "./config";

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, AUTH } = PREFIX;

const _types = typesWithPrefix(AUTH);
const TYPE = {
  LOGIN: _types("LOGIN"),
  LOGOUT: _types("LOGOUT"),
  GET_INFO_USER_ADMIN: _types("GET_INFO_USER_ADMIN"),
};

export const actions = {
  // login
  logging: () => ({
    type: TYPE.LOGIN,
    meta: { prefix: [AUTH, API_CALLING] },
  }),
  loginSuccess: (payload) => ({
    type: TYPE.LOGIN,
    meta: { prefix: [AUTH, API_CALLED_SUCCESS] },
    payload,
  }),
  loginFailure: () => ({
    type: TYPE.LOGIN,
    meta: { prefix: [AUTH, API_CALLED_FAILURE] },
  }),
  login: (payload, meta) => async (dispatch) => {
    dispatch(actions.logging());
    const api = API_URLS.USER.login(payload);
    const { response } = await apiCall(api);

    if (response?.status === 200 && response.data && response.data.data) {
      const data = response.data.data;
      dispatch(actions.loginSuccess(data));
      meta.onSuccess();
    } else {
      dispatch(actions.loginFailure());
      meta.onFailure("Email hoặc mật khẩu không đúng! Vui lòng thử lại.");
    }
  },

  // dang xuat
  logOut: () => (dispatch) => {
    dispatch({ type: TYPE.LOGOUT });
  },

  // get info user
  gettingInfoUser: () => ({
    type: TYPE.GET_INFO_USER_ADMIN,
    meta: { prefix: [AUTH, API_CALLING] },
  }),
  getInfoUserSuccess: (payload) => ({
    type: TYPE.GET_INFO_USER_ADMIN,
    meta: { prefix: [AUTH, API_CALLED_SUCCESS] },
    payload,
  }),
  getInfoUserFailure: () => ({
    type: TYPE.GET_INFO_USER_ADMIN,
    meta: { prefix: [AUTH, API_CALLED_FAILURE] },
  }),
  getUserInfo: () => async (dispatch) => {
    dispatch(actions.gettingInfoUser());
    const api = API_URLS.USER.getUserInfo();
    const { response, status } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        dispatch(actions.getInfoUserSuccess(data));
      } else {
        dispatch(actions.getInfoUserFailure());
      }
    } else if (status && status === 401) {
      dispatch(actions.logOut());
    } else {
      dispatch(actions.getInfoUserFailure());
    }
  },
};

const initialState = {
  isFetching: false,
  userDetail: {},
  infoUserAdmin: {},
};

export const reducer = produce((draft, action) => {
  switch (action.type) {
    case TYPE.LOGIN:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
        draft.userDetail = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        localStorage.setItem("token", `Bearer ${action.payload.access_token}`);
        localStorage.setItem(
          "refresh_token",
          `Bearer ${action.payload.refresh_token}`
        );
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
        draft.userDetail = {};
      }
      break;

    case TYPE.LOGOUT:
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      draft.userDetail = {};
      break;

    case TYPE.GET_INFO_USER_ADMIN:
      if (isCallingApi(action)) {
        draft.isFetching = true;
      }
      if (isSuccessfulApiCall(action)) {
        draft.isFetching = false;
        draft.infoUserAdmin = action.payload;
      }
      if (isFailedApiCall(action)) {
        draft.isFetching = false;
        draft.infoUserAdmin = {};
      }
      break;

    default:
  }
}, initialState);
