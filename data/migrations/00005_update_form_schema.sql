
ALTER TABLE forms       ADD COLUMN IF NOT EXISTS public_id         TEXT;
ALTER TABLE forms       ADD COLUMN IF NOT EXISTS title_en          TEXT;
ALTER TABLE forms       ADD COLUMN IF NOT EXISTS title_de          TEXT;
ALTER TABLE forms       ADD COLUMN IF NOT EXISTS description_en    TEXT;
ALTER TABLE forms       ADD COLUMN IF NOT EXISTS description_de    TEXT;

ALTER TABLE form_parts  ADD COLUMN IF NOT EXISTS title_en          TEXT;
ALTER TABLE form_parts  ADD COLUMN IF NOT EXISTS title_de          TEXT;

ALTER TABLE part_questions ADD COLUMN IF NOT EXISTS title_en       TEXT;
ALTER TABLE part_questions ADD COLUMN IF NOT EXISTS title_de       TEXT;

ALTER TABLE forms ALTER COLUMN title DROP NOT NULL;
ALTER TABLE forms ALTER COLUMN description DROP NOT NULL;
ALTER TABLE form_parts ALTER COLUMN title DROP NOT NULL;
ALTER TABLE part_questions ALTER COLUMN title DROP NOT NULL;

ALTER TABLE form_parts ADD COLUMN IF NOT EXISTS step_label TEXT;

DO $$
DECLARE
  new_form_id BIGINT;
  part_id     BIGINT;
