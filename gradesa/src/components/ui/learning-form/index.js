import { Button } from "../button/button";
import { useState } from "react";
import styles from "./learning-form.module.css";

const getLanguageTitle = (obj, language) => {
  return obj[`title_${language}`];
};

const getLanguageDescription = (obj, language) => {
  return obj[`description_${language}`];
};

export const LearningForm = ({ form, language }) => {
  const [selectedPart, setSelectedPart] = useState(form.parts[0]);

  return (
    <div className={styles.learningForm}>
      <h1 className={styles.learningFormHeader}>
        {getLanguageTitle(form, language)}
      </h1>
      <p className={styles.learningFormDescription}>
        {getLanguageDescription(form, language)}
      </p>
      <div className={styles.learningFormContainer}>
        <FormStep part={selectedPart} language={language} />
        <StepSelector form={form} onSelect={setSelectedPart} />
      </div>
    </div>
  );
};

function StepQuestion({ question, language }) {
  return (
    <div className={styles.learningFormStepQuestion}>
      {getLanguageTitle(question, language)}
    </div>
  );
}

function FormStep({ part, language }) {
  const renderStepQuestions = () => {
    return (
      <div className={styles.learningFormStepQuestions}>
        {part.questions.map((question) => (
          <StepQuestion
            question={question}
            key={question.id}
            language={language}
          />
        ))}
      </div>
    );
  };
  return (
    <div className={styles.learningFormStep}>
      <h3 className={styles.learningFormStepDescription}>
        {getLanguageTitle(part, language)}
      </h3>
      {renderStepQuestions()}
    </div>
  );
}

function StepSelector({ form, onSelect }) {
  return (
    <div className={styles.learningFormStepSelector}>
      {form.parts.map((part) => (
        <div className={styles.learningFormStepSelectorItem}>
          <Button
            variant="none"
            width="fit"
            className={styles.stepSelectorButton}
            onClick={() => onSelect(part)}
          >
            <span>{part.step_number}</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
