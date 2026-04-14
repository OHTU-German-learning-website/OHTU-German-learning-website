import { LinkButton } from "@/components/ui/linkbutton";
import { getGrammarTopicsWithPages } from "@/backend/html-services";
import TopicsList from "./topics-list";

export default async function ThemesPage() {
  const grammarTopics = await getGrammarTopicsWithPages();

  return (
    <div className="themes-title">
      <LinkButton href="/grammar/alphabetical">
        Grammatik in alphabetischer Reihenfolge
      </LinkButton>
      <h1>Themen der Grammatik</h1>

      <TopicsList topics={grammarTopics} />
    </div>
  );
}
