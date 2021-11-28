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
import { actions as AuthActions } from "../redux/AuthReducer";

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, CATEGORIES } =
  PREFIX;

const _types = typesWithPrefix(CATEGORIES);
const TYPE = {
  CREATE: _types("CREATE"),
  UPDATE: _types("UPDATE"),
  GET_ALL: _types("GET_ALL"),
  DELETE: _types("DELETE"),
};

export const actions = {
  creating: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [CATEGORIES, API_CALLING] },
  }),
  createSuccess: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [CATEGORIES, API_CALLED_SUCCESS] },
  }),
  createFailure: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [CATEGORIES, API_CALLED_FAILURE] },
  }),
  createCategory: (payload, urlImage, meta) => async (dispatch) => {
    dispatch(actions.creating());

    let hasImg = false;
    if (urlImage) {
      hasImg = true;
    } else {
      hasImg = false;
    }

    if (hasImg) {
      const res = await dispatch(AppActions.uploadImage(urlImage));

      if (res && res.data && res.data.resource_id) {
        const tempData = {
          ...payload,
          image_url: `${url}/file/${res.data.resource_id}`,
        };
        const api = API_URLS.CATEGORIES.createCategory(tempData);
        const { response } = await apiCall(api);

        if (response?.status === 200 && response.data && response.data.data) {
          dispatch(actions.createSuccess());
          meta.onSuccess("Tạo thành công");
          dispatch(actions.getCategories());
        } else {
          dispatch(actions.createFailure());
          meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
        }
      } else {
        dispatch(actions.updateFailure());
        meta.onFailure("Upload ảnh không thành công! Vui lòng thử lại.");
      }
    } else {
      const api = API_URLS.CATEGORIES.createCategory(payload);
      const { response } = await apiCall(api);

      if (response?.status === 200 && response.data && response.data.data) {
        dispatch(actions.createSuccess());
        meta.onSuccess("Tạo thành công");
        dispatch(actions.getCategories());
      } else {
        dispatch(actions.createFailure());
        meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
      }
    }
  },

  gettingAll: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [CATEGORIES, API_CALLING] },
  }),
  getAllSuccess: (payload) => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [CATEGORIES, API_CALLED_SUCCESS] },
    payload,
  }),
  getAllFailure: () => ({
    type: TYPE.GET_ALL,
    meta: { prefix: [CATEGORIES, API_CALLED_FAILURE] },
  }),
  getCategories: () => async (dispatch) => {
    dispatch(actions.gettingAll());
    const api = API_URLS.CATEGORIES.getCategories();
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
    meta: { prefix: [CATEGORIES, API_CALLING] },
  }),
  updateSuccess: (payload) => ({
    type: TYPE.UPDATE,
    meta: { prefix: [CATEGORIES, API_CALLED_SUCCESS] },
    payload,
  }),
  updateFailure: () => ({
    type: TYPE.UPDATE,
    meta: { prefix: [CATEGORIES, API_CALLED_FAILURE] },
  }),
  updateCategory: (id, payload, urlImage, meta) => async (dispatch) => {
    dispatch(actions.updating());

    let hasImg = false;
    if (urlImage) {
      hasImg = true;
    } else {
      hasImg = false;
    }

    if (hasImg) {
      const res = await dispatch(AppActions.uploadImage(urlImage));

      if (res && res.data && res.data.resource_id) {
        const tempData = {
          ...payload,
          image_url: `${url}/file/${res.data.resource_id}`,
        };
        const api = API_URLS.CATEGORIES.updateCategory(id, tempData);
        const { response } = await apiCall(api);
        if (response?.status === 200 && response.data && response.data.data) {
          const data = response.data.data;
          dispatch(actions.updateSuccess(data));
          meta.onSuccess("Chỉnh sửa thành công");
          dispatch(actions.getCategories());
        } else {
          dispatch(actions.updateFailure());
          meta.onFailure("Chỉnh sửa không thành công! Vui lòng thử lại.");
        }
      } else {
        dispatch(actions.updateFailure());
        meta.onFailure("Upload ảnh không thành công! Vui lòng thử lại.");
      }
    } else {
      const api = API_URLS.CATEGORIES.updateCategory(id, payload);
      const { response } = await apiCall(api);
      if (response?.status === 200 && response.data && response.data.data) {
        const data = response.data.data;
        dispatch(actions.updateSuccess(data));
        meta.onSuccess("Chỉnh sửa thành công");
        dispatch(actions.getCategories());
      } else {
        dispatch(actions.updateFailure());
        meta.onFailure("Chỉnh sửa không thành công! Vui lòng thử lại.");
      }
    }
  },

  deleting: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [CATEGORIES, API_CALLING] },
  }),
  deleteSuccess: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [CATEGORIES, API_CALLED_SUCCESS] },
  }),
  deleteFailure: () => ({
    type: TYPE.DELETE,
    meta: { prefix: [CATEGORIES, API_CALLED_FAILURE] },
  }),
  deleteCategory: (id, meta) => async (dispatch) => {
    dispatch(actions.deleting());
    const api = API_URLS.CATEGORIES.deleteCategory(id);
    const { response } = await apiCall(api);

    if (response?.status === 200 && response.data && response.data.code == 200) {
      dispatch(actions.deleteSuccess());
      meta.onSuccess("Xoá thành công");
      dispatch(actions.getCategories());
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
