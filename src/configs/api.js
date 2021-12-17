export const url = "http://30c8-210-245-54-40.ngrok.io/api/";

export const HEADERS = {
  default_header: () => ({
    "Content-Type": "application/json",
  }),
  DEFAULT_HEADER: () => ({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  }),
  header: () => ({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Authorization: localStorage.getItem("token"),
  }),
  json_header: () => ({
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: localStorage.getItem("token"),
  }),
  auth_header: () => ({
    Authorization: localStorage.getItem("token"),
  }),
  file_header: () => ({
    "Content-Type": "multipart/form-data",
  }),
};

export const API_URLS = {
  USER: {
    login: (payload) => ({
      endPoint: `${url}auth/login`,
      method: "POST",
      headers: HEADERS.default_header(),
      payload,
    }),
    createUser: (payload) => ({
      endPoint: `${url}/api/v1/manage/users`,
      method: "POST",
      headers: HEADERS.auth_header(),
      payload,
    }),
    forgotPassword: (payload) => ({
      endPoint: `${url}/api/v1/manage/users/password/forgot`,
      method: "POST",
      headers: HEADERS.auth_header(),
      payload,
    }),
    getUsers: (params) => ({
      endPoint: `${url}/api/v1/manage/users`,
      method: "GET",
      headers: HEADERS.auth_header(),
      params,
    }),
    editUser: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/users/${id}`,
      method: "PUT",
      headers: HEADERS.auth_header(),
      payload,
    }),
    deleteUser: (id) => ({
      endPoint: `${url}/api/v1/manage/users/${id}`,
      method: "DELETE",
      headers: HEADERS.auth_header(),
    }),
    getUserInfo: () => ({
      endPoint: `${url}/api/v1/users/profile`,
      method: "GET",
      headers: HEADERS.auth_header(),
    }),
  },
  CUSTOMER: {
    getCustomers: (params) => ({
      endPoint: `${url}/api/v1/manage/customers`,
      method: "GET",
      headers: HEADERS.auth_header(),
      params,
    }),
    getDetailCustomer: (id) => ({
      endPoint: `${url}/api/v1/manage/customers/${id}`,
      method: "GET",
      headers: HEADERS.auth_header(),
    }),
    deleteCustomer: (id) => ({
      endPoint: `${url}/api/v1/manage/customers/${id}`,
      method: "DELETE",
      headers: HEADERS.auth_header(),
    }),
  },
  APP: {
    uploadImage: (payload) => ({
      endPoint: `${url}/api/v1/upload`,
      method: "POST",
      headers: HEADERS.json_header(),
      payload,
    }),
  },
  BANNER: {
    createBanner: (payload) => ({
      endPoint: `${url}/api/v1/manage/banners`,
      method: "POST",
      headers: HEADERS.json_header(),
      payload,
    }),
    updateBanner: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/banners/${id}`,
      method: "PUT",
      headers: HEADERS.json_header(),
      payload,
    }),
    getBanners: () => ({
      endPoint: `${url}/api/v1/manage/banners`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    getDetailBanner: (id) => ({
      endPoint: `${url}/api/v1/manage/banners/${id}`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    deleteBanner: (id) => ({
      endPoint: `${url}/api/v1/manage/banners/${id}`,
      method: "DELETE",
      headers: HEADERS.json_header(),
    }),
  },
  SUPPLIER: {
    createSupplier: (payload) => ({
      endPoint: `${url}/api/v1/manage/suppliers`,
      method: "POST",
      headers: HEADERS.json_header(),
      payload,
    }),
    updateSupplier: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/suppliers/${id}`,
      method: "PUT",
      headers: HEADERS.json_header(),
      payload,
    }),
    getSuppliers: () => ({
      endPoint: `${url}/api/v1/manage/suppliers`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    getDetailSupplier: (id) => ({
      endPoint: `${url}/api/v1/manage/suppliers/${id}`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    deleteSupplier: (id) => ({
      endPoint: `${url}/api/v1/manage/suppliers/${id}`,
      method: "DELETE",
      headers: HEADERS.json_header(),
    }),
  },
  MANUFACTURERS: {
    createManufacturer: (payload) => ({
      endPoint: `${url}/api/v1/manage/manufacturers`,
      method: "POST",
      headers: HEADERS.json_header(),
      payload,
    }),
    updateManufacturer: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/manufacturers/${id}`,
      method: "PUT",
      headers: HEADERS.json_header(),
      payload,
    }),
    getManufacturers: () => ({
      endPoint: `${url}/api/v1/manage/manufacturers`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    getDetailManufacturer: (id) => ({
      endPoint: `${url}/api/v1/manage/manufacturers/${id}`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    deleteManufacturer: (id) => ({
      endPoint: `${url}/api/v1/manage/manufacturers/${id}`,
      method: "DELETE",
      headers: HEADERS.json_header(),
    }),
  },
  CATEGORIES: {
    createCategory: (payload) => ({
      endPoint: `${url}/api/v1/manage/categories`,
      method: "POST",
      headers: HEADERS.json_header(),
      payload,
    }),
    updateCategory: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/categories/${id}`,
      method: "PUT",
      headers: HEADERS.json_header(),
      payload,
    }),
    getCategories: () => ({
      endPoint: `${url}/api/v1/manage/categories`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    getDetailCategory: (id) => ({
      endPoint: `${url}/api/v1/manage/categories/${id}`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    deleteCategory: (id) => ({
      endPoint: `${url}/api/v1/manage/categories/${id}`,
      method: "DELETE",
      headers: HEADERS.json_header(),
    }),
  },
  RECEIPTS: {
    createReceipt: (payload) => ({
      endPoint: `${url}/api/v1/manage/receipts`,
      method: "POST",
      headers: HEADERS.json_header(),
      payload,
    }),
    getReceipts: () => ({
      endPoint: `${url}/api/v1/manage/receipts`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
    getDetailReceipt: (id) => ({
      endPoint: `${url}/api/v1/manage/receipts/${id}`,
      method: "GET",
      headers: HEADERS.json_header(),
    }),
  },
  PRODUCTS: {
    createProduct: (payload) => ({
      endPoint: `${url}/api/v1/manage/products`,
      method: "POST",
      headers: HEADERS.auth_header(),
      payload,
    }),
    updateProduct: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/products/${id}`,
      method: "PUT",
      headers: HEADERS.auth_header(),
      payload,
    }),
    getProducts: (payload) => ({
      endPoint: `${url}/api/v1/manage/products/search`,
      method: "POST",
      headers: HEADERS.auth_header(),
      payload,
    }),
    getDetailProduct: (id) => ({
      endPoint: `${url}/api/v1/manage/products/${id}`,
      method: "GET",
      headers: HEADERS.auth_header(),
    }),
    deleteProduct: (id) => ({
      endPoint: `${url}/api/v1/manage/products/${id}`,
      method: "DELETE",
      headers: HEADERS.auth_header(),
    }),
    getProductsOutOfStock: (payload) => ({
      endPoint: `${url}/api/v1/manage/products/outOfStock`,
      method: "GET",
      headers: HEADERS.auth_header(),
      payload,
    }),
    getReportProducts: (params) => ({
      endPoint: `${url}/api/v1/manage/products/report`,
      method: "GET",
      headers: HEADERS.auth_header(),
      params,
    }),
    exportExcel: () => ({
      endPoint: `${url}/api/v1/manage/products/report/download`,
      method: "GET",
      headers: HEADERS.auth_header(),
    }),
  },
  ORDERS: {
    getOrders: (params) => ({
      endPoint: `${url}/api/v1/manage/orders`,
      method: "GET",
      headers: HEADERS.auth_header(),
      params,
    }),
    getDetailOrder: (id) => ({
      endPoint: `${url}/api/v1/manage/orders/${id}`,
      method: "GET",
      headers: HEADERS.auth_header(),
    }),
    updateStatus: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/orders/${id}`,
      method: "PUT",
      headers: HEADERS.auth_header(),
      payload,
    }),
    cancelOrder: (id, payload) => ({
      endPoint: `${url}/api/v1/manage/orders/${id}`,
      method: "PUT",
      headers: HEADERS.auth_header(),
      payload,
    }),
  },
};
