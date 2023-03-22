import web3 from "./web3";
import ParkingDApp from "./build/ParkingDApp.json";

const instance = new web3.eth.Contract(
  JSON.parse(ParkingDApp.interface),
  "0xAad08f76E1618a708aAbF1b6f61CF615BeF8b120" //address of deployed contract  ------------------------------>>
);

export default instance;
