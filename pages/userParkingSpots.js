import React, { Component } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import web3 from "../ethereum/web3";
import Parking from "../ethereum/Parking.js";
import { withRouter } from "next/router";
import $ from "jquery";
import styles from "./css/userLocation.module.css";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import { height, position } from "dom-helpers";
// import LoadingScreen from "./loading";
// import { stat } from "fs-extra";
// import Geocoder from "react-native-geocoding";
// import Geolocation from "react-native-geolocation-service";
const userData = [
  {
    locationAddress: "Pec, Chandigarh",
    distance: "5km",
    price: "Rs25 per hour",
  },
  {
    locationAddress: "Pec, Chandigarh",
    distance: "5km",
    price: "Rs25 per hour",
  },
  {
    locationAddress: "Pec, Chandigarh",
    distance: "5km",
    price: "Rs25 per hour",
  },
];
const users = userData.map((data) => {
  return (
    <div class="col-sm-12 ">
      <div class="card" style={{ height: "auto" }}>
        <div class="card-body">
          <div class="container">
            <h3>{data.locationAddress}</h3>
            <div class="row">
              <div class="col-sm-6" style={{ textAlign: "left" }}>
                <h3>Distance: {data.distance}</h3>
              </div>
              <div class="col-sm-6" style={{ textAlign: "left" }}>
                <h3>Price: {data.price}</h3>
              </div>
            </div>
            <a href="#" class="btn btn-primary" style={{ padding: 10 + "px" }}>
              Book Parking Spot
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

class UserWindow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.bodycontainer}>
        <div className={styles.header}>
          <div className={styles.result_heading}>Results</div>
          <div className="container upper_padding">
            <div className="row upper_padding">
              <div
                className={`col-sm-6 ${styles.btnPosition}`}
                style={{ alignContent: "center" }}
              >
                <button
                  type="button"
                  className={`btn btn-primary btn-lg ${styles.pos}`}
                  style={{ alignContent: "center", marginLeft: -20 + "%" }}
                >
                  Filter by Price
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  type="button"
                  className={`btn btn-secondary btn-lg ${styles.pos}`}
                  style={{ background: "blueviolet", marginLeft: 40 + "%" }}
                >
                  Filter by Distance
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.main_row}>{users}</div>
      </div>
    );
  }
}

export default UserWindow;
