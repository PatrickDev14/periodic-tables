import React from "react";
import { formatAsTime, formatAsDate } from "../utils/date-time";

function DisplayReservations({ reservation }) {

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title text-center">
          {reservation.first_name} {reservation.last_name}
        </h5>
        <p className="card-text">{formatAsTime(reservation.reservation_time)}</p>
        <p className="card-text">{formatAsDate(reservation.reservation_date)}</p>
        <p className="card-text">{reservation.mobile_number}</p>
        <p className="card-text">Party of {reservation.people}</p>
        <div className="row">
          { reservation.status === "booked" &&
            <button className="btn btn-success mr-3">
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                Seat
              </a>
            </button>}
        </div>
      </div>
    </div>
  );
}

export default DisplayReservations;