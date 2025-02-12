"use client";
import { useState } from "react";
import { formConfig } from "./learning-form-config";

function LearningForm() {
  const [language, setLanguage] = useState("en");
  const [part, setPart] = useState(0);

  const renderPartSteps = (partConfig) => {
    return partConfig.steps.map((step) => {
      return <FormPartStep step={step} key={step.id} />;
    });
  };

  const currentPart = formConfig[language].parts[part];
  console.log(currentPart);

  const renderPart = () => {
    return (
      <div>
        {currentPart.title}
        {renderPartSteps(currentPart)}
      </div>
    );
  };

  return <div>{renderPart()}</div>;
}

function FormPartStep({ step }) {
  return <div key={step.id}>{step.text}</div>;
}

export default LearningForm;
