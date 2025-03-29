"use client";
import styles from "../page.module.css";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DragdropAdminPage() {
  const [numberOfFields, setNumberOfFields] = useState(2);
  const [inputFields, setInputFields] = useState([]);

  useEffect(() => {
    setInputFields(Array(numberOfFields).fill(""));
  }, [numberOfFields]);

  const handleInputChange = (index, event) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = value;
    setInputFields(newInputFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted text:", inputFields);
  };

  return (
    <div className={styles.page}>
      <div className="admin-container">
        <h1>Create a Drag and Drop Exercise</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fieldCount">Number of boxes:</label>
            <select
              id="fieldCount"
              value={numberOfFields}
              onChange={(e) => setNumberOfFields(Number(e.target.value))}
              className="form-select"
            >
              {[2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {inputFields.map((value, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`wordInput${index}`}></label>
              <input
                type="text"
                id={`wordInput${index}`}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="form-input"
                placeholder={`Enter title ${index + 1}`}
              />
            </div>
          ))}
          <Button type="submit" size="sm" variant="outline">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}
