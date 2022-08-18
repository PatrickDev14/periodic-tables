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
    reservation.people = Number(reservation.people);

    createReservation(reservation)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setError);    
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <h2 className="d-flex my-3 justify-content-center">
        Enter a reservation
      </h2>
      <div>
        <ReservationForm 
          formData={formData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
        />    
      </div>
    </div>
    
  )
}

export default NewReservation;