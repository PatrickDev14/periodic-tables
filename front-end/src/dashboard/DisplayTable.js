import React from "react";

function DisplayTable({ table }) {
  const { table_name, capacity, table_id, reservation_id } = table;

  return (
    <div className="card rounded-pill">
      <div className="card-body">
        <h5 className="card-title text-center">
          {table_name}
        </h5>
        <p className="card-text text-center">Seats: {capacity}</p>
        <p className="card-text text-center" data-table-id-status={table_id} >
        {reservation_id ? "Occupied" : "Free"}
        </p>
      </div>
    </div>
  );
}

export default DisplayTable;