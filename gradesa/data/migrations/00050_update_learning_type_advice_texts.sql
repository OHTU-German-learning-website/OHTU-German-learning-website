UPDATE form_parts
SET advice_en = $$If you achieved a high average score in group A, the following exercise types and
learning strategies may be most helpful for you:
Make frequent use of exercise types that help you improve your memory:
• Group and sort words/sentences
• Find associations that help you remember structures, e.g. create mind maps
with words from a topic or communication situation, or memorise the vowels
of strong verbs using mnemonics (Gitarre – sitzen – saß – gesessen)!
• Put new words into context to help you remember them better!
• Use images, sounds or actions to help you remember new expressions better!
• Work in a structured way; follow the learning path of the exercises (“Next
exercise / Continue”)!
• Revise older material frequently!$$
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'A';

UPDATE form_parts
SET advice_de = $$Wenn du in der Gruppe A einen hohen Mittelwert erreicht hast, dann helfen dir
vielleicht folgende Übungsformen und Lernstrategien am besten:
Verwende häufig solche Übungstypen, die dir helfen, dein Gedächtnis zu
verbessern:
 Wörter/Sätze gruppieren und sortieren
 Finde Assoziationen, mit denen du dir Strukturen merken kannst, z. B. erstelle
Mindmaps mit Wörtern eines Themas/einer Kommunikationssituation oder
merke dir die Vokale der starken Verben mit Merkwörtern (Gitarre – sitzen –
saß – gesessen)!
 neue Wörter in einen Zusammenhang bringen, um sie sich besser zu merken
 Verwende Bilder, Töne oder Handlungen, um dir neue Ausdrücke besser zu
merken!
 Arbeite strukturiert, folge dem Lernpfad der Übungen („Nächste Übung /
Weiter“)!
 Wiederhole häufig älteres Material!$$
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'A';

UPDATE form_parts
SET advice_en = $$If you have achieved a high average score in Group B, the following exercise types
and learning strategies may be most helpful:
• Revise the structures regularly!
• Use plenty of communication scenarios from the app and look for others
where you can use the German language in all its forms (writing, reading,
speaking, listening)!
• Do exercises where you have to write something – special tip: first write your
answers by hand on a piece of paper! Then type them into the app.
• If you don’t understand something, use reference materials. You’ll find these
in the links on the left-hand side.$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'B';

UPDATE form_parts
SET advice_de = $$Wenn du in der Gruppe B einen hohen Mittelwert erreicht hast, dann helfen dir
vielleicht folgende Übungsformen und Lernstrategien am besten:
 Wiederhole die Strukturen regelmäßig!
 Verwende viele Kommunikationssituationen aus der App und suche dir
weitere, wo du die deutsche Sprache in allen Formen (Schreiben, Lesen,
Sprechen, Hören) anwenden kannst!
 Mache Übungen, bei denen du etwas schreiben musst – Spezialtipp:
Schreibe deine Antworten zuerst mit der Hand auf einen Zettel! Danach tippst
du sie in die App.
 Wenn du etwas nicht verstehst, benutze Hilfsmittel zum Nachschlagen. Die
findest du am linken Rand in den Links.$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'B';

UPDATE form_parts
SET advice_en = $$If you achieved a high average score in Group C, the following exercise types and
learning strategies may be most helpful for you:

• Try to guess unfamiliar things from the context first or use your own
languages to work out unfamiliar structures! Often, it’s not a problem if you
don’t quite understand a detail.
• When producing language (speaking/writing), simply try to replace such
difficult structures with simpler ones that you know for sure.
If you achieved a low score in Group C, then try in future to be more confident and
less anxious when using the German language. Mistakes aren’t a problem; you can
learn from them!$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'C';

UPDATE form_parts
SET advice_de = $$Wenn du in der Gruppe C einen hohen Mittelwert erreicht hast, dann helfen dir
vielleicht folgende Übungsformen und Lernstrategien am besten:
 Versuche, unbekannte Dinge zuerst aus dem Kontext zu erraten oder nutze
deine eigenen Sprachen zur Erschließung unbekannter Strukturen! Oft ist es
auch kein Problem, wenn man ein Detail nicht ganz versteht.
 Bei der Sprachproduktion (Sprechen/Schreiben) versuchst du einfach, solche
schwierigen Strukturen durch einfachere zu ersetzen, die du sicher kennst.
Wenn du in der Gruppe C einen niedrigen Wert erreicht hast, dann versuche in
Zukunft, mutiger, mit weniger Angst mit der deutschen Sprache umzugehen. Fehler
sind kein Problem, man kann aus ihnen lernen!$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'C';

UPDATE form_parts
SET advice_en = $$If you achieved a high average score in Group D, then consider the following
learning strategies:
• Draw up a study plan, write it down and work on these points!
• Set yourself specific goals in your study plan that you can actually achieve,
e.g. In April, I want to learn to talk confidently and correctly about my work.
• Once you’ve mastered a point, tick it off or mark it as ‘done’! You can come
back to it later and repeat the structure, so you don’t forget it again.
• Use some of the app’s exercises to check whether you’ve achieved your
goals! You can also use the ‘Brauchen Sie Hilfe?’ page for this. Write a short
text and send it along with your email address. We’ll then send you feedback!
• As well as the app, use material you’re familiar with for your studies – whether
from school or your own resources!
If you’ve scored low in Group D, try to find lots of situations where people speak
German. Make use of social media or video platforms for this.$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'D';

