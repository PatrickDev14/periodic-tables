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
          style={{ width: "100%" }}
          value={formData.first_name ? formData.first_name : ""}
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
          style={{ width: "100%" }}
          value={formData.last_name ? formData.last_name : ""}
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
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          placeholder="xxx-xxx-xxxx"
          style={{ width: "100%" }}
          value={formData.mobile_number ? formData.mobile_number : ""}
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
          style={{ width: "100%" }}
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          value={formData.reservation_date ? formData.reservation_date : ""}
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
          style={{ width: "100%" }}
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
          value={formData.reservation_time ? formData.reservation_time : ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="people" className="form-label">Party size (choose 1 or more)</label>
        <input 
          type="number"
          className="form-control"
          name="people" 
          id="people"
          style={{ width: "100%" }}
          value={formData.people ? formData.people : ""}
          onChange={handleChange}
          required
        />
      </div>
      <button
        className="btn btn-success btn-lg ml-3"
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