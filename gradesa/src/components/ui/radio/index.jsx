import styles from "./radio.module.css";
export function Radio({
  label,
  radioLabel,
  checked,
  onChange,
  className,
  size = "md",
  ...props
}) {
  const handleChange = (e) => {
    e.preventDefault();
    onChange(e);
  };
  return (
    <label className={styles.radioContainer} aria-label={label}>
      <input
        type="radio"
        checked={checked}
        onChange={handleChange}
        className={[styles.radioInput, styles[size], className].join(" ")}
        {...props}
      />
      <fieldset className={[styles.radioFieldset, styles[size]].join(" ")}>
        {radioLabel}
      </fieldset>
    </label>
  );
}
