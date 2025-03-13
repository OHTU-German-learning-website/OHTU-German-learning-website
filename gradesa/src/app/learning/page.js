"use client";
import { useState, useEffect } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";
import layout from "@/shared/styles/layout.module.css";
import { useRequest } from "@/shared/hooks/useRequest";
import useLocalStorage from "@/shared/utils/useLocalStorage";
import { LearningForm } from "@/components/ui/learning-form";
export const FORM_LANGUAGE_OPTIONS = [
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
  const [language, setLanguage] = useLocalStorage(
    "language",
    FORM_LANGUAGE_OPTIONS[0]
  );
  const { data, refetch } = useQuery("/forms/learning_type");
  const makeRequest = useRequest();
  const [isLoading, setIsLoading] = useState(false);

  const submitAnswer = async (form, part, question, answer) => {
    try {
      setIsLoading(true);
      const response = await makeRequest(
        `/forms/${form.public_id}/${part.id}/${question.id}`,
        { answer },
        {
          method: "PUT",
        }
      );
      refetch();
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={layout.view}>
      <Dropdown options={FORM_LANGUAGE_OPTIONS} onSelect={setLanguage}>
        <Button>{language.label}</Button>
      </Dropdown>
      {data && (
        <LearningForm
          form={data}
          language={language.value}
          onSubmitAnswer={submitAnswer}
        />
      )}
    </div>
  );
}
