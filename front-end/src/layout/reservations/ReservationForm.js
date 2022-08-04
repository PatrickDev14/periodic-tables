import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ formData, handleChange, handleSubmit }) {
  const history = useHistory();

  return (
    <form onSubmit={handleSubmit}>      
      <div className="form-group mb-3">
        <label htmlFor="first_name" className="form-label">First Name</label>
        <input 
          type="text" 
          className="form-control"
          name="first_name" 
          id="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="last_name" className="form-label">Last Name</label>
        <input 
          type="text" 
          className="form-control"
          name="last_name" 
          id="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="mobile_number" className="form-label">Mobile number</label>
        <input 
          type="tel" 
          className="form-control"
          name="mobile_number" 
          id="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="reservation_date" className="form-label">Reservation date</label>
        <input 
          type="date" 
          className="form-control"
          name="reservation_date" 
          id="reservation_date"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          value={formData.reservation_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="reservation_time" className="form-label">Reservation time</label>
        <input 
          type="time" 
          className="form-control"
          name="reservation_time" 
          id="reservation_time"
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
          value={formData.reservation_time}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="people" className="form-label">Party size</label>
        <input 
          type="number"
          className="form-control"
          name="people" 
          id="people"
          value={formData.people}
          onChange={handleChange}
          required
        />
      </div>
      <button
        className="btn btn-primary btn-lg ml-3"
        type="submit"
      >
        submit
      </button>
      <button
        className="btn btn-secondary btn-lg ml-3"
        type="button"
        onClick={() => history.go(-1)}
      >
        cancel
      </button>
    </form>
  );
}

export default ReservationForm;