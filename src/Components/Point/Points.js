import React, { useContext, useEffect, useState } from "react";
import "./Points.css";
import { CartContext } from "../Context/Context";

const Points = () => {
  const { currentPoints , totalPoints, prevPoints} = useContext(CartContext);
  return (
    <div>
      <table className="points-table">  
        <thead>
          <tr className="text-white">
            <th>Previous Points</th>
            <th>Current Points</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-white" style={{backgroundColor : "black"}}>
            <td>{prevPoints}</td>
            <td>{currentPoints}</td>
            <td>{totalPoints}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Points;
