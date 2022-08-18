import React, { useState } from "react";
import { useHistory} from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import TableForm from "./TableForm";
import { createTable } from "../../utils/api";

function NewTable() {
  const history = useHistory();
  const [error, setError] = useState(null);

  const defaultFormData = {
    table_name: "",
    capacity: "",
  }

  const [formData, setFormData] = useState(defaultFormData);

    // event and click handlers
  const handleChange = (event) => {
    setFormData((table) => ({
      ...table,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const table = {
      ...formData
    };
    table.capacity = Number(table.capacity);

    createTable(table)
      .then(() => history.push(`/dashboard`)) // formData instead?
      .catch(setError);    
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <h2 className="d-flex my-3 justify-content-center">
        Create a new table
      </h2>
      <div>
        <TableForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />    
      </div>
    </div>
    
  )
}

export default NewTable;