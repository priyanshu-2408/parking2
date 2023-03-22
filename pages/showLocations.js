import React, { Component } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import web3 from "../ethereum/web3";
import Parking from "../ethereum/Parking.js";
import { withRouter } from "next/router";
import styles from "./css/userLocation.module.css";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import sha256 from "sha256";

function compareByPrice(a, b) {
  if (a.price < b.price) {
    return -1;
  } else if (a.price > b.price) {
    return 1;
  }
  return 0;
}

function compareByDistance(a, b) {
  if (a.distanceValue < b.distanceValue) {
    return -1;
  } else if (a.distanceValue > b.distanceValue) {
    return 1;
  }
  return 0;
}

export const getStaticProps = async () => {
  // Call an external API endpoint to get posts.
  var len = await Parking.methods.getParkingSpotsCount().call();
  var locations = [];
  var len = await Parking.methods.getParkingSpotsCount().call();

  for (var i = 0; i < len; i++) {
    var loc = await Parking.methods.getLocations(i).call();
    locations.push(loc);
  }

  let parkingSpotsData = [];
  let googleDestinations = [];

  for (var i = 0; i < len; i++) {
    let spotData = {
      owner: locations[i][0],
      price: locations[i][1],
      latitude: locations[i][2][0],
      longitude: locations[i][2][1],
      locationAddress: locations[i][3],
      avaiableSpots: locations[i][4],
      spotUID: locations[i][5],
      distance: null,
    };
    googleDestinations.push("" + locations[i][2][0] + "," + locations[i][2][1]);
    parkingSpotsData.push(spotData);
  }

  return {
    props: {
      parkingSpotsData,
      googleDestinations,
    },
  };
};

class UserWindow extends Component {
  state = {
    latitude: 0,
    longitude: 0,
    address: "",
    isLoading: true,
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {},
    distanceDetails: [],
    loadedAdresses: false,
    booking: false,
  };

  constructor(props) {
    super(props);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&censor=false&key=AIzaSyA50KK3_YkxIwvDfiU58RXo6lVksvQprD8`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(this);
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: data.results[0].formatted_address,
            isLoading: false,
          });
        })
        .catch((error) => alert(error));
      var origin = new this.props.google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: this.props.googleDestinations,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (res) => {
          if (res == null) {
            alert("No parking spot available!!");
            window.location.href = "/";
            return;
          }
          var updatedSpotDetails = [];
          for (var i = 0; i < res.rows[0].elements.length; i++) {
            let spotData = {
              owner: this.props.parkingSpotsData[i].owner,
              price: this.props.parkingSpotsData[i].price,
              locationAddress: this.props.parkingSpotsData[i].locationAddress,
              avaiableSpots: this.props.parkingSpotsData[i].avaiableSpots,
              spotUID: this.props.parkingSpotsData[i].spotUID,
              distanceValue: res.rows[0].elements[i].distance.value,
              distanceText: res.rows[0].elements[i].distance.text,
            };
            updatedSpotDetails.push(spotData);
          }
          this.setState({
            distanceDetails: updatedSpotDetails,
            loadedAdresses: true,
          });
        }
      );

      // console.log(this.state);
    });
  }
  PriceSort = () => {
    var temp = this.state.distanceDetails;
    temp.sort(compareByPrice);

    this.setState({
      distanceDetails: temp,
    });
  };

  DistanceSort = () => {
    var temp = this.state.distanceDetails;
    temp.sort(compareByDistance);

    this.setState({
      distanceDetails: temp,
    });
  };

  handlesort = async (spotid) => {
    console.log("spotid is:", spotid);

    const account = await web3.eth.getAccounts();
    console.log("Booking from account: ", account[0]);

    const registered = await Parking.methods.checkAlreadyRegisteredUser().call({
      from: account[0],
    });
    if (!registered) {
      alert("User not registered");
      window.location.href = "/SignInSignUp?person=User";
    }
    await Parking.methods.bookParkingSpot(spotid, 1).send({
      //time --------------------------- time ---?
      from: account[0]
    });

    alert("Booking complete");
    window.location.href = "/";
  };

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div class={styles.loader}></div>
        ) : (
          <div>
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
                        style={{
                          alignContent: "center",
                          marginLeft: -20 + "%",
                        }}
                        onClick={() => this.PriceSort()}
                      >
                        Filter by Price
                      </button>
                    </div>
                    <div className="col-sm-6">
                      <button
                        type="button"
                        className={`btn btn-secondary btn-lg ${styles.pos}`}
                        style={{
                          background: "blueviolet",
                          marginLeft: 40 + "%",
                        }}
                        onClick={() => this.DistanceSort()}
                      >
                        Filter by Distance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.state.distanceDetails.map((data) => {
              return (
                // <div className="card text-center" style={{ width: 18 + "rem" }}>
                //   <div className="card-body" style={{ width: 18 + "rem" }}>
                //     <h5 className="card-title">
                //       Location: {data.locationAddress}
                //     </h5>
                //     <h5>Distance: {data.distanceText}</h5>
                //     <h5>Price: {data.price}</h5>
                //     <button
                //       className="btn btn-primary"
                //       value={data.spotUID}
                //       onClick={() => this.handlesort(data.spotUID)}
                //     >
                //       Book Parking Spot
                //     </button>
                //   </div>
                // </div>
                <div class="col-sm-12 ">
                  <div class="card" style={{ height: "auto" }}>
                    <div class="card-body">
                      <div class="container">
                        <h3>{data.locationAddress}</h3>
                        <div class="row">
                          <div class="col-sm-6" style={{ textAlign: "left" }}>
                            <h3>Distance: {data.distanceText}</h3>
                          </div>
                          <div class="col-sm-6" style={{ textAlign: "left" }}>
                            <h3>Price: {data.price}</h3>
                          </div>
                        </div>
                        <button
                          className="btn btn-primary"
                          value={data.spotUID}
                          onClick={() => this.handlesort(data.spotUID)}
                        >
                          Book Parking Spot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
// export default UserWindow;
export default GoogleApiWrapper({
  apiKey: "AIzaSyBUubDA69b60fcLydMGlX67mcSxbZZT1Pg",
})(UserWindow);
