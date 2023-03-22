import React, { Component } from "react";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'
// import { stat } from "fs-extra";

import web3 from '../ethereum/web3'

import  Parking from '../ethereum/Parking.js'

import { withRouter } from 'next/router'

var uid =1;
    class Signup extends Component {
      constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
      }    
      state = {
        userAddress:'',
        rate:0,
        locAddress:'',
        availableSpots:0,
        password:'',
        carNo:'',
        mobileNumber:'',
        
      }
    handleChange = event => {
      this.setState({[event.target.name]: event.target.value})
    }

    handleSubmit = async e => {
      e.preventDefault();
      console.log(this.state)
      const account = await web3.eth.getAccounts();
        console.log(account[0])
        if (this.props.router.query.person === "User"){
          await Parking.methods.registerNewUser(this.state.carNo,this.state.mobileNumber,"123","123",this.state.password).send({
            from : account[0]
        });
        const tem = await Parking.methods.checkAlreadyRegisteredUser().call({
          from : account[0]
        });
        console.log(tem);
        } else if(this.props.router.query.person === "spotOwner"){
             await Parking.methods.registerNewParkingSpot(this.state.rate,"123","123",this.state.locAddress,this.state.availableSpots,uid,this.state.password).send({
            from : account[0]
        });
        uid = uid +1;
        }
    }
  // console.log()
  render() {
    return (
      <div className="container" id="container">
      <div className="form-container sign-up-container"> 
        <div>{this.props.router.query.person === "spotOwner" ? (
            <div>
              <form onSubmit={ this.handleSubmit }>
                <h1>Create Account</h1>
                <input
                  type="text"
                  name="userAddress"
                  placeholder="User Address"
                  ref="login"
                  onChange = {this.handleChange}
                ></input>
                <input
                  type="number"
                  name="rate"
                  // value={this.state.spotRate} 
                  // onChange={this.handleInputChanged.bind(this)}
                  placeholder="Rate per hour in Rs."
                  onChange = {this.handleChange}
                ></input>
                <input
                  type="text"
                  name="locAddress"
                  // value={this.state.locationAddress} 
                  // onChange={this.handleInputChanged.bind(this)}
                  placeholder="Location Address"
                  onChange = {this.handleChange}
                ></input>
                <input
                  type="number"
                  name="availableSpots"
                  // value={this.state.availableSpots} 
                  // onChange={this.handleInputChanged.bind(this)}
                  placeholder="Available Spots"
                  onChange = {this.handleChange}
                ></input>
                <input
                  type="password"
                  name="password"
                  // value={this.state.spotOwnerPassword} 
                  // onChange={this.handleInputChanged.bind(this)}
                  placeholder="Password"
                  onChange = {this.handleChange}
                ></input>
                <button type ="submit">SignUp</button>
            </form>
          </div>
         ) : (
          <div>
            <form action="" onSubmit={ this.handleSubmit }>
              <h1>Create User account</h1>
              <input
                type="text"
                name="userAddress"
                // value={this.state.driverAddress} 
                // onChange={this.handleInputChanged.bind(this)}
                placeholder="User Address"
                onChange = {this.handleChange}
              ></input>
              <input
              type="text"
              name="carNo"
              // value={this.state.carNo} 
              // onChange={this.handleInputChanged.bind(this)}
              placeholder="Car Number"
              onChange = {this.handleChange}
            ></input>
            <input
              type="text"
              name="mobileNumber"
              // value={this.state.mobNo} 
              // onChange={this.handleInputChanged.bind(this)}
              placeholder="Mobile Number"
              onChange = {this.handleChange}
            ></input>
            <input
              type="password"
              name="password"
              // value={this.state.driverPassword} 
              // onChange={this.handleInputChanged.bind(this)}
              placeholder="Password"
              onChange = {this.handleChange}
            ></input>
            <button>SignUp</button>
            </form>
          </div>
            
          // </form>
          ) }</div>
      </div>

      <div className="form-container sign-in-container">
        <form action="#">
          <h1>Sign In</h1>
          <input
            type="text"
            name="userAddress"
            placeholder="User Address"
          ></input>
          <input
            type="password"
            name="password"
            placeholder="Password"
          ></input>
          <button>Sign In</button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
              </p>
            <button className="ghost" id="signIn">
              Sign In
              </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start journey with us</p>
            <button className="ghost" id="signUp">
              Sign Up
              </button>
          </div>
        </div>
      </div>
      <p>{this.props.router.query.person}vdsvsdfv</p>
    </div>
    )
  }
}

export default withRouter(Signup)

// export default function SignInSignUp() {

//   const state = {
//     spotOwnerAddress: "",
//     // spotRate: "",
//     // locationAddress: "",
//     // availableSpots: "",
//     // spotOwnerPassword: "",
//     // driverAddress: "",
//     // carNo: "",
//     // mobNo: "",
//     // driverPassword: ""
//   };

//   const handleInputChanged = (event)=> {
//     // this.setState({
//     // spotOwnerAddress: event.target.value,
//     // spotRate: event.target.value,
//     // locationAddress: event.target.value,
//     // availableSpots: event.target.value,
//     // spotOwnerPassword: event.target.value,
//     // driverAddress: event.target.value,
//     // carNo: event.target.value,
//     // mobNo: event.target.value,
//     // driverPassword: event.target.value
//     // });
//     state.spotOwnerAddress = event.target.value;
//   }

//   const handleSubmitParkingSpotDetails = ()=> {
//     console.log(state);
//   }

//   // const router = useRouter();
//   // const params = router.query;
//   // if (!params.person) {
//   //   useEffect(() => {
//   //     router.push('/')
//   //   }, [])
//   //   return <h1>Page doesnot exist</h1>
//   // }


// // class SignInSignUp extends Component {
// //   componentDidMount() {
// //     console.log(router.query);
// //     console.log("hellow world")
// //     // console.log(queryString.parse(this.props));
// //   }

// // render() {
// //   
// // };
// // }

// // export default SignInSignUp;