"use client";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/dropdown";
import { Button } from "@/components/ui/button/button";
import useQuery from "@/shared/hooks/useQuery";
import styles from "./learning.module.css";
import layout from "@/shared/styles/layout.module.css";

import { LearningForm } from "@/components/ui/learning-form";
const languageOptions = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Deutsch",
    value: "de",
  },
];
export default function Learning() {
  const [language, setLanguage] = useState(languageOptions[0]);
  const { data } = useQuery("/forms/learning_type");
  console.log(data);
  return (
    <div className={layout.view}>
      <Dropdown options={languageOptions} onSelect={setLanguage}>
        <Button>{language.label}</Button>
      </Dropdown>
      {data && <LearningForm form={data} language={language.value} />}
    </div>
  );
}
