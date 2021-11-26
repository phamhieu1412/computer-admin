import React from "react";

import { Route, Switch } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Banners from "../pages/Banners";
import Customers from "../pages/Customers";
import Suppliers from "../pages/Suppliers";
import Manufacturers from "../pages/Manufacturers";
import Categories from "../pages/Categories";
import Receipts from "../pages/Receipts";
import Users from "../pages/Users";
import Products from "../pages/Products";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/banners" component={Banners} />
      <Route path="/supplier" component={Suppliers} />
      <Route path="/manufacturers" component={Manufacturers} />
      <Route path="/menu" component={Categories} />
      <Route path="/import" component={Receipts} />
      <Route path="/products" component={Products} />
      <Route path="/staffs" component={Users} />
      <Route path="/customers" component={Customers} />
      <Route path="/orders" component={Customers} />
      <Route path="/inventory" component={Customers} />
      <Route path="/decentralization" component={Customers} />
    </Switch>
  );
};

export default Routes;
