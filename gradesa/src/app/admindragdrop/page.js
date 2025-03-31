"use client";
import styles from "../page.module.css";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";

export default function DragdropAdminPage() {
  const [numberOfFields, setNumberOfFields] = useState(null);
  const [inputFields, setInputFields] = useState([]);

  useEffect(() => {
    if (numberOfFields) {
      if (numberOfFields > inputFields.length) {
        const additionalFields = Array(numberOfFields - inputFields.length)
          .fill("")
          .map(() => ({
            title: "",
            content: "",
          }));
        setInputFields([...inputFields, ...additionalFields]);
      } else {
        setInputFields(inputFields.slice(0, numberOfFields));
      }
    }
  }, [numberOfFields]);

  const handleInputChange = (index, field, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = {
      ...newInputFields[index],
      [field]: value,
    };
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
              value={numberOfFields || ""}
              onChange={(e) => setNumberOfFields(Number(e.target.value))}
              className="form-select"
            >
              <option value="">Select the number of boxes</option>
              {[2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {numberOfFields &&
            inputFields.map((field, index) => (
              <div key={index} className="form-group">
                <input
                  type="text"
                  value={field.title}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                  className="form-input"
                  placeholder={`Enter title ${index + 1}`}
                />
                <input
                  type="text"
                  value={field.content}
                  onChange={(e) =>
                    handleInputChange(index, "content", e.target.value)
                  }
                  className="form-input"
                  placeholder={`Enter words`}
                />
              </div>
            ))}
          {numberOfFields && (
            <Button type="submit" size="sm" variant="outline">
              Create
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
