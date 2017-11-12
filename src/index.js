import React from "react";
import { render } from "react-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";

import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import "rxjs/add/operator/repeat";

const colorReducer = (state, action) => {
  if (action.type === "COLOR_CHANGED") {
    return Object.assign({}, state, { brick: { color: action.color } });
  }
  return state;
};

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

const colors = ["salmon", "sky", "yellow", "green"];

const actions$ = Observable.interval(1000)
  .take(colors.length)
  .map(index => colors[index])
  .map(color => ({ type: "COLOR_CHANGED", color }));

actions$.repeat(1000).subscribe(action => store.dispatch(action));
