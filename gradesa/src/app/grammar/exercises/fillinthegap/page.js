import FillInTheGapGame from "@/components/ui/fillinthegap/fillinthegapgame";
import styles from "../../../page.module.css";

export default function GamePage() {
  return (
    <div className={styles.page}>
      <FillInTheGapGame />
    </div>
  );
}
