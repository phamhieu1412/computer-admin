import { combineReducers } from "redux";

import ThemeReducer from "./ThemeReducer";
import { reducer as AppReducer } from "../AppRedux";
import { reducer as AuthReducer } from "../AuthReducer";
import { reducer as BannerReducer } from "../BannerReducer";
import { reducer as SupplierReducer } from "../SupplierReducer";
import { reducer as ManufacturerReducer } from "../ManufacturersReducer";
import { reducer as CategoryReducer } from "../CategoriesReducer";
import { reducer as ReceiptReducer } from "../ReceiptsReducer";
import { reducer as UserReducer } from "../UsersReducer";
import { reducer as CustomerReducer } from "../CustomersReducer";
import { reducer as ProductReducer } from "../ProductsReducer";
import { reducer as OrderReducer } from "../OrdersReducer";

const rootReducer = combineReducers({
  ThemeReducer,
  AuthReducer,
  BannerReducer,
  AppReducer,
  SupplierReducer,
  ManufacturerReducer,
  CategoryReducer,
  ReceiptReducer,
  UserReducer,
  CustomerReducer,
  ProductReducer,
  OrderReducer,
});

export default rootReducer;
