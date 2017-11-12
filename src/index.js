import React from "react";
import { render } from "react-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

const colorReducer = (state, action) => state;

const store = createStore(
  colorReducer,
  { brick: { color: "sky" } },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Brick = props => <div className={`brick ${props.color}`} />;

const BrickContainer = connect(
  state => ({
    color: state.brick.color
  }),
  null
)(Brick);

render(
  <Provider store={store}>
    <BrickContainer />
  </Provider>,
  document.getElementById("game")
);
