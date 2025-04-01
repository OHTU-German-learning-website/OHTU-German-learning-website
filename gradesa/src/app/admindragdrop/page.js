"use client";
import styles from "../page.module.css";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout/container";
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
            color: "",
            category: "",
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
          <Row gap="20px">
            {numberOfFields &&
              inputFields.map((field, index) => (
                <div key={index} className="form-group">
                  <Row gap="10px">
                    <select id={`color-${index}`} className="form-select">
                      <option value="">Select color</option>
                      {["red", "blue", "green", "yellow", "purple"].map(
                        (color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        )
                      )}
                    </select>
                    <input
                      type="text"
                      value={field.category}
                      onChange={(e) =>
                        handleInputChange(index, "category", e.target.value)
                      }
                      className="form-input"
                      placeholder={`Enter category ${index + 1}`}
                    />
                  </Row>
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
          </Row>
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
