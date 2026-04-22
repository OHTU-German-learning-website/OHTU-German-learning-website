"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Column, Row } from "@/components/ui/layout/container";
import parse from "html-react-parser";
import { useRequest } from "@/shared/hooks/useRequest";
import useQuery from "@/shared/hooks/useQuery";
import "../fillinthegap.css";

function tokenizeText(text) {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((raw) => {
      const match = raw.match(
        /^([^\p{L}\p{N}]*)((?:[\p{L}\p{N}][\p{L}\p{N}'-]*)?)([^\p{L}\p{N}]*)$/u
      );
      return {
        raw,
        prefix: match?.[1] || "",
        word: match?.[2] || "",
        suffix: match?.[3] || "",
      };
    });
}

function tokenizeRaw(raw) {
  const match = raw.match(
    /^([^\p{L}\p{N}]*)((?:[\p{L}\p{N}][\p{L}\p{N}'-]*)?)([^\p{L}\p{N}]*)$/u
  );
  return {
    prefix: match?.[1] || "",
    word: match?.[2] || "",
    suffix: match?.[3] || "",
  };
}

function buildHtmlWithGapPlaceholders(sourceHtml, gapsByTokenIndex) {
  if (!sourceHtml || typeof window === "undefined") {
    return "";
  }

  const doc = new window.DOMParser().parseFromString(
    `<div id="fitg-root">${sourceHtml}</div>`,
    "text/html"
  );
  const root = doc.getElementById("fitg-root");

  if (!root) {
    return sourceHtml;
  }

  const walker = doc.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let current;

  while ((current = walker.nextNode())) {
    textNodes.push(current);
  }

  let tokenIndex = 0;

  for (const textNode of textNodes) {
    const rawText = textNode.nodeValue || "";
    const chunks = rawText.match(/\s+|[^\s]+/g) || [];
    const fragment = doc.createDocumentFragment();

    for (const chunk of chunks) {
      if (/^\s+$/.test(chunk)) {
        fragment.appendChild(doc.createTextNode(chunk));
        continue;
      }

      const tokenParts = tokenizeRaw(chunk);
      const gap = gapsByTokenIndex.get(tokenIndex);

      if (gap && tokenParts.word) {
        if (tokenParts.prefix) {
          fragment.appendChild(doc.createTextNode(tokenParts.prefix));
        }

        const gapNode = doc.createElement("fitg-gap");
        gapNode.setAttribute("data-gap-id", String(gap.id));
        fragment.appendChild(gapNode);

        if (tokenParts.suffix) {
          fragment.appendChild(doc.createTextNode(tokenParts.suffix));
        }
      } else {
        fragment.appendChild(doc.createTextNode(chunk));
      }

      tokenIndex += 1;
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  }

  return root.innerHTML;
}

export default function FillInTheGapExercisePage() {
  const { exercise_id } = useParams();
  const makeRequest = useRequest();
  const [answers, setAnswers] = useState({});
  const [resultByGap, setResultByGap] = useState({});
  const [summary, setSummary] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const {
    data: exercise,
    isLoading,
    error,
  } = useQuery(`/exercises/fillinthegap/${exercise_id}`);

  const tokens = useMemo(
    () => tokenizeText(exercise?.source_text || ""),
    [exercise?.source_text]
  );

  const gapsByTokenIndex = useMemo(() => {
    const map = new Map();
    for (const gap of exercise?.gaps || []) {
      map.set(Number(gap.token_index), gap);
    }
    return map;
  }, [exercise?.gaps]);

  // const htmlWithPlaceholders = useMemo(
  //   () =>
  //     buildHtmlWithGapPlaceholders(
  //       exercise?.source_html || "",
  //       gapsByTokenIndex
  //     ),
  //   [exercise?.source_html, gapsByTokenIndex]
  // );
  
const htmlWithPlaceholders = useMemo(() => {
  const html = buildHtmlWithGapPlaceholders(
    exercise?.source_html || "",
    gapsByTokenIndex
  );

  return html
    .replace(/color:\s*rgb\(0,\s*0,\s*0\)\s*;?/gi, "")
    .replace(/color:\s*#000000\s*;?/gi, "")
    .replace(/color:\s*black\s*;?/gi, "");
}, [exercise?.source_html, gapsByTokenIndex]);

  const handleAnswerChange = (gapId, value) => {
    setAnswers((current) => ({
      ...current,
      [gapId]: value,
    }));
  };

  const submitAnswers = async () => {
    setSubmitError("");

    const payload = {
      answers: (exercise?.gaps || []).map((gap) => ({
        gapId: gap.id,
        answer: answers[gap.id] || "",
      })),
    };

    try {
      const response = await makeRequest(
        `/exercises/fillinthegap/${exercise_id}/answers`,
        payload
      );

      const map = {};
      for (const result of response.data.results || []) {
        map[String(result.gapId)] = result;
      }
      setResultByGap(map);
      setSummary({
        correctCount: response.data.correctCount,
        total: response.data.total,
      });
    } catch (requestError) {
      setSubmitError(requestError.message);
    }
  };

  if (isLoading) {
    return (
      <Container display="flex" justify="center" align="center" h="200px">
        Lädt...
      </Container>
    );
  }

  if (error) {
    return (
      <Container p="md" bg="var(--tertiary1)" mb="md" br="md">
        Fehler: {error.message}
      </Container>
    );
  }

  if (!exercise) {
    return null;
  }

  return (
    <Container maxW="900px" m="0 auto" p="md">
      <Column gap="md">
        <h1>{exercise.title}</h1>

        {!!exercise.source_html && (
          <Container
            p="md"
            bg="var(--bg2)"
            br="md"
            className="fitg-source-html"
          >
            <div className="ql-editor rendered-html fitg-rendered-content">
              {parse(htmlWithPlaceholders, {
                replace(domNode) {
                  if (
                    domNode?.type === "tag" &&
                    domNode.name === "fitg-gap" &&
                    domNode.attribs?.["data-gap-id"]
                  ) {
                    const gapId = domNode.attribs["data-gap-id"];
                    return (
                      <input
                        className="fitg-student-input"
                        value={answers[String(gapId)] || ""}
                        onChange={(event) =>
                          handleAnswerChange(String(gapId), event.target.value)
                        }
                        placeholder="..."
                      />
                    );
                  }
                  return undefined;
                },
              })}
            </div>
          </Container>
        )}

        {!exercise.source_html && (
          <Container p="md" bg="var(--bg2)" br="md">
            <div className="fitg-student-flow">
              {tokens.map((token, index) => {
                const gap = gapsByTokenIndex.get(index);

                if (!gap) {
                  return (
                    <span
                      key={`${index}-${token.raw}`}
                      className="fitg-student-token"
                    >
                      {token.raw}
                    </span>
                  );
                }

                return (
                  <span
                    key={`${index}-${token.raw}`}
                    className="fitg-student-token"
                  >
                    {token.prefix}
                    <input
                      className="fitg-student-input"
                      value={answers[String(gap.id)] || ""}
                      onChange={(event) =>
                        handleAnswerChange(String(gap.id), event.target.value)
                      }
                      placeholder="..."
                    />
                    {token.suffix}
                  </span>
                );
              })}
            </div>
          </Container>
        )}

        <Row gap="md" wrap="wrap">
          <Button type="button" onClick={submitAnswers}>
            Antworten prüfen
          </Button>
          <Link href="/grammar/exercises/fillinthegap">
            Zurück zur Übungsliste
          </Link>
        </Row>

        {summary && (
          <Container p="md" bg="var(--bg2)" br="md">
            Ergebnis: {summary.correctCount} von {summary.total} korrekt
          </Container>
        )}

        {!!submitError && (
          <Container p="md" bg="var(--tertiary1)" br="md">
            {submitError}
          </Container>
        )}

        {exercise.gaps?.length > 0 && (
          <Column gap="sm">
            <h3>Feedback pro Lücke</h3>
            {exercise.gaps.map((gap, index) => {
              const result = resultByGap[String(gap.id)];
              if (!result) {
                return null;
              }

              return (
                <Container
                  key={gap.id}
                  p="sm"
                  br="md"
                  bg={result.isCorrect ? "var(--green1)" : "var(--tertiary1)"}
                >
                  <strong>Lücke {index + 1} : </strong>
                  {result.feedback}
                </Container>
              );
            })}
          </Column>
        )}
      </Column>
    </Container>
  );
}

//({gap.token_text})
