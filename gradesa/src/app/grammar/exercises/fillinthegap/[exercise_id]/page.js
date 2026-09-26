"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Column, Row } from "@/components/ui/layout/container";
import parse from "html-react-parser";
import { useRequest } from "@/shared/hooks/useRequest";
import useQuery from "@/shared/hooks/useQuery";
import AdminVisibleLastModified from "@/components/ui/admin-visible-last-modified";
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

// Same block set as normalizeEditorText's BLOCK_BREAK_TAGS (minus "br", handled separately below).
const BLOCK_ANCESTOR_TAGS = new Set([
  "p",
  "div",
  "li",
  "ul",
  "ol",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "tr",
  "table",
]);

function getBlockAncestor(node, root) {
  let el = node.parentNode;
  while (el && el !== root) {
    if (
      el.nodeType === 1 &&
      BLOCK_ANCESTOR_TAGS.has(el.tagName.toLowerCase())
    ) {
      return el;
    }
    el = el.parentNode;
  }
  return root;
}

// Groups text nodes into runs of contiguous prose: only block tags/<br> start a new
// run, so a word split across inline tags (e.g. <strong>) still tokenizes as one word.
function groupTextNodesIntoRuns(doc, root, NodeFilter) {
  const walker = doc.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === 3) return NodeFilter.FILTER_ACCEPT;
        if (node.nodeType === 1 && node.tagName === "BR")
          return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    }
  );

  const runs = [];
  let currentRun = [];
  let currentBlock = null;
  let node;

  while ((node = walker.nextNode())) {
    if (node.nodeType === 1) {
      if (currentRun.length) runs.push(currentRun);
      currentRun = [];
      currentBlock = null;
      continue;
    }

    const block = getBlockAncestor(node, root);
    if (currentRun.length && block === currentBlock) {
      currentRun.push(node);
    } else {
      if (currentRun.length) runs.push(currentRun);
      currentRun = [node];
      currentBlock = block;
    }
  }
  if (currentRun.length) runs.push(currentRun);

  return runs;
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

  const runs = groupTextNodesIntoRuns(doc, root, window.NodeFilter);
  let tokenIndex = 0;

  for (const nodes of runs) {
    // Concatenate the run's text so a word split across inline tags is one token.
    const boundaries = [];
    let offset = 0;
    for (const node of nodes) {
      const length = (node.nodeValue || "").length;
      boundaries.push({ node, start: offset, end: offset + length });
      offset += length;
    }
    const runText = nodes.map((node) => node.nodeValue || "").join("");
    const chunks = runText.match(/\s+|[^\s]+/g) || [];

    const fragments = new Map(
      nodes.map((node) => [node, doc.createDocumentFragment()])
    );
    const appendAt = (absOffset, contentNode) => {
      const boundary =
        boundaries.find((b) => absOffset >= b.start && absOffset < b.end) ||
        boundaries[boundaries.length - 1];
      fragments.get(boundary.node).appendChild(contentNode);
    };

    let cursor = 0;
    for (const chunk of chunks) {
      const chunkStart = cursor;
      cursor += chunk.length;

      if (/^\s+$/.test(chunk)) {
        appendAt(chunkStart, doc.createTextNode(chunk));
        continue;
      }

      const tokenParts = tokenizeRaw(chunk);
      const gap = gapsByTokenIndex.get(tokenIndex);
      let partOffset = chunkStart;

      if (gap && tokenParts.word) {
        if (tokenParts.prefix) {
          appendAt(partOffset, doc.createTextNode(tokenParts.prefix));
          partOffset += tokenParts.prefix.length;
        }

        const gapNode = doc.createElement("fitg-gap");
        gapNode.setAttribute("data-gap-id", String(gap.id));
        appendAt(partOffset, gapNode);
        partOffset += tokenParts.word.length;

        if (tokenParts.suffix) {
          appendAt(partOffset, doc.createTextNode(tokenParts.suffix));
        }
      } else {
        appendAt(chunkStart, doc.createTextNode(chunk));
      }

      if (tokenParts.word) {
        tokenIndex += 1;
      }
    }

    for (const node of nodes) {
      node.parentNode?.replaceChild(fragments.get(node), node);
    }
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
        <AdminVisibleLastModified
          endpoint={`/admin/exercises/fillinthegap/${exercise_id}`}
        />
        <h2>{exercise.title}</h2>
        {exercise.instruction_text && <p>{exercise.instruction_text}</p>}

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
