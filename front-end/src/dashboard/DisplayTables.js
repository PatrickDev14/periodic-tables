import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { finishReservationAtTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function DisplayTables({ table }) {
  const [error, setError] = useState(null);
  const [currentTable, setCurrentTable] = useState(table);
  const history = useHistory();

  const handleFinishSubmit = (event) => {
    event.preventDefault();
    // const abortController = new AbortController();
    setError(null);
    const confirmFinish = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
      );
    if (confirmFinish) {
      finishReservationAtTable(currentTable.table_id)
        .then((response) => {
          setCurrentTable(response);
          history.go(0);
        })
        .catch(setError);
    }

    // return abortController.abort();
  }

  return (
    <div className="card text-center shadow p-3 mb-5 bg-body rounded rounded-pill">
      <ErrorAlert error={error} />
      <div className="card-body">
        <h5 className="card-title">
          {currentTable.table_name}
        </h5>
        <p className="card-text">Seats: {currentTable.capacity}</p>
        <p className="card-text" data-table-id-status={currentTable.table_id} >
          {currentTable.reservation_id ? "Occupied" : "Free"}
        </p>
        {currentTable.reservation_id && (
          <form onSubmit={handleFinishSubmit}>
            <button
              className="btn btn-danger"
              data-table-id-finish={currentTable.table_id}
              type="submit"
            >
                Finish
            </button>
          </form>
          )}
          <div className="row">
          </div>
      </div>
    </div>
  );
}

export default DisplayTables;