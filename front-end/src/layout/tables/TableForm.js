import React from "react";
import { useHistory } from "react-router-dom";

function TableForm({ formData, handleChange, handleSubmit }) {
  const history = useHistory();

  return (
    <form onSubmit={handleSubmit}>      
      <div className="form-group mb-3">
        <label htmlFor="table_name" className="form-label">Table Name</label>
        <input 
          type="text" 
          className="form-control"
          name="table_name" 
          id="table_name"
          style={{ width: "50%" }}
          value={formData.table_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="capacity" className="form-label">Table Capacity (choose 1 or more)</label>
        <input 
          type="number" 
          className="form-control"
          name="capacity" 
          id="capacity"
          style={{ width: "50%" }}
          value={formData.capacity}
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

export default TableForm;