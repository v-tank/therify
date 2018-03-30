// @noflow
import React from "react";
import {Provider} from "mobx-react/native";

import {createTheme, Colors} from "./src/components";

import {FoodNavigator} from "./src/food";

import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const rendered = renderer.create((
      <Provider theme={createTheme(Colors.food)}>
          <FoodNavigator />
      </Provider>
  )).toJSON();
  expect(rendered).toBeTruthy();
});
