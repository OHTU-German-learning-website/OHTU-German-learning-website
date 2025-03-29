"use client";
import styles from "../page.module.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DragdropAdminPage() {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted text:", inputText);
  };

  return (
    <div className={styles.page}>
      <div className="admin-container">
        <h1>Create a Drag and Drop Exercise</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="wordInput">Text here</label>
            <input
              type="text"
              id="wordInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="form-input"
            />
          </div>
          <Button type="submit" size="sm" variant="secondary">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
