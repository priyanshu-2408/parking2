import React, { Component } from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import web3 from "../../ethereum/web3";
import GoogleMap from "../GoogleMap";
import Parking from "../../ethereum/Parking.js";
import axios from "axios";
import { withRouter } from "next/router";
import styles from "./login.module.css";
import { useNavigate } from "react-router";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

var uid = 1;

const Login = () => {
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useState("");
  const [password, setPassword] = useState("");
  const params = useParams();
  const handleChange = (event) => {
    if (event.target.name === "userAddress") {
      setUserAddress(event.target.value);
      console.log(userAddress);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
      console.log(password);
    }
  };

  // In render function

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HIIIIIIIIIIIIIII");
    const account = await web3.eth.getAccounts();
    console.log(account[0]);
    if (params.person === "user") {
      const registered = await Parking.methods
        .checkAlreadyRegisteredUser()
        .call({
          from: account[0],
        });

      if (!registered) {
        alert("User not registered!!");
        navigate(`/signup/${params.person}`);
        return;
      }

      const passcode = await Parking.methods.getUserCred().call({
        from: account[0],
      });

      if (passcode.localeCompare(password) != 0) {
        alert("Incorrect credentials! try again");
        return;
      } else {
        navigate("/userWindow");
        return;
      }
    } else if (params.person === "spotOwner") {
      const registered = await Parking.methods
        .checkAlreadyRegisteredParkingSpot()
        .call({
          from: account[0],
        });

      if (!registered) {
        alert("The spot is not registered!!");
        navigate(`/signup/${params.person}`);
        return;
      }

      const passcode = await Parking.methods.getSpotOwnerCred().call({
        from: account[0],
      });

      if (passcode.localeCompare(password) != 0) {
        alert("Incorrect credentials! try again");
        return;
      } else {
        alert("Success");
        navigate("/ownerDetails");
        return;
      }
    }
  };

  return (
    <div className={styles.outer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className={styles.input}>
          <div className={styles.inputBox}>
            <label>Username</label>
            <input name="userAddress" type="text" onChange={handleChange} />
          </div>
          <div className={styles.inputBox}>
            <label>Password</label>
            <input name="password" type="password" onChange={handleChange} />
          </div>
          <div className={styles.inputBox}>
            <input type="submit" name="" value="Sign In" />
          </div>
        </div>
        <p className={styles.forgot}>
          Don't have an account{" "}
          <Link to={`/signup/${params.person}`}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;