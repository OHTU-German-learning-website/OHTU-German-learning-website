import MainUI from "@/components/ui/multichoice/mainui";
import styles from "../../../page.module.css";

export default function Multichoice() {
  return (
    <div className={styles.page}>
      <h1>Multiple-Choice-Übung</h1>
      <MainUI />
    </div>
  );
}
