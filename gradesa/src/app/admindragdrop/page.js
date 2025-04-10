"use client";
import styles from "../page.module.css";
import "./admin.css";
import { useState, useEffect } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout/container";

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
            <Dropdown
              options={[
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
              ]}
              onSelect={(selectedOption) =>
                setNumberOfFields(Number(selectedOption.value))
              }
            >
              <Button size="md" variant="outline" width="fit">
                {numberOfFields
                  ? `Selected: ${numberOfFields}`
                  : "Select number of boxes"}
              </Button>
            </Dropdown>
          </div>
          <Row gap="md">
            {numberOfFields &&
              inputFields.map((field, index) => (
                <div key={index} className="form-group">
                  <Row gap="md">
                    <Dropdown
                      options={[
                        { label: "Red", value: "red" },
                        { label: "Blue", value: "blue" },
                        { label: "Green", value: "green" },
                        { label: "Yellow", value: "yellow" },
                        { label: "Purple", value: "purple" },
                      ]}
                      onSelect={(selectedOption) =>
                        handleInputChange(index, "color", selectedOption.value)
                      }
                    >
                      <Button size="sm" variant="outline">
                        {field.color || "Select color"}
                      </Button>
                    </Dropdown>
                    {/* <select id={`color-${index}`} className="form-select">
                      <option value="">Select color</option>
                      {["red", "blue", "green", "yellow", "purple"].map(
                        (color) => (
                          <option
                            className={`form-${color}`}
                            key={color}
                            value={color}
                          >
                            {color}
                          </option>
                        )
                      )}
                    </select> */}
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
