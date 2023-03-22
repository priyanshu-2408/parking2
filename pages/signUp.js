import React, { Component } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from "react";
import sha256 from "sha256";
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
import { useState } from "react";
var uid = 1;

var current_latitude, current_longitude;

const Signup = ()=>{
  const [userInfo, setUserInfo] = useState({
    userAddress: "",
    rate: 0,
    locAddress: "",
    availableSpots: 0,
    password: "",
    carNo: "",
    mobileNumber: "",
    lat: "",
    lon: "",
    locations: [],
    isloading: false,
    latitude: "",
    longitude: "",
  });

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(function (position) {
      current_latitude = position.coords.latitude.toString();
      current_longitude = position.coords.longitude.toString();
    });
  });

  handleAutoCompleteChange = (address) => {
    setUserInfo((prevState)=>({
      ...prevState,
      locAddress: address
    }))
  };

  handleSelect = (address) => {
    setUserInfo((prevState)=>({
      ...prevState,
      locAddress: address
    }))
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({
          lat: latLng.lat.toString(),
          lon: latLng.lng.toString(),
        });
        console.log(this.state);
      })
      .catch((error) => console.error("Error", error));
  };


  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    //intial fetch
    this.state.locations = [];

    var len = await Parking.methods.getParkingSpotsCount().call();

    for (var i = 0; i < len; i++) {
      var loc = await Parking.methods.getLocations(i).call();
      this.state.locations.push(loc);
    }

    const account = await web3.eth.getAccounts();
    console.log(account);
    console.log(account[0]);
    if (this.props.router.query.person === "User") {
      const tem = await Parking.methods.checkAlreadyRegisteredUser().call({
        from: account[0],
      });
      if (tem) {
        alert("User already registered!!");
        window.location.href = "/login?person=User";
        return;
      }
      this.state.lat = lati;
      this.state.lon = longi;
      console.log(this.state);
      console.log(this.state.locations);
      await Parking.methods
        .registerNewUser(
          this.state.carNo,
          this.state.mobileNumber,
          this.state.lat,
          this.state.lon,
          this.state.password
        )
        .send({
          from: account[0]
        });
      alert("Registered Successfully");
      window.location.href = "/userWindow";
    } else if (this.props.router.query.person === "spotOwner") {
      const already_registered = await Parking.methods
        .checkAlreadyRegisteredParkingSpot()
        .call({
          from: account[0],
        });
      if (already_registered) {
        alert("A parking spot is already registered with your account!!");
        window.location.href = "/";
        return;
      }
      const hash = sha256(account[0] + this.state.password);
      console.log(hash);
      await Parking.methods
        .registerNewParkingSpot(
          this.state.rate,
          this.state.lat,
          this.state.lon,
          this.state.locAddress,
          this.state.availableSpots,
          hash,
          this.state.password
        )
        .send({
          from: account[0]
        });

      //final fetch
      var len = await Parking.methods.getParkingSpotsCount().call();

      var loc = await Parking.methods.getLocations(len - 1).call();
      this.state.locations.push(loc);
      console.log(this.state.locations);
      alert("Registered Spot Successfully");
      window.location.href = "/";
    }
  };
  // console.log()
  console.log("hiiiii");
  render(){
    return (
      <div className={styles.outer}>
        {this.props.router.query.person === "spotOwner" ? (
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <h2>Sign Up</h2>
            <div className={styles.input}>
              <div className={styles.inputBox}>
                <label for="userAddress">User Address</label>
                <input
                  type="text"
                  name="userAddress"
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className={styles.inputBox}>
                <label for="rate">Rate</label>
                <input
                  type="number"
                  name="rate"
                  onChange={this.handleChange}
                ></input>
              </div>
              <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleAutoCompleteChange}
                onSelect={this.handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div className={styles.inputBox}>
                    <label for="locAddress">Location Address</label>
                    <input
                      type="text"
                      name="locAddress"
                      onChange={this.handleChange}
                      {...getInputProps({
                        name: "locAddress",
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? {
                              backgroundColor: "#fafafa",
                              cursor: "pointer",
                            }
                          : {
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                            };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
              ;
              <div className={styles.inputBox}>
                <label for="availableSpots">Available Spots</label>
                <input
                  type="number"
                  name="availableSpots"
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className={styles.inputBox}>
                <label for="password">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className={styles.inputBox}>
                <input
                  type="submit"
                  name="submit"
                  value="Sign Up"
                  onChange={this.handleChange}
                ></input>
              </div>
            </div>
          </form>
        ) : (
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <h2>Sign Up</h2>
            <div className={styles.input}>
              <div className={styles.inputBox}>
                <label for="userAddress">User Address</label>
                <input
                  type="text"
                  name="userAddress"
                  onChange={this.handleChange}
                ></input>
              </div>

              <div className={styles.inputBox}>
                <label for="carNo">Car Number</label>
                <input
                  type="text"
                  name="carNo"
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className={styles.inputBox}>
                <label for="mobileNo"> Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className={styles.inputBox}>
                <label for="password">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                ></input>
              </div>

              <div className={styles.inputBox}>
                <input
                  type="submit"
                  name="submit"
                  value="Sign Up"
                  onChange={this.handleChange}
                ></input>
              </div>
            </div>
          </form>
        )}
      </div>
    )
  }
}

  console.log("hi2");

export default withRouter(
  GoogleApiWrapper({
    apiKey: "AIzaSyBUubDA69b60fcLydMGlX67mcSxbZZT1Pg",
  })(Signup)
);
