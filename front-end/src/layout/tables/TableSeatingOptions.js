import React from "react";

function TableSeatingOptions({ tables, reservation }) {

  return tables.map((table) => {
    const isOccupiedOrTooSmall = table.reservation_id || (Number(table.capacity) < Number(reservation.people));

    return (
      <option 
        key={table.table_id} 
        value={table.table_id} 
        disabled={isOccupiedOrTooSmall}
        >
        {table.table_name} - {table.capacity}
      </option>
    );
  });
}

export default TableSeatingOptions;