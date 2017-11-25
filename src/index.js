import React from "react";
import {
  render
} from "react-dom";

import {
  createStore, combineReducers
} from "redux";
import {
  Provider,
  connect
} from "react-redux";

import {
  Observable
} from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/observable/fromEvent";

import "rxjs/add/operator/map";
import "rxjs/add/operator/mapTo";
import "rxjs/add/operator/take";
import "rxjs/add/operator/repeat";
import "rxjs/add/operator/filter";

const boxBoundries = {
  x: {
    max: 50,
    min: -50
  },
  y: {
    max: 20,
    min: -20
  }
}
const isInside = (position, coordinate) => {
  return (position[coordinate] < boxBoundries[coordinate].max) 
      && (position[coordinate] > boxBoundries[coordinate].min);
}
const nextPosition = (currentPosition, coordinate, distance) => {
  const newPosition = Object.assign({}, 
    currentPosition, 
    { [coordinate]: currentPosition[coordinate] + distance });
  return isInside(newPosition, coordinate) ? newPosition : currentPosition;
}

const brick = (state = {position: {}}, action) => {
  let { x, y} = state.position;
  if(action.type === "COLOR_CHANGED") {
    return Object.assign({}, state, { color: action.color });
  } else if(action.type === "MOVED_RIGHT" ){
    return Object.assign({}, state, { position: nextPosition(state.position, 'x', 1) });
  } else if(action.type === "MOVED_LEFT"){
    return Object.assign({}, state, { position: nextPosition(state.position, 'x', -1) });
  } else if(action.type === "MOVED_DOWN"){
    return Object.assign({}, state, { position: nextPosition(state.position, 'y', 1) });
  } else if(action.type === "MOVED_UP"){
    return Object.assign({}, state, { position: nextPosition(state.position, 'y', -1) });
  }
  return state;
}

const store = createStore(
  combineReducers({ brick }), {
    brick: {
      color: "sky",
      position: {
        x: 0,
        y: 0
      }
    }
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const Brick = props => < div className = {
  `brick ${props.color}`
} style= { { 
  left: `calc(50% + ${props.position.x * 10}px)`,
  top: `calc(50% + ${props.position.y * 10}px)`
}}
/>;

const BrickContainer = connect(
  state => ({
    color: state.brick.color,
    position: state.brick.position
  }),
  null
)(Brick);

render( <Provider store = {store}  >
  <BrickContainer / >
  </Provider>,
  document.getElementById("game")
);

const colors = ["salmon", "sky", "yellow", "green"];

const actions$ = Observable.interval(1000)
  .take(colors.length)
  .map(index => colors[index])
  .map(color => ({
    type: "COLOR_CHANGED",
    color
  }));

actions$.repeat(1000).subscribe(action => store.dispatch(action));

const moves$ = Observable
  .fromEvent(document, 'keydown')
  .map(event => {
    switch(event.keyCode) {
      case 37:
        return 'LEFT';
        break;
      case 38:
        return 'UP';
        break;
      case 39:
        return 'RIGHT';
        break;
      case 40:
        return 'DOWN';
        break;
      default:
        return 'UNKNOWN';
    }
  });

const moveToCoordinate = {
  LEFT: {
    coordinate: 'x',
    distance: -1
  },
  RIGHT: {
    coordinate: 'x',
    distance: 1
  },
  UP: {
    coordinate: 'y',
    distance: -1
  },
  DOWN: {
    coordinate: 'y',
    distance: 1
  }
}

moves$.filter(move => {
  const current_position = store.getState().brick.position;
  const next_position = Object.assign({}, current_position, {
    [moveToCoordinate[move]['coordinate']]: current_position[moveToCoordinate[move]['coordinate']] + moveToCoordinate[move]['distance'],
  });
  console.log(next_position);
  return isInside(next_position, moveToCoordinate[move]['coordinate']); 
}).map(move => ({
  type: 'MOVED_' + move
})).subscribe(action => store.dispatch(action));