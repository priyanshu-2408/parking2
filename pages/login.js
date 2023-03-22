import React, { Component } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import web3 from "../ethereum/web3";
import GoogleMap from "./GoogleMap";
import Parking from "../ethereum/Parking.js";
import axios from "axios";
import { withRouter } from "next/router";
import styles from "./css/login.module.css";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

var uid = 1;

const Login = ()=> {

  const [userAddress, setUserAddress] = useState("");
  const[password, setPassword] = useState("");
  const params = useParams();
  console.log("hello");
  console.log(params.person);
  const handleChange = (event) => {
    if(event.target.name === "userAddress"){
      setUserAddress(event.target.value);
      console.log(userAddress);
    }
    else if(event.target.name === "password"){
      setPassword(event.target.value);
      console.log(password);
    }
  };

  // In render function

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HIIIIIIIIIIIIIIIIIIII");
    const account = await web3.eth.getAccounts();
    console.log(account[0]);
    if (params.person === "User"){
      
      const registered = await Parking.methods.checkAlreadyRegisteredUser().call({
        from : account[0]
      });

      if(!registered){
        alert("User not registered!!")
        window.location.href = "/signUp?person=User";
        return
      }

      const passcode = await Parking.methods.getUserCred().call({
        from : account[0],
      });

      if(passcode.localeCompare(password)!=0){
        alert("Incorrect credentials! try again")
        return
      }else{
        window.location.href = "/userWindow";
        return
      }

    } else if(params.person === "spotOwner"){
      
      const registered = await Parking.methods.checkAlreadyRegisteredParkingSpot().call({
        from : account[0]
      });

      if(!registered){
        alert("The spot is not registered!!")
        window.location.href = "/signUp?person=spotOwner";
        return
      }

      const passcode = await Parking.methods.getSpotOwnerCred().call({
        from : account[0],
      });

      if(passcode.localeCompare(password)!=0){
        alert("Incorrect credentials! try again")
        return
      }else{
        alert("Success")
        window.location.href = "/";
        return
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
            Don't have an account <Link href={`/signUp?person=${params.person}`}>Sign Up</Link>
          </p>
          {/* <p className={styles.inputBox}>
              {this.props.router.query.person}
          </p> */}
        </form>
      </div>
    );
  
}

export default Login;
