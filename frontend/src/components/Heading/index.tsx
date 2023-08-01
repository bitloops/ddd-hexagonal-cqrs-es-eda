import React from 'react';

import logo from '../../assets/bitloops_175x40_transparent.png';
import './Heading.css';

function Heading() {
  return (
    <div className="heading">
      <img src={logo} alt="Bitloops" className="logo" />
      <h1 className="title">To Do</h1>
    </div>
  );
}

export default Heading;
