import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { finishReservationAtTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function DisplayTables({ table }) {
  const [error, setError] = useState(null);
  const [currentTable, setCurrentTable] = useState(table);
  // const history = useHistory();

  const handleFinish = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    const confirmFinish = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
      );
    if (confirmFinish) {
      finishReservationAtTable(currentTable.table_id)
        .then((response) => setCurrentTable(response))
        .catch(setError);
      
      window.location.reload(true);
    }

    return abortController.abort();
  }

  return (
    <div className="card text-center rounded-pill">
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
          <button
            className="btn btn-danger"
            data-table-id-finish={currentTable.table_id}
            onClick={handleFinish}
          >
              Finish
          </button>
          )}
          <div className="row">
          </div>
      </div>
    </div>
  );
}

export default DisplayTables;