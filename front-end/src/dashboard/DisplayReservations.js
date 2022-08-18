import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservationStatus } from "../utils/api";
import { formatAsTime, formatAsDate } from "../utils/date-time";

function DisplayReservations({ reservation }) {
  const history = useHistory();

  const [currentReservation, setCurrentReservation] = useState(reservation);
  const [displaySeat, setDisplaySeat] = useState(false);
  const [displayEdit, setDisplayEdit] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentReservation.status === null || currentReservation.status === "booked") {
      setDisplaySeat(true);
    }
    
    if (currentReservation.status === "booked") {
      setDisplayEdit(true);
    }
  }, [currentReservation]);

  const handleSeat = (event) => {
    event.preventDefault();
    setError(null);
    setDisplaySeat(false);
    history.push(`/reservations/${currentReservation.reservation_id}/seat`);
  };

  const handleCancelReservation = (event) => {
    event.preventDefault();
    setError(null);
    const confirmCancel = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
      );
    if (confirmCancel) {
      updateReservationStatus({ status: "cancelled"}, currentReservation.reservation_id)
        .then((response) => {
          setCurrentReservation(response);
          history.go(0);
        })
        .catch(setError);
    }
  }

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
        <p className="card-text font-weight-bold" data-reservation-id-status={currentReservation.reservation_id}>
          Status: {currentReservation.status}
        </p>
        <div className="d-flex justify-content-center mb-2">
          { displaySeat ? (
            <a 
              href={`/reservations/${currentReservation.reservation_id}/seat`}
              className="btn btn-success mr-3"
              onClick={handleSeat}>              
              Seat
            </a>
            ) : (<></>) }
          { displayEdit ? (
            <a 
              href={`/reservations/${currentReservation.reservation_id}/edit`}
              className="btn btn-primary mr-3">
              Edit
            </a>
            ) : (<></>) }
            <button
              data-reservation-id-cancel={currentReservation.reservation_id}
              className="btn btn-danger mr-3"
              onClick={handleCancelReservation}>              
              Cancel
            </button>
        </div>
      </div>
    </div>
  );
}

export default DisplayReservations;