UPDATE form_parts
SET advice_de = $$Wenn du in der Gruppe D einen hohen Mittelwert erreicht hast, dann denke an
folgende Lernstrategien:
 Mach dir einen Lernplan, schreibe ihn auf und arbeite an diesen Punkten!
 Stelle dir in deinem Lernplan konkrete Ziele, die du auch wirklich erreichen
kannst, z. B. Im April möchte ich lernen, sicher und korrekt über meine Arbeit
zu erzählen.
 Wenn du einen Punkt sicher beherrschst, markiere ihn mit einem Haken oder
kennzeichne ihn als „erledigt“! Du kannst später darauf zurückkommen und
die Struktur wiederholen, damit du sie nicht wieder vergisst.
 Überprüfe mit einigen Übungen der App, ob du deine Ziele erreicht hast! Dazu
kannst du auch die Seite „Brauchen Sie Hilfe?“ benutzen. Schreibe einen
kleinen Text und sende ihn mit deiner E-Mail-Adresse. Dann bekommst du
von uns Feedback!
 Nutze zum Lernen neben der App auch dir bekanntes Material, aus der
Schule oder eigenes!
Wenn du in der Gruppe D einen niedrigen Wert erreicht hast, dann versuche, viele
Situationen zu finden, wo Menschen auf Deutsch sprechen. Nutze dazu auch die
Sozialen Medien oder Videoplattformen.$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'D';

UPDATE form_parts
SET advice_en = $$If you have achieved a high average score in Group E, keep the following in mind
whilst learning:
• Keep a learning diary and write down your achieved goals and your feelings!
• When choosing topics, however, make sure you don’t do exercises that are
too easy! Ideally, the exercise should start slightly above your level. Then you
can feel how it gets easier and easier for you as you practise. Enjoy that
feeling!
• Talk to other learners about learning German! Why not use your social media
for this too!
If you have achieved a low score in Group E, then consider the following questions:
• Try to exchange ideas with other learners!

• Be more confident about speaking and writing, even if the structures aren’t
very familiar!
• Also use the ‘Brauchen Sie Hilfe?’ page if you have any questions. Don’t
forget to include your email address so we can reply to you.$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'E';

UPDATE form_parts
SET advice_de = $$Wenn du in der Gruppe E einen hohen Mittelwert erreicht hast, dann denke beim
Lernen an folgende Dinge:
 Führe ein Lerntagebuch und schreibe darin deine erreichten Ziele und deine
Gefühle auf!

 Achte bei der Auswahl der Themen aber darauf, dass du nicht zu einfache
Übungen machst! Optimal ist es, wenn die Übung etwas über deinem Niveau
beginnt. Dann kannst du spüren, wie sie während des Übens für dich immer
leichter wird. Genieße das Gefühl!
 Sprich mit anderen Lernenden über das Deutschlernen! Nutze auch deine
Sozialen Medien dazu!
Wenn du in der Gruppe E einen niedrigen Wert erreicht hast, dann denke an
folgende Fragen:
 Versuche, dich mit anderen Lernen auszutauschen!
 Hab mehr Mut zum Sprechen und Schreiben, auch wenn die Strukturen nicht
sehr bekannt sind!
 Benutze auch die Seite „Brauchen Sie Hilfe?“, wenn du Fragen hast. Vergiss
nicht deine E-Mail-Adresse, damit wir dir antworten können.$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'E';

UPDATE form_parts
SET advice_en = $$If you have achieved a high average score in Group F, then bear the following in
mind whilst studying:
• Find out as much as you can from a variety of sources about life and culture
in German-speaking countries!
• Don’t forget about literature either! It offers both entertainment and language
learning!
If you achieved a low average score in Group F, then bear the following in mind
when studying:
Learning is a social process, especially when it comes to learning a foreign
language. Seek out contact with real people who speak German as their mother
tongue and speak to them in German. Ask them to correct you!$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'F';

UPDATE form_parts
SET advice_de = $$Wenn du in der Gruppe F einen hohen Mittelwert erreicht hast, dann denke beim
Lernen an folgende Dinge:
 Informiere dich aus möglichst vielen Quellen über Leben und Kultur der
deutschsprachigen Länder!
 Vergiss auch nicht die schöne Literatur! Sie bietet Unterhaltung und
Sprachenlernen!
Wenn du in der Gruppe F einen niedrigen Mittelwert erreicht hast, dann denke beim
Lernen vor allem daran:
Lernen ist ein sozialer Prozess, besonders Fremdsprachenlernen. Suche den
Kontakt mit realen Personen, die Deutsch als Muttersprache sprechen und sprich mit
ihnen auf Deutsch. Bitte darum, dass sie dich korrigieren!$$ 
WHERE form_id = (SELECT id FROM forms WHERE public_id = 'learning_type')
  AND step_label = 'F';
