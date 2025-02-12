DO $$
DECLARE
  form_en_id BIGINT;
  form_de_id BIGINT;
  part_id   BIGINT;
BEGIN
  -- Insert English form and its parts and questions
  INSERT INTO forms(title, description, iso_language_code)
  VALUES ('Discover your learning strategies!', 'How do you normally learn a seconda language (SL)? Once you know this, you can choose exercises that are better suited to your learning style.
Answer the following questions based on what you are actually doing at the moment and not on what you would do if you had more time or better conditions for learning.
For each question, choose an alternative from 1-5. This is what the numbers mean:
1. Never or almost never true of me - I never or almost never do this.
2. Usually not true of me - I don''t do this often.
3. Somewhat true of me - I sometimes do that.
4. Usually true of me - I usually do this.
5. Always or almost always true of me - I almost always do this.', 'en')
  RETURNING id INTO form_en_id;

  -- English Part A
  INSERT INTO form_parts(form_id, title) VALUES (form_en_id, 'Part A')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'I think of relationships between what I already know and new things I learn in the second language (SL).'),
    (part_id, 'I use new SL words in a sentence so I can remember them.'),
    (part_id, 'I connect the sound of a new SL word and an image or picture of the word to help me remember the word.'),
    (part_id, 'I remember a new SL word by making a mental picture of a situation in which the word might be used.'),
    (part_id, 'I use rhymes to remember new SL words.'),
    (part_id, 'I use flashcards to remember new SL words.'),
    (part_id, 'I physically act out new SL words.'),
    (part_id, 'I review SL lessons often.'),
    (part_id, 'I remember new SL words or phrases by remembering their location on the page, on the board, or on a street sign.');

  -- English Part B
  INSERT INTO form_parts(form_id, title) VALUES (form_en_id, 'Part B')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'I say or write new SL words several times.'),
    (part_id, 'I try to talk like native SL speakers.'),
    (part_id, 'I practice the sounds of SL.'),
    (part_id, 'I use the SL words I know in different ways.'),
    (part_id, 'I start conversations in the SL.'),
    (part_id, 'I watch SL language TV shows spoken in SL or go to movies spoken in SL.'),
    (part_id, 'I read for pleasure in the SL.'),
    (part_id, 'I write notes, messages, letters, or reports in the SL.'),
    (part_id, 'I first skim an SL passage (read over the passage quickly) then go back and read carefully.'),
    (part_id, 'I look for words in my own language that are similar to new words in the SL.'),
    (part_id, 'I try to find patterns in the SL.'),
    (part_id, 'I find the meaning of an SL word by dividing it into parts that I understand.'),
    (part_id, 'I try not to translate word for word.'),
    (part_id, 'I make summaries of information that I hear or read in the SL.');

  -- English Part C
  INSERT INTO form_parts(form_id, title) VALUES (form_en_id, 'Part C')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'To understand unfamiliar SL words, I make guesses.'),
    (part_id, 'When I can''t think of a word during a conversation in the SL, I use gestures.'),
    (part_id, 'I make up new words if I do not know the right ones in the SL.'),
    (part_id, 'I read SL without looking up every new word.'),
    (part_id, 'I try to guess what the other person will say next in the SL.'),
    (part_id, 'If I can''t think of an SL word, I use a word or phrase that means the same thing.');

  -- English Part D
  INSERT INTO form_parts(form_id, title) VALUES (form_en_id, 'Part D')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'I try to find as many ways as I can to use my SL.'),
    (part_id, 'I notice my SL mistakes and use that information to help me do better.'),
    (part_id, 'I pay attention when someone is speaking SL.'),
    (part_id, 'I try to find out how to be a better learner of SL.'),
    (part_id, 'I plan my schedule so I will have enough time to study SL.'),
    (part_id, 'I look for people I can talk to in SL.'),
    (part_id, 'I look for opportunities to read as much as possible in SL.'),
    (part_id, 'I have clear goals for improving my SL skills.'),
    (part_id, 'I think about my progress in learning SL.');

  -- English Part E
  INSERT INTO form_parts(form_id, title) VALUES (form_en_id, 'Part E')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'I try to relax whenever I feel afraid of using SL.'),
    (part_id, 'I encourage myself to speak SL even when I am afraid of making a mistake.'),
    (part_id, 'I give myself a reward or treat when I do well in SL.'),
    (part_id, 'I notice if I am tense or nervous when I am studying or using SL.'),
    (part_id, 'I write down my feelings in a language learning diary.'),
    (part_id, 'I talk to someone else about how I feel when I am learning SL.');

  -- English Part F
  INSERT INTO form_parts(form_id, title) VALUES (form_en_id, 'Part F')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'If I do not understand something in SL, I ask the other person to slow down or say it again.'),
    (part_id, 'I ask SL speakers to correct me when I talk.'),
    (part_id, 'I practice SL with other students.'),
    (part_id, 'I ask for help from SL speakers.'),
    (part_id, 'I ask questions in SL.'),
    (part_id, 'I try to learn about the culture of SL speakers.');

  -- Insert German form and its parts and questions
  INSERT INTO forms(title, description, iso_language_code)
  VALUES ('Entdecke deine Lernstrategien!', 'Wie lernst du normalerweise eine Fremdsprache? Wenn du das weißt, kannst du solche Übungen auswählen, die besser zu deinem Lernstil passen.
Beantworte die folgenden Fragen ausgehend vom dem, was du zur Zeit wirklich machst, und nicht vom dem, was du vielleicht gern machen würdest.
Wähle für jede Frage eine Alternative von 1-5. Das bedeuten die Zahlen:
1. trifft (fast) nie zu - Das mache ich nie oder fast nie.
2. trifft selten zu - Das mache ich nicht oft.
3. trifft mehr oder weniger zu - Das mache ich manchmal.
4. trifft im Allgemeinen zu - Das mache ich normalerweise.
5. trifft (fast) immer zu - Das mache ich fast immer.', 'de')
  RETURNING id INTO form_de_id;

  -- German Teil A
  INSERT INTO form_parts(form_id, title) VALUES (form_de_id, 'Teil A – Erinnerungsvermögen verbessern')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'Ich versuche immer Verbindungen herzustellen zwischen dem, was ich schon weiß, und dem, was ich in der Fremdsprache kennen lerne.'),
    (part_id, 'Ich benutze neue Wörter in einem Satz, um sie mir besser zu merken.'),
    (part_id, 'Ich assoziiere den Klang eines neuen Wortes mit einem Bild, um es mir besser zu merken.'),
    (part_id, 'Ich lerne das Wort, indem ich mir eine Situation vorstelle, in der das Wort benutzt werden könnte.'),
    (part_id, 'Ich benutze Reime, um mir Wörter in der Fremdsprache besser zu merken.'),
    (part_id, 'Ich benutze Karteikarten, um mir Wörter in der Fremdsprache besser zu merken.'),
    (part_id, 'Ich stelle neue Wörter in der Fremdsprache mimisch dar, um sie mir besser zu merken.'),
    (part_id, 'Ich wiederhole oft neuen Lernstoff.'),
    (part_id, 'Ich merke mir neue Wörter in der Fremdsprache, indem ich mich beim Wiederholen an den Ort erinnere, wo sie waren, z.B. im Heft oder Buch, an der Tafel oder auf einem Straßenschild.');

  -- German Teil B
  INSERT INTO form_parts(form_id, title) VALUES (form_de_id, 'Teil B – Lerntechniken benutzen')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'Ich spreche oder schreibe neue Wörter mehrmals.'),
    (part_id, 'Ich versuche, Muttersprachler nachzumachen.'),
    (part_id, 'Ich übe die Laute der Fremdsprache.'),
    (part_id, 'Ich benutze Wörter, die ich in der Fremdsprache kenne, in verschiedenen Zusammenhängen.'),
    (part_id, 'Ich fange Gespräche in der Fremdsprache an.'),
    (part_id, 'Ich schaue mir Fernsehsendungen oder Filme in der Fremdsprache an, ich höre Radio.'),
    (part_id, 'Ich lese zu meinem Vergnügen in der Fremdsprache.'),
    (part_id, 'Ich schreibe Notizen, Mitteilungen, Briefe oder Berichte in der Fremdsprache.'),
    (part_id, 'Ich lese einen Text in der Fremdsprache zuerst einmal ganz bis zu Ende durch, um die Hauptaussage zu verstehen, dann fange ich wieder von vorne an und lese ihn aufmerksam durch.'),
    (part_id, 'Ich suche nach Ähnlichkeiten zwischen den Wörtern in der Fremdsprache und denen in meiner Muttersprache (oder in einer anderen Fremdsprache).'),
    (part_id, 'Ich versuche, Strukturen in der Fremdsprache zu finden.'),
    (part_id, 'Ich suche die Bedeutung eines Wortes, indem ich es in verschiedene Teile aufteile, die ich verstehe.'),
    (part_id, 'Ich versuche, nicht wort-wörtlich zu übersetzen.'),
    (part_id, 'Ich mache Zusammenfassungen von Nachrichten, die ich in der Fremdsprache lese bzw. höre.');

  -- German Teil C
  INSERT INTO form_parts(form_id, title) VALUES (form_de_id, 'Teil C – Fehlende Kenntnisse kompensieren')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'Um unbekannte Wörter in der Fremdsprache zu verstehen, versuche ich ihre Bedeutung zu erraten.'),
    (part_id, 'Wenn mir ein Wort im Gespräch fehlt, helfe ich mir mit Gesten.'),
    (part_id, 'Wenn ich die Wörter, die ich in der Fremdsprache brauche, nicht kenne, erfinde ich sie.'),
    (part_id, 'Ich lese in der Fremdsprache, ohne jedes einzelne Wort nachzuschlagen.'),
    (part_id, 'In einem Gespräch versuche ich zu erraten, was mein Gesprächspartner sagen wird.'),
    (part_id, 'Wenn ich das passende Wort in der Fremdsprache nicht finde, suche ich nach einem Synonym oder einer Umschreibung.');

  -- German Teil D
  INSERT INTO form_parts(form_id, title) VALUES (form_de_id, 'Teil D – Das Lernen organisieren und evaluieren')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'Ich suche viele Gelegenheiten, um die Fremdsprache zu sprechen.'),
    (part_id, 'Ich notiere meine Fehler in der Fremdsprache und versuche, mich zu verbessern.'),
    (part_id, 'Wenn jemand in der Fremdsprache spricht, bin ich besonders aufmerksam.'),
    (part_id, 'Ich suche Wege, um ein besserer Fremdsprachenlerner zu werden.'),
    (part_id, 'Ich organisiere meinen Zeitplan so, dass ich Zeit fürs Fremdsprachenlernen habe.'),
    (part_id, 'Ich suche Leute, mit denen ich die Fremdsprache praktizieren kann.'),
    (part_id, 'Ich suche Gelegenheiten, um in der Fremdsprache zu lesen.'),
    (part_id, 'Ich habe klare Ziele, für die ich meine Kompetenzen in der Fremdsprache verbessere.'),
    (part_id, 'Ich nehme meine Fortschritte in der Fremdsprache wahr.');

  -- German Teil E
  INSERT INTO form_parts(form_id, title) VALUES (form_de_id, 'Teil E – Gefühle und Emotionen managen')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'Ich versuche mich zu entspannen, wenn ich Angst habe, die Fremdsprache zu benutzen.'),
    (part_id, 'Ich mache mir Mut, in der Fremdsprache zu sprechen, wenn ich Angst habe, einen Fehler zu machen.'),
    (part_id, 'Wenn ich beim Fremdsprachenlernen Erfolg habe, gönne ich mir eine Belohnung.'),
    (part_id, 'Ich achte auf Anspannung oder Nervosität, wenn ich die Fremdsprache lerne oder benutze.'),
    (part_id, 'Ich schreibe meine Gefühle in mein Lerntagebuch.'),
    (part_id, 'Ich spreche mit anderen über meine Empfindung beim Sprachenlernen.');

  -- German Teil F
  INSERT INTO form_parts(form_id, title) VALUES (form_de_id, 'Teil F – Von anderen lernen')
  RETURNING id INTO part_id;
  INSERT INTO part_questions(form_part_id, title) VALUES 
    (part_id, 'Wenn ich etwas in der Fremdsprache nicht verstehe, bitte ich meine/n Gesprächspartner/in, langsamer zu sprechen oder zu wiederholen.'),
    (part_id, 'Ich bitte Muttersprachler/innen darum, mich zu verbessern, wenn ich spreche.'),
    (part_id, 'Ich praktiziere die Fremdsprache mit anderen Lernenden.'),
    (part_id, 'Ich bitte Muttersprachler/innen um Hilfe.'),
    (part_id, 'Ich stelle Fragen in der Fremdsprache.'),
    (part_id, 'Ich versuche, etwas über die Kultur der Fremdsprache zu lernen.');
END
$$;
