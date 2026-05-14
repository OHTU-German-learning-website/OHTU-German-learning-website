"use client";
import { useState, useEffect } from "react";
import { Column } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import layout from "@/shared/styles/layout.module.css";
import styles from "./new-page.module.css";
import { useRouter } from "next/navigation";

export default function NewPage() {
  const [type, setType] = useState("resources");
  const [title, setTitle] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const [grammarTopics, setGrammarTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (type !== "grammar") return;
    fetch("/api/admin/grammar-topics")
      .then((res) => res.json())
      .then((data) => {
        setGrammarTopics(data);
        setSelectedTopicId("");
        setNewTopicName("");
      })
      .catch(() => {
        setGrammarTopics([]);
        setSelectedTopicId("");
      });
  }, [type]);

  const submit = async () => {
    const body = { title, type };
    if (type === "grammar") {
      if (!selectedTopicId) {
        setCreationMessage("Bitte Thema auswählen");
        return;
      }

      if (selectedTopicId === "new") {
        if (!newTopicName.trim()) {
          setCreationMessage("Bitte neuen Themennamen eingeben");
          return;
        }
        body.newTopicName = newTopicName;
      } else {
        body.topicId = Number(selectedTopicId);
      }
    }

    const response = await fetch(`/api/admin/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/admin/edit-page/${type}/${data.slug}`);
    } else {
      setTimeout(() => setCreationMessage(""), 1000);
      setCreationMessage("Fehler beim Erstellen der Seite");
    }
  };

  return (
    <Column className={layout.viewContent}>
      <h1 className={styles.title}>Neue Seite</h1>
      {!!creationMessage && <p className="error-message">{creationMessage}</p>}
      <div className={styles.form}>
        <div className={styles.fieldRow}>
          <label className={styles.label} htmlFor="title">
            Titel
          </label>
          <input
            className={styles.control}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldRow}>
          <label className={styles.label} htmlFor="type">
            Seitengruppe
          </label>
          <select
            className={styles.control}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="resources">Lernen</option>
            <option value="grammar">Grammatik</option>
            <option value="communications">Kommunikation</option>
          </select>
        </div>

        {type === "grammar" && (
          <>
            <div className={styles.fieldRow}>
              <label className={styles.label} htmlFor="topic">
                Thema
              </label>
              <select
                className={styles.control}
                id="topic"
                value={selectedTopicId}
                required
                onChange={(e) => {
                  setSelectedTopicId(e.target.value);
                  setNewTopicName("");
                }}
              >
                <option value="" disabled>
                  Thema auswählen...
                </option>
                {grammarTopics.map((t) => (
                  <option key={t.id} value={t.id.toString()}>
                    {t.name}
                  </option>
                ))}
                <option value="new">Neues Thema hinzufügen...</option>
              </select>
            </div>

            {selectedTopicId === "new" && (
              <div className={styles.fieldRow}>
                <label className={styles.label} htmlFor="newTopic">
                  Neuer Themenname
                </label>
                <input
                  className={styles.control}
                  type="text"
                  id="newTopic"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  required
                />
              </div>
            )}
          </>
        )}

        <div className={styles.actions}>
          <Button onClick={submit}>Erstellen</Button>
        </div>
      </div>
    </Column>
  );
}
