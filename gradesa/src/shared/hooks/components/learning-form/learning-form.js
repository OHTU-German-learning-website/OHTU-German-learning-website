import { useState } from "react";
import { formConfig } from "./learning-form-config";

const LearningForm = () => {
  const [language, setLanguage] = useState("en");
  const [part, setPart] = useState(0);

  const renderPartSteps = (partConfig) => {
    return partConfig.steps.map((step) => {
      return <div>{step.title}</div>;
    });
  };

  const renderParts = () => {
    return formConfig[language].parts[part].map((partConfig) => {
      return (
        <div>
          {partConfig.title}
          {renderPartSteps(partConfig)}
        </div>
      );
    });
  };

  return <div>{renderParts()}</div>;
};
