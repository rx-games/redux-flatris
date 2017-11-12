import React from "react";
import { render } from 'react-dom';

const Brick = props => <div className="brick" />;

render(<Brick />, document.getElementById("game"));
