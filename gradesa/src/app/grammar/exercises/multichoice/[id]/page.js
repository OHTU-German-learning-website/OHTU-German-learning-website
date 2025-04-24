import MultichoicePage from "@/components/ui/multichoice/multichoicepage";
import styles from "../../../../page.module.css";

export default async function Multichoice({ params }) {
  const { id } = await params; // Extract the id from the URL

  return (
    <div className={styles.page}>
      <h1>Multiple-Choice-Übung</h1>
      <MultichoicePage exerciseId={id} /> {/* Pass the id to MultichoicePage */}
    </div>
  );
}
