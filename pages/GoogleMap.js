import { Map, GoogleApiWrapper } from "google-maps-react";

const GoogleMap = (props) => <Map google={props.google} />;

export default GoogleApiWrapper((props) => ({
  apiKey: AIzaSyBUubDA69b60fcLydMGlX67mcSxbZZT1Pg,
}))(GoogleMap);
