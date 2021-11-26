import produce from "immer";

import { API_URLS } from "../configs/api";
import { apiCall } from "../utils/api";
import {
  isCallingApi,
  isSuccessfulApiCall,
  isFailedApiCall,
} from "./actionDedicate";
import { PREFIX, typesWithPrefix } from "./config";

const { API_CALLING, API_CALLED_SUCCESS, API_CALLED_FAILURE, APP } = PREFIX;

const _types = typesWithPrefix(APP);
const TYPE = {
  POST_IMAGE: _types("POST_IMAGE"),
};

export const actions = {
  uploadImage: (payload) => async (dispatch) => {
    const formData = new FormData();
    formData.append("file", payload);
    const api = API_URLS.APP.uploadImage(formData);
    const { response } = await apiCall(api);

    if (
      response?.status === 200 &&
      response.data &&
      response.data.code === 200
    ) {
      const status = response.data.message.status;
      if (status === "success") {
        const data = response.data.data;
        return { data };
      } else {
        return { data: null };
      }
    } else {
      return { data: null };
    }
  },
};

const initialState = {
  isFetching: false,
};

export const reducer = produce((draft, action) => {
  switch (action.type) {
    default:
  }
}, initialState);
