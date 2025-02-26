import styles from "./radio.module.css";
export function Radio({
  label,
  checked,
  onChange,
  className,
  size = "md",
  ...props
}) {
  return (
    <label className={styles.radioContainer} aria-label={label}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className={[styles.radioInput, styles[size], className].join(" ")}
        {...props}
      />
    </label>
  );
}
