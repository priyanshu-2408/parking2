import React, { Component } from "react";
import parking from "../ethereum/Parking";
// import Link from "next/link";
import { Link } from "react-router-dom";
import Router from "next/router";
import web3 from "../ethereum/web3";
import Parking from "../ethereum/Parking.js";
import { Route, Routes} from "react-router";

const HomePage = () => {
  return (
    <>
      <div className="outer">
        <div className="header">
          <h2>DECENTRALIZED PARKING SYSTEM</h2>
        </div>
        <div className="split left">
          <h1>DRIVER?</h1>
          <Link to="/login/user" className="button">
            Sign In
          </Link>
        </div>
        <div className="split right">
          <h1>OWNER?</h1>
          <Link to="/login/spotOwner" className="button">
            Sign In
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/signIn" element={<Temp />} />
      </Routes>
    </>
  );
};
export default HomePage;
