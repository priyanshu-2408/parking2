import classes from "./bookingDetails.module.css";
import Footer
 from "../Layout/Footer";
const BookingDetails = () => {
  //console.log(data[key]);
    const bookings = {ticketId: "data[key].user.id",
        license: "data[key].user.license",
        place: "data[key].user.place",
        entryTime: "data[key].user.timeSlot[0]",
        exitTime: "data[key].user.timeSlot[1]"};
  return (
    <>
    <h2 className = {classes.heading}>Your Bookings</h2>
      <div className={classes.container}>
        <ul className={classes["responsive-table"]}>
          <li className={classes["table-header"]}>
            <div className={`${classes.col} ${classes["col-1"]}`}>
              Ticket ID
            </div>
            <div className={`${classes.col} ${classes["col-1"]}`}>
              License Plate
            </div>
            <div className={`${classes.col} ${classes["col-1"]}`}>Place</div>
            <div className={`${classes.col} ${classes["col-1"]}`}>
              Entry Time
            </div>
            <div className={`${classes.col} ${classes["col-1"]}`}>
              Exit Time
            </div>
          </li>

          {/* {bookings.map((item, i) => {
            return (
              <li className={classes["table-row"]} key={i}>
                {currentDate > new Date(item.exitTime) && (
                  <div
                    className={`${classes.col} ${classes["col-1"]}`}
                    data-label="Ticket ID"
                  >
                    {item.ticketId}{" "}
                    <span className={classes.expired}>Expired</span>
                  </div>
                )}

                {currentDate <= new Date(item.exitTime) && (
                  <div
                    className={`${classes.col} ${classes["col-1"]}`}
                    data-label="Ticket ID"
                  >
                    {item.ticketId}
                  </div>
                )}

                <div
                  className={`${classes.col} ${classes["col-1"]}`}
                  data-label="License Plate"
                >
                  {item.license}
                </div>
                <div
                  className={`${classes.col} ${classes["col-1"]}`}
                  data-label="Place"
                >
                  {item.place}
                </div>
                <div
                  className={`${classes.col} ${classes["col-1"]}`}
                  data-label="Entry Time"
                >
                  {item.entryTime}
                </div>
                <div
                  className={`${classes.col} ${classes["col-1"]}`}
                  data-label="Exit Time"
                >
                  {item.exitTime}
                </div>
              </li>
            );
          })} */}
        </ul>
      </div>

      {/* <div className={classes.note}>
        <div>
          * There is no need to print anything out! All your bookings are here.
        </div>
        <div>
          * Modern Parking lots are equipped with Automatic License Plate
          Recognition (ALPR).
        </div>
      </div> */}
      <Footer />
    </>
  );
};

export default BookingDetails;
