import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "./ReservationForm";
import { readReservation, updateReservation } from "../../utils/api";

function EditReservation() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();

  const defaultFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked"
  }

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setFormData)
      .catch(setError);

    return () => abortController.abort();
  }

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
    const updatedReservation = {
      ...formData
    };
    updatedReservation.people = Number(updatedReservation.people);

    updateReservation(updatedReservation, reservation_id)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setError);
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <h2 className="d-flex my-3 justify-content-center">
        Edit the reservation
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

  export default EditReservation;