BEGIN

  INSERT INTO forms (
    public_id,
    iso_language_code,
    title_en,
    title_de,
    description_en,
    description_de
  )
  VALUES (
    'learning_type',
    'xx',
    E'Discover your learning strategies!',
    E'Entdecke deine Lernstrategien!',
    E'How do you normally learn a second language (SL)? Once you know this, you can choose exercises that are better suited to your learning style.\n'
     || E'Answer the following questions based on what you are actually doing at the moment and not on what you would do if you had more time or better conditions for learning.\n'
     || E'For each question, choose an alternative from 1-5. This is what the numbers mean:\n'
     || E'1. Never or almost never true of me - I never or almost never do this.\n'
     || E'2. Usually not true of me - I don''t do this often.\n'
     || E'3. Somewhat true of me - I sometimes do that.\n'
     || E'4. Usually true of me - I usually do this.\n'
     || E'5. Always or almost always true of me - I almost always do this.',
    E'Wie lernst du normalerweise eine Fremdsprache? Wenn du das weißt, kannst du solche Übungen auswählen, die besser zu deinem Lernstil passen.\n'
     || E'Beantworte die folgenden Fragen ausgehend von dem, was du zur Zeit wirklich machst, und nicht von dem, was du vielleicht gern machen würdest.\n'
     || E'Wähle für jede Frage eine Alternative von 1-5. Das bedeuten die Zahlen:\n'
     || E'1. trifft (fast) nie zu - Das mache ich nie oder fast nie.\n'
     || E'2. trifft selten zu - Das mache ich nicht oft.\n'
     || E'3. trifft mehr oder weniger zu - Das mache ich manchmal.\n'
     || E'4. trifft im Allgemeinen zu - Das mache ich normalerweise.\n'
     || E'5. trifft (fast) immer zu - Das mache ich fast immer.'
  )
  RETURNING id INTO new_form_id;

  INSERT INTO form_parts (form_id, title_en, title_de, step_label)
  VALUES (new_form_id, 'Part A', 'Teil A', 'A')
  RETURNING id INTO part_id;

  INSERT INTO part_questions (form_part_id, title_en, title_de)
  VALUES
    (
      part_id,
      E'I think of relationships between what I already know and new things I learn in the second language (SL).',
      E'Ich versuche immer Verbindungen herzustellen zwischen dem, was ich schon weiß, und dem, was ich in der Fremdsprache kennen lerne.'
    ),
    (
      part_id,
      E'I use new SL words in a sentence so I can remember them.',
      E'Ich benutze neue Wörter in einem Satz, um sie mir besser zu merken.'
    ),
    (
      part_id,
      E'I connect the sound of a new SL word and an image or picture of the word to help me remember the word.',
      E'Ich assoziiere den Klang eines neuen Wortes mit einem Bild, um es mir besser zu merken.'
    ),
    (
      part_id,
      E'I remember a new SL word by making a mental picture of a situation in which the word might be used.',
      E'Ich lerne das Wort, indem ich mir eine Situation vorstelle, in der das Wort benutzt werden könnte.'
    ),
    (
      part_id,
      E'I use rhymes to remember new SL words.',
      E'Ich benutze Reime, um mir Wörter in der Fremdsprache besser zu merken.'
    ),
    (
      part_id,
      E'I use flashcards to remember new SL words.',
      E'Ich benutze Karteikarten, um mir Wörter in der Fremdsprache besser zu merken.'
    ),
    (
      part_id,
      E'I physically act out new SL words.',
      E'Ich stelle neue Wörter in der Fremdsprache mimisch dar, um sie mir besser zu merken.'
    ),
    (
      part_id,
      E'I review SL lessons often.',
      E'Ich wiederhole oft neuen Lernstoff.'
    ),
    (
      part_id,
      E'I remember new SL words or phrases by remembering their location on the page, on the board, or on a street sign.',
      E'Ich merke mir neue Wörter in der Fremdsprache, indem ich mich beim Wiederholen an den Ort erinnere, wo sie waren, z.B. im Heft oder Buch, an der Tafel oder auf einem Straßenschild.'
    );

  INSERT INTO form_parts (form_id, title_en, title_de, step_label)
  VALUES (new_form_id, 'Part B', 'Teil B', 'B')
  RETURNING id INTO part_id;

  INSERT INTO part_questions (form_part_id, title_en, title_de)
  VALUES
    (
      part_id,
      E'I say or write new SL words several times.',
      E'Ich spreche oder schreibe neue Wörter mehrmals.'
    ),
    (
      part_id,
      E'I try to talk like native SL speakers.',
      E'Ich versuche, Muttersprachler nachzumachen.'
    ),
    (
      part_id,
      E'I practice the sounds of SL.',
      E'Ich übe die Laute der Fremdsprache.'
    ),
    (
      part_id,
      E'I use the SL words I know in different ways.',
      E'Ich benutze Wörter, die ich in der Fremdsprache kenne, in verschiedenen Zusammenhängen.'
    ),
    (
      part_id,
      E'I start conversations in the SL.',
      E'Ich fange Gespräche in der Fremdsprache an.'
    ),
    (
      part_id,
      E'I watch SL language TV shows spoken in SL or go to movies spoken in SL.',
      E'Ich schaue mir Fernsehsendungen oder Filme in der Fremdsprache an, ich höre Radio.'
    ),
    (
      part_id,
      E'I read for pleasure in the SL.',
      E'Ich lese zu meinem Vergnügen in der Fremdsprache.'
    ),
    (
      part_id,
      E'I write notes, messages, letters, or reports in the SL.',
      E'Ich schreibe Notizen, Mitteilungen, Briefe oder Berichte in der Fremdsprache.'
    ),
    (
      part_id,
      E'I first skim an SL passage (read over the passage quickly) then go back and read carefully.',
      E'Ich lese einen Text in der Fremdsprache zuerst einmal ganz bis zu Ende durch, um die Hauptaussage zu verstehen, dann fange ich wieder von vorne an und lese ihn aufmerksam durch.'
    ),
    (
      part_id,
      E'I look for words in my own language that are similar to new words in the SL.',
      E'Ich suche nach Ähnlichkeiten zwischen den Wörtern in der Fremdsprache und denen in meiner Muttersprache (oder in einer anderen Fremdsprache).'
    ),
    (
      part_id,
      E'I try to find patterns in the SL.',
      E'Ich versuche, Strukturen in der Fremdsprache zu finden.'
    ),
    (
      part_id,
      E'I find the meaning of an SL word by dividing it into parts that I understand.',
      E'Ich suche die Bedeutung eines Wortes, indem ich es in verschiedene Teile aufteile, die ich verstehe.'
    ),
    (
      part_id,
      E'I try not to translate word for word.',
      E'Ich versuche, nicht wort-wörtlich zu übersetzen.'
    ),
    (
      part_id,
      E'I make summaries of information that I hear or read in the SL.',
      E'Ich mache Zusammenfassungen von Nachrichten, die ich in der Fremdsprache lese bzw. höre.'
    );

  INSERT INTO form_parts (form_id, title_en, title_de, step_label)
  VALUES (new_form_id, 'Part C', 'Teil C', 'C')
  RETURNING id INTO part_id;

  INSERT INTO part_questions (form_part_id, title_en, title_de)
  VALUES
    (
      part_id,
      E'To understand unfamiliar SL words, I make guesses.',
      E'Um unbekannte Wörter in der Fremdsprache zu verstehen, versuche ich ihre Bedeutung zu erraten.'
    ),
    (
      part_id,
      E'When I can''t think of a word during a conversation in the SL, I use gestures.',
      E'Wenn mir ein Wort im Gespräch fehlt, helfe ich mir mit Gesten.'
    ),
    (
      part_id,
      E'I make up new words if I do not know the right ones in the SL.',
      E'Wenn ich die Wörter, die ich in der Fremdsprache brauche, nicht kenne, erfinde ich sie.'
    ),
    (
      part_id,
      E'I read SL without looking up every new word.',
      E'Ich lese in der Fremdsprache, ohne jedes einzelne Wort nachzuschlagen.'
    ),
    (
      part_id,
      E'I try to guess what the other person will say next in the SL.',
      E'In einem Gespräch versuche ich zu erraten, was mein Gesprächspartner sagen wird.'
    ),
    (
      part_id,
      E'If I can''t think of an SL word, I use a word or phrase that means the same thing.',
      E'Wenn ich das passende Wort in der Fremdsprache nicht finde, suche ich nach einem Synonym oder einer Umschreibung.'
    );

  INSERT INTO form_parts (form_id, title_en, title_de, step_label)
  VALUES (new_form_id, 'Part D', 'Teil D', 'D')
  RETURNING id INTO part_id;

  INSERT INTO part_questions (form_part_id, title_en, title_de)
  VALUES
    (
      part_id,
      E'I try to find as many ways as I can to use my SL.',
      E'Ich suche viele Gelegenheiten, um die Fremdsprache zu sprechen.'
    ),
    (
      part_id,
      E'I notice my SL mistakes and use that information to help me do better.',
      E'Ich notiere meine Fehler in der Fremdsprache und versuche, mich zu verbessern.'
    ),
    (
      part_id,
      E'I pay attention when someone is speaking SL.',
      E'Wenn jemand in der Fremdsprache spricht, bin ich besonders aufmerksam.'
    ),
    (
      part_id,
      E'I try to find out how to be a better learner of SL.',
      E'Ich suche Wege, um ein besserer Fremdsprachenlerner zu werden.'
    ),
    (
      part_id,
      E'I plan my schedule so I will have enough time to study SL.',
      E'Ich organisiere meinen Zeitplan so, dass ich Zeit fürs Fremdsprachenlernen habe.'
    ),
    (
      part_id,
      E'I look for people I can talk to in SL.',
      E'Ich suche Leute, mit denen ich die Fremdsprache praktizieren kann.'
    ),
    (
      part_id,
      E'I look for opportunities to read as much as possible in SL.',
      E'Ich suche Gelegenheiten, um in der Fremdsprache zu lesen.'
    ),
    (
      part_id,
      E'I have clear goals for improving my SL skills.',
      E'Ich habe klare Ziele, für die ich meine Kompetenzen in der Fremdsprache verbessere.'
    ),
    (
      part_id,
      E'I think about my progress in learning SL.',
      E'Ich nehme meine Fortschritte in der Fremdsprache wahr.'
    );

  INSERT INTO form_parts (form_id, title_en, title_de, step_label)
  VALUES (new_form_id, 'Part E', 'Teil E', 'E')
  RETURNING id INTO part_id;

  INSERT INTO part_questions (form_part_id, title_en, title_de)
  VALUES
    (
      part_id,
      E'I try to relax whenever I feel afraid of using SL.',
      E'Ich versuche mich zu entspannen, wenn ich Angst habe, die Fremdsprache zu benutzen.'
    ),
    (
      part_id,
      E'I encourage myself to speak SL even when I am afraid of making a mistake.',
      E'Ich mache mir Mut, in der Fremdsprache zu sprechen, wenn ich Angst habe, einen Fehler zu machen.'
    ),
    (
      part_id,
      E'I give myself a reward or treat when I do well in SL.',
      E'Wenn ich beim Fremdsprachenlernen Erfolg habe, gönne ich mir eine Belohnung.'
    ),
    (
      part_id,
      E'I notice if I am tense or nervous when I am studying or using SL.',
      E'Ich achte auf Anspannung oder Nervosität, wenn ich die Fremdsprache lerne oder benutze.'
    ),
    (
      part_id,
      E'I write down my feelings in a language learning diary.',
      E'Ich schreibe meine Gefühle in mein Lerntagebuch.'
    ),
    (
      part_id,
      E'I talk to someone else about how I feel when I am learning SL.',
      E'Ich spreche mit anderen über meine Empfindung beim Sprachenlernen.'
    );

  INSERT INTO form_parts (form_id, title_en, title_de, step_label)
  VALUES (new_form_id, 'Part F', 'Teil F', 'F')
  RETURNING id INTO part_id;

  INSERT INTO part_questions (form_part_id, title_en, title_de)
  VALUES
    (
      part_id,
      E'If I do not understand something in SL, I ask the other person to slow down or say it again.',
      E'Wenn ich etwas in der Fremdsprache nicht verstehe, bitte ich meine/n Gesprächspartner/in, langsamer zu sprechen oder zu wiederholen.'
    ),
    (
      part_id,
      E'I ask SL speakers to correct me when I talk.',
      E'Ich bitte Muttersprachler/innen darum, mich zu verbessern, wenn ich spreche.'
    ),
    (
      part_id,
      E'I practice SL with other students.',
      E'Ich praktiziere die Fremdsprache mit anderen Lernenden.'
    ),
    (
      part_id,
      E'I ask for help from SL speakers.',
      E'Ich bitte Muttersprachler/innen um Hilfe.'
    ),
    (
      part_id,
      E'I ask questions in SL.',
      E'Ich stelle Fragen in der Fremdsprache.'
    ),
    (
      part_id,
      E'I try to learn about the culture of SL speakers.',
      E'Ich versuche, etwas über die Kultur der Fremdsprache zu lernen.'
    );
END $$;


DELETE FROM part_questions WHERE title_en IS NULL;
DELETE FROM form_parts WHERE title_en IS NULL;
DELETE FROM forms WHERE title_en IS NULL;

ALTER TABLE forms DROP COLUMN IF EXISTS iso_language_code;
ALTER TABLE forms DROP COLUMN IF EXISTS title;
ALTER TABLE forms DROP COLUMN IF EXISTS description;

ALTER TABLE form_parts DROP COLUMN IF EXISTS title;
ALTER TABLE part_questions DROP COLUMN IF EXISTS title;

ALTER TABLE forms ADD CONSTRAINT unique_public_id UNIQUE (public_id);
UPDATE forms SET public_id = 'learning_type' WHERE public_id IS NULL;
ALTER TABLE forms ALTER COLUMN public_id SET NOT NULL;

ALTER TABLE form_parts ADD CONSTRAINT unique_step_label UNIQUE (form_id, step_label);
ALTER TABLE form_parts ADD CONSTRAINT check_step_label CHECK (step_label ~ '^[A-Za-z0-9]$');
ALTER TABLE form_parts ALTER COLUMN step_label SET NOT NULL;