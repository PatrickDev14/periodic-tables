import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsTime, formatAsDate } from "../utils/date-time";

function DisplayReservations({ reservation }) {
  const history = useHistory();

  const [currentReservation, setCurrentReservation] = useState(reservation);
  const [displaySeat, setDisplaySeat] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentReservation.status === null || currentReservation.status === "booked") {
      setDisplaySeat(true);
    }
  }, [currentReservation]);

  const handleSeat = (event) => {
    event.preventDefault();
    setError(null);
    setDisplaySeat(false);
    history.push(`/reservations/${currentReservation.reservation_id}/seat`);
  };

  return (   
    <div className="card shadow p-3 mb-5 bg-body rounded">
      <ErrorAlert error={error} />
      <div className="card-body">
        <h4 className="card-title text-center">
          {currentReservation.first_name} {currentReservation.last_name}
        </h4>
        <p className="card-text">{formatAsTime(currentReservation.reservation_time)}</p>
        <p className="card-text">{formatAsDate(currentReservation.reservation_date)}</p>
        <p className="card-text">{currentReservation.mobile_number}</p>
        <p className="card-text">Party of {currentReservation.people}</p>
        <p className="card-text" data-reservation-id-status={currentReservation.reservation_id}>
          Status: {currentReservation.status}
        </p>
        <div className="d-flex justify-content-center mb-2">
          { displaySeat ? (
            <button className="btn btn-success mr-3"
              onClick={handleSeat}>
              <a href={`/reservations/${currentReservation.reservation_id}/seat`}>
                Seat
              </a>
            </button>
            ) : (<></>) }
        </div>
      </div>
    </div>
  );
}

export default DisplayReservations;