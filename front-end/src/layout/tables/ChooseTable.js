import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTableSeating } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ChooseTable() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [formValue, setFormValue] = useState();
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(loadTableOptions, [reservation_id]);

  function loadTableOptions() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);

    return () => abortController.abort();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    let reservationId = Number(reservation_id);

    updateTableSeating(formValue, reservationId, abortController.signal)
      .then((response) => {
        const newTables = tables.map((table) => {
          if (table.table_id === response.table_id) {
            return response;
          } else {
            return table;
          }
        });
        setTables(newTables);
        history.push("/dashboard")
      })
      .catch(setError);

    return () => abortController.abort();
  }

  const seatingOptions = tables.map((table) => {
    const isOccupied = table.reservation_id ? true : false;

    return (
      <option 
        key={table.table_id} 
        value={table.table_id} 
        disabled={isOccupied}
        >
        {table.table_name} - {table.capacity}
      </option>
    );
  });


  return (
    <>
      <ErrorAlert error={error} />      
      <h2 className="d-flex m3 justify-content-center">
        Choose a table
      </h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Table Name</label>
            <select
              className="form-control"
              name="table_id"
              onChange={(event) => setFormValue(event.target.value)}
              style={{ width: "70%" }}
              required
            >
              <option value="" >--Please Choose a Table--</option>
              {tables && seatingOptions}
            </select>
          </div>
          <div className="d-flex m-3">
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
          </div>
        </form>
      </div>
    </>
  );
}

export default ChooseTable;