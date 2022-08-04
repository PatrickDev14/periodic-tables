import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DisplayReservations from "./DisplayReservations";
import useQuery from "../utils/useQuery";
//
import { next, previous, today } from "../utils/date-time";
import { useHistory, useRouteMatch } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const route = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    function updateDate() {
      const queryDate = query.get("date");
      console.log(queryDate);
      if (queryDate) {
        setDate(queryDate);
      } else {
        setDate(today());
      }
    }
    updateDate();
  }, [query, route, setDate]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-flex justify-content-sm-around m-3">
        <button 
          className="btn btn-light btn-lg"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous Day
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-light btn-lg"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next Day
        </button>
      </div>

      <ErrorAlert error={reservationsError} />

      <div className="container">
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for {date}</h4>
        </div>
        <div className="row">
          {reservations &&
            reservations.map((reservation) => (
              <div className="col-md-6 mb-3" key={reservation.reservation_id}>
                <DisplayReservations reservation={reservation} />
              </div>
            ))}
        </div>
      </div>      
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;
