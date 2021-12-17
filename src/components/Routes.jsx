import React from "react";

import { Route, Switch } from "react-router-dom";

import General from "../screens/Manager/General";
import Statistic from "../screens/Manager/Statistic";
import Prediction from "../screens/Manager/Prediction";
import Irregular from "../screens/Manager/Irregular";

import Users from "../screens/Manager/Users";
import Cities from "../screens/Manager/Cities";
import PropertyTypes from "../screens/Manager/PropertyTypes";
import Properties from "../screens/Manager/Properties";
import Rooms from "../screens/Manager/Rooms";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={General} />
      <Route path="/general" component={General} />
      <Route path="/users" component={Users} />
      <Route path="/cities" component={Cities} />
      <Route path="/propertyTypes" component={PropertyTypes} />
      <Route path="/properties" component={Properties} />
      <Route path="/rooms" component={Rooms} />
      <Route path="/statistic" component={Statistic} />
      <Route path="/prediction" component={Prediction} />
      <Route path="/irregular" component={Irregular} />
    </Switch>
  );
};

export default Routes;
