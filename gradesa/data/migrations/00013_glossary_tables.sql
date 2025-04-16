CREATE TABLE IF NOT EXISTS glossary_entries (
    id bigint PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    word TEXT NOT NULL,
    word_definition TEXT NOT NULL
);

CREATE TRIGGER update_glossary_entries_updated_at

BEFORE UPDATE ON glossary_entries
FOR EACH ROW
EXECUTE FUNCTION updated_at();