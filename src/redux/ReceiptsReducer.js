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

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, RECEIPTS } = PREFIX;

const _types = typesWithPrefix(RECEIPTS);
const TYPE = {
  CREATE: _types("CREATE"),
  GET_ID: _types("GET_ID"),
  GET_ALL: _types("GET_ALL"),
};

export const actions = {
  creating: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [RECEIPTS, API_CALLING] },
  }),
  createSuccess: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [RECEIPTS, API_CALLED_SUCCESS] },
  }),
  createFailure: () => ({
    type: TYPE.CREATE,
    meta: { prefix: [RECEIPTS, API_CALLED_FAILURE] },
  }),
  // createManufacturer: (payload, urlImage, meta) => async (dispatch) => {
  //   dispatch(actions.creating());

  //   let hasImg = false;
  //   if (urlImage) {
  //     hasImg = true;
  //   } else {
  //     hasImg = false;
  //   }

  //   if (hasImg) {
  //     const res = await dispatch(AppActions.uploadImage(urlImage));

  //     if (res && res.data && res.data.resource_id) {
  //       const tempData = {
  //         ...payload,
  //         image_url: `${url}/file/${res.data.resource_id}`,
  //       };
  //       const api = API_URLS.RECEIPTS.createManufacturer(tempData);
  //       const { response } = await apiCall(api);

  //       if (response.status === 200 && response.data && response.data.data) {
  //         dispatch(actions.createSuccess());
  //         meta.onSuccess("Tạo thành công");
  //         dispatch(actions.getReceipts());
  //       } else {
  //         dispatch(actions.createFailure());
  //         meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
  //       }
  //     } else {
  //       dispatch(actions.updateFailure());
  //       meta.onFailure("Upload ảnh không thành công! Vui lòng thử lại.");
  //     }
  //   } else {
  //     const api = API_URLS.RECEIPTS.createManufacturer(payload);
  //     const { response } = await apiCall(api);

  //     if (response.status === 200 && response.data && response.data.data) {
  //       dispatch(actions.createSuccess());
  //       meta.onSuccess("Tạo thành công");
  //       dispatch(actions.getReceipts());
  //     } else {
  //       dispatch(actions.createFailure());
  //       meta.onFailure("Tạo không thành công! Vui lòng thử lại.");
  //     }
  //   }
  // },

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

    default:
  }
}, initialState);
