import React, { useEffect, useState } from "react";
import DisplayReservations from "../../dashboard/DisplayReservations";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function Search() {
  const [reservations, setReservations] = useState(null);
  const [mobile_number, setMobile_number] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setError);

      return () => abortController.abort();
  }

  useEffect(() => {
    if (reservations && reservations.length === 0) {
      setNotFound(true);
    }
  }, [reservations]);

  return (
    <>
      <div>
        {notFound && (
          <div className="alert alert-danger m-2">No reservations found</div>
        )}
      </div>
      <h2 className="d-flex my-3 justify-content-center">
          Search reservations
      </h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSearchSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="Search reservations" className="form-label">Enter a mobile number</label>
          <input 
            type="text" 
            className="form-control"
            name="mobile_number" 
            id="mobile_number"
            placeholder="Enter a customer's phone number"
            value={mobile_number}
            onChange={(event) => setMobile_number(event.target.value)}
            required
          />
        </div>
        <button
          className="btn btn-success btn-lg m-2"
          type="submit"
        >
          Find
        </button>
      </form>
      <div className="row">
        {reservations &&
          reservations.map((reservation) => (
            <div className="col-md-4 mb-3" key={reservation.reservation_id}>
              <DisplayReservations reservation={reservation} />
            </div>
          ))}
      </div>
    </>
  )
}

export default Search;