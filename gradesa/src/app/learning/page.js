import { useState } from "react";

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

  return (
    <div>
      <Dropdown options={languageOptions} onSelect={setLanguage}>
        <Button>{language.label}</Button>
      </Dropdown>
    </div>
  );
}
