import React, { Component } from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./css/login.module.css";
import { useNavigate } from "react-router";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const userWindow = (props) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
    isLoading: true,
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {},
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("inside user window page");
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&censor=false&key=AIzaSyA_V0YS8V5swLhCrKNVqUbLFh1vjXCBJ4c`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(this);
          setUserInfo({
            ...userInfo,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: data.results[0].formatted_address,
            isLoading: false,
          });
        })
        .catch((error) => alert(error));
      // console.log(this.state);
    });
  });

  const onMarkerClick = (props, marker, e) => {
    // console.log(props);
    // console.log(marker);
    // console.log(e);
    setUserInfo({
      ...userInfo,
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  const onClose = (props) => {
    if (this.state.showingInfoWindow) {
      setUserInfo({
        ...userInfo,
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  return (
    <div>
      {userInfo.isLoading ? (
        <div class={styles.loader}></div>
      ) : (
        <div className={styles.userLocPage}>
          <div>
            <div className={styles.header}>User's Current Location </div>
            <Map
              google={props.google}
              zoom={14}
              style={{ width: "100%", height: "100%" }}
              initialCenter={{
                lat: userInfo.latitude,
                lng: userInfo.longitude,
              }}
            >
              <Marker onClick={onMarkerClick} name={"Current Location"} />
              <InfoWindow
                marker={userInfo.activeMarker}
                visible={userInfo.showingInfoWindow}
                onClose={onClose}
              >
                <div className={styles.infoDetails}>
                  <h4>{userInfo.address}</h4>
                </div>
              </InfoWindow>
            </Map>
          </div>
          <button className={styles.parkingButton}>
            <span>
            <Link to={`/showLocations`}>Show Parking Spots</Link>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
// export default UserWindow;
export default GoogleApiWrapper({
  apiKey: "AIzaSyA_V0YS8V5swLhCrKNVqUbLFh1vjXCBJ4c",
})(userWindow);
