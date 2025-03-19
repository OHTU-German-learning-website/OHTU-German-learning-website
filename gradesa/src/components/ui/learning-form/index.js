import { Button } from "../button";
import { useState } from "react";
import styles from "./learning-form.module.css";
import { Radio } from "../radio";
import { useRouter } from "next/navigation";

export const getLanguageField = (obj, field, language) => {
  return obj[`${field}_${language}`];
};
export const getLanguageTitle = (obj, language) => {
  return getLanguageField(obj, "title", language);
};

const getLanguageDescription = (obj, language) => {
  return getLanguageField(obj, "description", language);
};

export function LearningForm({ form, language, onSubmitAnswer }) {
  const [selectedPartIdx, setSelectedPartIdx] = useState(0);

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
          part={form.parts[selectedPartIdx]}
          language={language}
          onSubmitAnswer={submitAnswer}
        />
        <StepSelector
          form={form}
          onSelect={setSelectedPartIdx}
          currentPart={form.parts[selectedPartIdx]}
          language={language}
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
    return Array.from({ length: 5 }).map((_, index) => {
      return (
        <div className={styles.questionRadioContainer} key={index}>
          <Radio
            label={`${index + 1}`}
            radioLabel={`${index + 1}`}
            size="lg"
            checked={question.answer === index + 1}
            name={question.id}
            className={styles.questionRadioInput}
            onChange={() => onSubmitAnswer(question, index + 1)}
          />
        </div>
      );
    });
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

function StepSelector({ form, onSelect, currentPart, language }) {
  const router = useRouter();
  const renderStepButtons = () => {
    return form.parts.map((part, i) => {
      const isPrevPartValid =
        !form.parts[i - 1] || isPartValid(form.parts[i - 1]);
      return (
        <FormPartButton
          key={part.id}
          current={part.id === currentPart.id}
          part={part}
          onSelect={() => onSelect(i)}
          isDisabled={!isPrevPartValid}
        />
      );
    });
  };
  const isCurrentPartValid = isPartValid(currentPart);
  const currentPartIndex = form.parts.findIndex(
    (part) => part.id === currentPart.id
  );
  const isDone = currentPartIndex === form.parts.length - 1;
  return (
    <div className={styles.learningFormStepSelector}>
      <Button
        variant="none"
        className={`${styles.stepSelectorButton} ${styles.stepNavButton}`}
        onClick={() => onSelect(currentPartIndex - 1)}
        disabled={currentPartIndex === 0}
      >
        <span>{language === "de" ? "Zurück" : "Previous"}</span>
      </Button>
      {renderStepButtons()}
      <Button
        variant="none"
        disabled={!isCurrentPartValid}
        className={`${styles.stepSelectorButton} ${styles.stepNavButton}`}
        onClick={() => {
          if (isDone) {
            router.push("/learning/answers");
          } else if (form.parts[currentPartIndex + 1]) {
            onSelect(currentPartIndex + 1);
          }
        }}
      >
        <span>
          {isDone
            ? language === "de"
              ? "Fertig"
              : "Finish"
            : language === "de"
              ? "Weiter"
              : "Next"}
        </span>
      </Button>
    </div>
  );
}

function FormPartButton({ part, onSelect, isDisabled, current }) {
  return (
    <Button
      variant="none"
      className={styles.stepSelectorButton}
      width="fit"
      data-current={current}
      onClick={onSelect}
      disabled={isDisabled}
    >
      <span>{part.step_label}</span>
    </Button>
  );
}

function isPartValid(part) {
  return part.questions.every((question) => question.answer !== 0);
}
