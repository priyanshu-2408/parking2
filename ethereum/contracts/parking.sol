pragma solidity >=0.4.26 <0.9.0;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: UNLICENSED
contract ParkingDApp {
    
    struct LocationCoordinates{
        string lattitude;
        string longitude;
    }
        
    struct ParkingSpot{
        address owner;
        uint ratePerHour;
        LocationCoordinates coordinates;
        string locationAddress;
        uint availabileSpots;
        string parkingSpotUniqueId;
        string password;
        bool isAvailable;
    }
    
    struct User{
        address driver;
        string carNo;
        string mobileNo;
        LocationCoordinates liveLocation;
        string password;
    }
    
    uint radiusForNearbySpots;
    // uint id_no =1;
    constructor() {
        radiusForNearbySpots = 10;
    }
    
    //mappings
    mapping(address=>string) parkingSpotOwnerUIDMapping;
    mapping(string=>ParkingSpot) parkingSpotsList;
    mapping(address=>User) UsersList;
    mapping(string=>mapping(uint=>mapping(address=>bool))) bookingLedger;
    
    // array
    string [] parkingSpotUIDList;
    
    modifier onlyRegisteredUser(){
        require(UsersList[msg.sender].driver == msg.sender);
        _;
    }
    
    modifier onlyParkingSpotOwner(){
        require(parkingSpotsList[parkingSpotOwnerUIDMapping[msg.sender]].owner == msg.sender);
        _;
    }
    
    function registerNewParkingSpot(uint cost, string memory lat, string memory long, 
    string memory locAddress, uint count, string memory UIDNo, string memory pass) public {
        ParkingSpot memory newSpot = ParkingSpot({
            owner:msg.sender,
            ratePerHour:cost,
            coordinates:LocationCoordinates({
                lattitude:lat,
                longitude:long
            }),
            locationAddress:locAddress,
            availabileSpots:count,
            parkingSpotUniqueId:UIDNo,
            password:pass,
            isAvailable: true
        });
        parkingSpotOwnerUIDMapping[msg.sender] = UIDNo;
        parkingSpotsList[UIDNo] = newSpot;
        parkingSpotUIDList.push(UIDNo);
    }
    
    function registerNewUser(string memory carNumber, string memory mobile, string memory lat, string memory long, string memory pass) public {
        User memory newUser = User({
            driver: msg.sender,
            carNo: carNumber,
            mobileNo: mobile,
            liveLocation: LocationCoordinates({
                lattitude:lat,
                longitude:long
            }),
            password:pass
        });
        UsersList[msg.sender] = newUser;
    }
    
    function bookParkingSpot(string memory ParkingId, uint time) public onlyRegisteredUser {
        if(parkingSpotsList[ParkingId].availabileSpots>0){
            parkingSpotsList[ParkingId].availabileSpots--;
            bookingLedger[ParkingId][time][msg.sender] = true;
        }
    }
    
    function endBooking(string memory ParkingId,uint time) public onlyRegisteredUser {
        parkingSpotsList[ParkingId].availabileSpots++;
        delete bookingLedger[ParkingId][time][msg.sender];
    }
    
    function checkAlreadyRegisteredParkingSpot() public view returns(bool){
        if (bytes(parkingSpotOwnerUIDMapping[msg.sender]).length>0) {
            return true;
        }
        return false;
    }

    function getSpotOwnerCred() public view returns(string memory) {
        string memory spot_id = parkingSpotOwnerUIDMapping[msg.sender];
        return parkingSpotsList[spot_id].password;
    }
    
    function checkAlreadyRegisteredUser() public view returns(bool){
        if (bytes(UsersList[msg.sender].carNo).length>0) {
            return true;
        }
        return false;
    }

    function signInParkingSpot(address owner, string memory password) public view returns(bool) {
        string memory parkingSpotId = parkingSpotOwnerUIDMapping[owner];
        if(bytes(parkingSpotOwnerUIDMapping[msg.sender]).length>0 && keccak256(bytes(parkingSpotsList[parkingSpotId].password)) == keccak256(bytes(password))) {
            return true;
        }
        return false;
    }
    
    function getUserCred() public view returns(string memory) {
        return UsersList[msg.sender].password;
    }

    function UserData() public view returns(string memory) {
        return UsersList[msg.sender].carNo;
    }
    
    function spotData(string memory id) public view returns(string memory) {
        return parkingSpotsList[id].coordinates.lattitude;
    }

    function signInUser(address owner, string memory password) public view returns(bool) {
        if(UsersList[owner].driver == owner && keccak256(bytes(UsersList[owner].password)) == keccak256(bytes(password))) {
            return true;
        }
        return false; 
    }
    
    function getParkingSpotsCount() public view returns (uint) {
        return parkingSpotUIDList.length;
    }
    
    function getLocations(uint idx) public view returns (ParkingSpot memory) {
        string memory UIDNo = parkingSpotUIDList[idx];
        if(parkingSpotsList[UIDNo].isAvailable)
            return parkingSpotsList[UIDNo];
            
        ParkingSpot memory newSpot = ParkingSpot({
            owner:msg.sender,
            ratePerHour:0,
            coordinates:LocationCoordinates({
                lattitude:"lat",
                longitude:"long"
            }),
            locationAddress:"locAddress",
            availabileSpots:0,
            parkingSpotUniqueId:"",
            password:"pass",
            isAvailable: true
        });
        return newSpot;
    }
    
    function deleteParkingSpot() public {
        parkingSpotsList[parkingSpotOwnerUIDMapping[msg.sender]].isAvailable = false;
    }
    
    // function getParkingSize() public view returns(uint) {
    //   return parkingList.length;
    // }
    
}