import React, { useState } from "react";
import { useHistory} from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../../utils/api";

function NewReservation() {
  const history = useHistory();
  const [error, setError] = useState(null);

  const defaultFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  }

  const [formData, setFormData] = useState(defaultFormData);

    // event and click handlers
  const handleChange = (event) => {
    setFormData((reservation) => ({
      ...reservation,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const reservation = {
      ...formData
    };
    createReservation(reservation)
      .then(() => history.push(`/dashboard/date?=${reservation.reservation_date}`)) // formData instead?
      .catch(setError);    
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <h2 className="d-flex m3 justify-content-center">
        New Reservation Form
      </h2>
      <div>
        <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />    
      </div>
    </div>
    
  )
}

export default NewReservation;