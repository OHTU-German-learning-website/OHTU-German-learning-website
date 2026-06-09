import MultichoicePage from "@/components/ui/multichoice/multichoicepage";
import AdminVisibleLastModified from "@/components/ui/admin-visible-last-modified";
import styles from "../../../../page.module.css";

export default async function Multichoice({ params }) {
  const { id } = await params; // Extract the id from the URL

  return (
    <div className={styles.page}>
      <h2>Multiple-Choice-Übung</h2>
      <AdminVisibleLastModified
        endpoint={`/admin/exercises/multichoice/${id}`}
      />
      <MultichoicePage exerciseId={id} /> {/* Pass the id to MultichoicePage */}
    </div>
  );
}
