"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout/container";
import "./multichoice.css";

const testData = [
  { id: "sec-1", type: "text", text: "Ich" },
  { id: "sec-2", type: "text", text: "bin" },
  { id: "sec-3", type: "multichoice", options: ["ein", "einer", "eine"] },
  { id: "sec-4", type: "text", text: "Berliner" },
  { id: "sec-5", type: "multichoice", options: ["!", "?", "."] },
];

export default function CreateExercise() {
  const [sections, setSections] = useState(testData);
  const [selectedMultiChoice, setSelectedMultiChoice] = useState();

  return (
    <>
      <h1>Multichoice</h1>
      {selectedMultiChoice !== undefined && (
        <DropDownEditor data={sections[selectedMultiChoice]} />
      )}
      <Row pb="xl">
        <Button
          onClick={() =>
            setSections(
              sections.concat([
                { id: crypto.randomUUID(), type: "text", text: "" },
              ])
            )
          }
        >
          New text section
        </Button>

        <Button
          onClick={() =>
            setSections(
              sections.concat([
                {
                  id: crypto.randomUUID(),
                  type: "multichoice",
                  options: ["1", "2"],
                },
              ])
            )
          }
        >
          New multichoice
        </Button>
      </Row>
      <div>
        {sections.map((s, i) => {
          if (s.type === "text") {
            return (
              <TextBox
                key={s.id}
                value={s.text}
                onChange={(e) => {
                  const newString = e.target.value;
                  const newList = sections.slice();
                  newList[i] = { ...newList[i], text: newString };
                  setSections(newList);
                }}
              />
            );
          } else if (s.type === "multichoice") {
            return (
              <DropDownIndicator
                key={s.id}
                value={i}
                onChange={(v) => setSelectedMultiChoice(Number(v))}
              />
            );
          }
        })}
      </div>
    </>
  );
}

function DropDownIndicator({ value, onChange }) {
  // An indicator to indicate that there is a dropdown here. The currently selected
  // dropdown will be edited in the DropDownEditor section.
  return (
    <input
      type="radio"
      name="dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function DropDownEditor({ data }) {
  // This section will have an editor to edit and view the currently active dropdown.
  return (
    <div>
      <h2>Dropdown section</h2>
      <p>Options:</p>
      <ul>
        {data.options.map((v) => (
          <li key={`dropdown-${v}`}>{v}</li>
        ))}
      </ul>
    </div>
  );
}

function TextBox({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="textField"
    />
  );
}
