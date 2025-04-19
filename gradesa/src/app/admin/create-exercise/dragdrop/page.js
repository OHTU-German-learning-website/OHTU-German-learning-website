"use client";
import styles from "../../../page.module.css";
import "./admin.css";
import { useState, useEffect } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout/container";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";

export default function DragdropAdminPage() {
  const [numberOfFields, setNumberOfFields] = useState(null);
  const [inputFields, setInputFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const makeRequest = useRequest();
  const router = useRouter();

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");

      const res = await makeRequest("/admin/exercises/dragdrop", {
        method: "POST",
        body: { fields: inputFields },
      });

      if (res.status === 200) {
        router.push("/admin/exercises");
      }
    } catch (e) {
      console.error("Error creating dragdrop exercise:", e);

      if (e.response?.data?.error) {
        setGeneralError(e.response.data.error);
      } else {
        setGeneralError("Ein Fehler ist aufgetreten");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="admin-container">
        <h1>Create a Drag and Drop Exercise</h1>
        {generalError && (
          <p className="error" role="alert">
            {generalError}
          </p>
        )}
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
                        {
                          label: "Red",
                          value: "red",
                          style: {
                            backgroundColor: "var(--red)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Blue",
                          value: "blue",
                          style: {
                            backgroundColor: "var(--blue1)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Green",
                          value: "green",
                          style: {
                            backgroundColor: "var(--green)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Yellow",
                          value: "yellow",
                          style: {
                            backgroundColor: "var(--yellow)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                        {
                          label: "Purple",
                          value: "purple",
                          style: {
                            backgroundColor: "var(--purple)",
                            width: "100%",
                            padding: "var(--u-xs)",
                            borderRadius: "var(--radius-sm)",
                          },
                        },
                      ]}
                      onSelect={(selectedOption) =>
                        handleInputChange(index, "color", selectedOption.value)
                      }
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        style={
                          field.color
                            ? {
                                backgroundColor: `var(--${field.color})`,
                                transition: "background-color 0.2s",
                              }
                            : {}
                        }
                      >
                        {field.color || "Select color"}
                      </Button>
                    </Dropdown>
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
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wird erstellt..." : "Create"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
