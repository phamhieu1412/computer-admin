export const PREFIX = {
  AUTH: 'AUTH',
  APP: 'APP',
  SUPPLIERS: 'SUPPLIERS',
  SUPPLIER: 'SUPPLIER',
  PRODUCTS: 'PRODUCTS',
  PRODUCT: 'PRODUCT',
  CATEGORIES: 'CATEGORIES',
  ORDERS: 'ORDERS',
  CHART: 'CHART',
  ACCOUNT: 'ACCOUNT',
  API: 'API',
  STATION: 'STATION',
  STATION_PRODUCT: 'STATION_PRODUCT',
  STATION_ORDER: 'STATION_ORDER',
  PRODUCT_UNIT: 'PRODUCT_UNIT',
  REGION: 'REGION',
  ROLE: 'ROLE',
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF',

  //status API
  API_CALLING: 'API_CALLING',
  API_CALLED_SUCCESS: 'API_CALLED_SUCCESS',
  API_CALLED_FAILURE: 'API_CALLED_FAILURE',

  // bookstore
  BANNER: 'BANNER',
  CATEGORY: 'CATEGORY',
  CART: 'CART',
  AUTHOR: 'AUTHOR',
  MANUFACTURERS: 'MANUFACTURERS',
  RECEIPTS: 'RECEIPTS',
};

export const typesWithPrefix = (prefix) => (key) => `${prefix}_${key}`;
