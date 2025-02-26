import { Button } from "../button/button";
import { useState } from "react";
import styles from "./learning-form.module.css";
const getLanguageTitle = (obj, language) => {
  return obj[`title_${language}`];
};

const getLanguageDescription = (obj, language) => {
  return obj[`description_${language}`];
};

export function LearningForm({ form, language, onSubmitAnswer }) {
  const [selectedPart, setSelectedPart] = useState(form.parts[0]);

  const submitAnswer = async (part, question, answer) => {
    await onSubmitAnswer(form, part, question, answer);
  };
  return (
    <div className={styles.learningForm}>
      <h1 className={styles.learningFormHeader}>
        {getLanguageTitle(form, language)}
      </h1>
      <p className={styles.learningFormDescription}>
        {getLanguageDescription(form, language)}
      </p>
      <div className={styles.learningFormContainer}>
        <FormStep
          part={selectedPart}
          language={language}
          onSubmitAnswer={submitAnswer}
        />
        <StepSelector
          form={form}
          onSelect={setSelectedPart}
          currentPart={selectedPart}
        />
      </div>
    </div>
  );
}

function FormStep({ part, language, onSubmitAnswer }) {
  const submitAnswer = async (question, answer) => {
    await onSubmitAnswer(part, question, answer);
  };
  const renderStepQuestions = () => {
    return (
      <div className={styles.questionContainer} key={part.id}>
        {part.questions.map((question) => (
          <StepQuestion
            question={question}
            key={question.id}
            language={language}
            onSubmitAnswer={submitAnswer}
          />
        ))}
      </div>
    );
  };
  return (
    <div className={styles.stepContainer}>
      <h3 className={styles.stepTitle}>{getLanguageTitle(part, language)}</h3>
      {renderStepQuestions()}
    </div>
  );
}

function StepQuestion({ question, language, onSubmitAnswer }) {
  const renderRadios = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div className={styles.questionRadioContainer} key={index}>
        <input
          type="radio"
          checked={question.answer === index + 1}
          name={question.id}
          className={styles.questionRadioInput}
          onChange={() => onSubmitAnswer(question, index + 1)}
        />
        <fieldset className={styles.questionFieldset}>{index + 1}</fieldset>
      </div>
    ));
  };
  return (
    <>
      <div className={styles.learningFormStepQuestion}>
        <span className={styles.questionTitle}>
          {getLanguageTitle(question, language)}
        </span>
      </div>
      <div className={styles.questionOptionsContainer}>{renderRadios()}</div>
    </>
  );
}

function StepSelector({ form, onSelect, currentPart }) {
  const renderStepButtons = () => {
    return form.parts.map((part, i) => {
      const isPrevPartValid =
        !form.parts[i - 1] || isPartValid(form.parts[i - 1]);
      return (
        <FormPartButton
          key={part.id}
          part={part}
          onSelect={onSelect}
          isDisabled={!isPrevPartValid}
        />
      );
    });
  };
  const isCurrentPartValid = isPartValid(currentPart);
  const currentPartIndex = form.parts.findIndex(
    (part) => part.id === currentPart.id
  );
  return (
    <div className={styles.learningFormStepSelector}>
      <Button
        variant="none"
        width="fit"
        className={styles.stepSelectorButton}
        onClick={() => onSelect(form.parts[currentPartIndex - 1])}
        disabled={currentPartIndex === 0}
      >
        <span>Previous</span>
      </Button>
      {renderStepButtons()}
      <Button
        variant="none"
        width="fit"
        disabled={!isCurrentPartValid}
        className={styles.stepSelectorButton}
        onClick={() =>
          form.parts[currentPartIndex + 1] &&
          onSelect(form.parts[currentPartIndex + 1])
        }
      >
        <span>Next</span>
      </Button>
    </div>
  );
}

function FormPartButton({ part, onSelect, isDisabled }) {
  return (
    <Button
      variant="none"
      className={styles.stepSelectorButton}
      width="fit"
      onClick={() => onSelect(part)}
      disabled={isDisabled}
    >
      <span>{part.step_label}</span>
    </Button>
  );
}

function isPartValid(part) {
  return part.questions.every((question) => question.answer !== 0);
}
