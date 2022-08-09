import React from "react";

function DisplayTables({ table }) {

  return (
    <div className="card rounded-pill">
      <div className="card-body">
        <h5 className="card-title text-center">
          {table.table_name}
        </h5>
        <p className="card-text text-center">Seats: {table.capacity}</p>
        {/* <a href="#" className="card-link">Card link</a>
        <a href="#" className="card-link">Another link</a> */}
      </div>
    </div>
  );
}

export default DisplayTables;