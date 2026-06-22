import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../button";
import { Container } from "../layout/container";
import { Column } from "@/components/ui/layout/container";
import parse from "html-react-parser";
import "./click.css";

const WORD_REGEX = /\p{L}+(?:['’-]\p{L}+)*/gu;
const GROUP_DELIMITER = "::";

const parseTargetEntry = (entry) => {
  if (typeof entry !== "string" || !entry) {
    return null;
  }

  const delimiterIndex = entry.indexOf(GROUP_DELIMITER);
  if (delimiterIndex > 0) {
    return {
      raw: entry,
      groupId: entry.slice(0, delimiterIndex),
      slotKey: entry.slice(delimiterIndex + GROUP_DELIMITER.length),
    };
  }

  return {
    raw: entry,
    groupId: null,
    slotKey: entry,
  };
};

// Split one raw token into parts. All word parts become clickable, punctuation/text does not.
const splitTokenToParts = (token) => {
  const matches = [...token.matchAll(WORD_REGEX)];
  if (matches.length === 0) {
    return [{ type: "text", value: token }];
  }

  const parts = [];
  let cursor = 0;

  matches.forEach((match) => {
    const start = match.index;
    const word = match[0];
    const end = start + word.length;

    if (start > cursor) {
      parts.push({ type: "text", value: token.slice(cursor, start) });
    }

    parts.push({ type: "word", value: word });
    cursor = end;
  });

  if (cursor < token.length) {
    parts.push({ type: "text", value: token.slice(cursor) });
  }

  return parts;
};

const isWhitespaceToken = (token) => /^[^\S\n]+$/u.test(token);

function buildHtmlWithWordSlots(sourceHtml) {
  if (!sourceHtml || typeof window === "undefined") {
    return { html: "", slots: [] };
  }

  const doc = new window.DOMParser().parseFromString(
    `<div id="click-root">${sourceHtml}</div>`,
    "text/html"
  );
  const root = doc.getElementById("click-root");

  if (!root) {
    return { html: "", slots: [] };
  }

  const walker = doc.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let current;

  while ((current = walker.nextNode())) {
    textNodes.push(current);
  }

  let wordIndex = 0;
  const slots = [];

  for (const textNode of textNodes) {
    const rawText = textNode.nodeValue || "";
    const chunks = rawText.match(/\s+|[^\s]+/g) || [];
    const fragment = doc.createDocumentFragment();

    for (const chunk of chunks) {
      if (/^\s+$/.test(chunk)) {
        fragment.appendChild(doc.createTextNode(chunk));
        continue;
      }

      const parts = splitTokenToParts(chunk);
      for (const part of parts) {
        if (part.type === "word") {
          const slotKey = `w-${wordIndex}`;
          const wordNode = doc.createElement("click-word");

          wordNode.setAttribute("data-slot-key", slotKey);
          wordNode.setAttribute("data-word", part.value);
          wordNode.textContent = part.value;

          slots.push({
            slotKey,
            word: part.value,
          });
          wordIndex += 1;
          fragment.appendChild(wordNode);
        } else {
          fragment.appendChild(doc.createTextNode(part.value));
        }
      }
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  }

  return { html: root.innerHTML, slots };
}

function buildHtmlWithWordSlotsAndGroups(sourceHtml, groupedTargetsById) {
  const { html, slots } = buildHtmlWithWordSlots(sourceHtml);
  if (!html || typeof window === "undefined") {
    return { html, slots };
  }

  if (!groupedTargetsById || groupedTargetsById.size === 0) {
    return { html, slots };
  }

  const doc = new window.DOMParser().parseFromString(
    `<div id="click-root">${html}</div>`,
    "text/html"
  );
  const root = doc.getElementById("click-root");

  if (!root) {
    return { html, slots };
  }

  const slotIndexMap = new Map(
    slots.map((slot, index) => [slot.slotKey, index])
  );
  const wordNodeBySlotKey = new Map();
  root.querySelectorAll("click-word").forEach((node) => {
    const slotKey = node.getAttribute("data-slot-key");
    if (slotKey) {
      wordNodeBySlotKey.set(slotKey, node);
    }
  });

  const groups = [...groupedTargetsById.entries()]
    .map(([groupId, keys]) => ({
      groupId,
      slotKeys: [...keys].sort(
        (a, b) =>
          (slotIndexMap.get(a) ?? Number.MAX_SAFE_INTEGER) -
          (slotIndexMap.get(b) ?? Number.MAX_SAFE_INTEGER)
      ),
    }))
    .sort(
      (a, b) =>
        (slotIndexMap.get(a.slotKeys[0]) ?? Number.MAX_SAFE_INTEGER) -
        (slotIndexMap.get(b.slotKeys[0]) ?? Number.MAX_SAFE_INTEGER)
    )
    .reverse();

  groups.forEach(({ groupId, slotKeys }) => {
    if (slotKeys.length < 2) {
      return;
    }

    const firstNode = wordNodeBySlotKey.get(slotKeys[0]);
    const lastNode = wordNodeBySlotKey.get(slotKeys[slotKeys.length - 1]);
    if (!firstNode || !lastNode) {
      return;
    }

    if (!firstNode.parentNode || firstNode.parentNode !== lastNode.parentNode) {
      return;
    }

    const parentNode = firstNode.parentNode;
    const allWordNodesInRange = [];
    let cursor = firstNode;
    while (cursor) {
      if (cursor.nodeType === 1 && cursor.nodeName === "CLICK-WORD") {
        allWordNodesInRange.push(cursor);
      }
      if (cursor === lastNode) {
        break;
      }
      cursor = cursor.nextSibling;
    }

    const rangeSlotKeys = allWordNodesInRange
      .map((node) => node.getAttribute("data-slot-key"))
      .filter(Boolean);
    if (rangeSlotKeys.length !== slotKeys.length) {
      return;
    }
    if (!slotKeys.every((key, idx) => key === rangeSlotKeys[idx])) {
      return;
    }

    const groupText = slotKeys
      .map(
        (slotKey) => slots.find((slot) => slot.slotKey === slotKey)?.word || ""
      )
      .join(" ")
      .trim();

    const groupNode = doc.createElement("click-group");
    groupNode.setAttribute("data-group-id", groupId);
    groupNode.setAttribute("data-slot-keys", slotKeys.join(" "));
    groupNode.setAttribute("data-group-text", groupText);
    groupNode.textContent = groupText;

    parentNode.insertBefore(groupNode, firstNode);

    let removeCursor = firstNode;
    while (removeCursor) {
      const next = removeCursor.nextSibling;
      removeCursor.remove();
      if (removeCursor === lastNode) {
        break;
      }
      removeCursor = next;
    }
  });

  return { html: root.innerHTML, slots };
}

const orderSlotKeys = (slotKeys, wordSlots) => {
  const slotIndexMap = new Map(
    wordSlots.map((slot, index) => [slot.slotKey, index])
  );
  return [...slotKeys].sort(
    (left, right) =>
      (slotIndexMap.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (slotIndexMap.get(right) ?? Number.MAX_SAFE_INTEGER)
  );
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const toGroupedTargets = (slotKeys, wordSlots) => {
  const ordered = orderSlotKeys(unique(slotKeys), wordSlots);
  const slotIndexMap = new Map(
    wordSlots.map((slot, index) => [slot.slotKey, index])
  );
  const chunks = [];

  ordered.forEach((slotKey) => {
    const index = slotIndexMap.get(slotKey);
    if (chunks.length === 0) {
      chunks.push([slotKey]);
      return;
    }

    const previousChunk = chunks[chunks.length - 1];
    const previousIndex = slotIndexMap.get(
      previousChunk[previousChunk.length - 1]
    );

    if (index != null && previousIndex != null && index === previousIndex + 1) {
      previousChunk.push(slotKey);
    } else {
      chunks.push([slotKey]);
    }
  });

  return chunks.flatMap((chunk, chunkIndex) => {
    if (chunk.length <= 1) {
      return chunk;
    }

    const groupId = `group-${Date.now()}-${chunkIndex}`;
    return chunk.map((slotKey) => `${groupId}${GROUP_DELIMITER}${slotKey}`);
  });
};

const WordSelectionExercise = ({
  title,
  targetCategory,
  targetWords,
  allWords,
  sourceHtml,
  previousAnswers,
  onSelectionChange,
  previewSelectionKeys,
  onPreviewSelectionChange,
  previewGroupAdjacentSelection = true,
  onSubmit,
  isPreviewMode = false,
  isSubmitted,
  setIsSubmitted,
  feedback,
}) => {
  // Track selected word segments so each occurrence is independent,
  // even when one token contains multiple words.
  const [selectedSlotKeys, setSelectedSlotKeys] = useState([]);
  const [message, setMessage] = useState("");

  const normalizedSourceHtml = useMemo(() => {
    return String(sourceHtml || "");
  }, [sourceHtml]);

  const rawTargetEntries = useMemo(
    () =>
      Array.isArray(targetWords)
        ? targetWords.map(parseTargetEntry).filter(Boolean)
        : [],
    [targetWords]
  );

  const groupedTargetsById = useMemo(() => {
    const grouped = new Map();
    rawTargetEntries.forEach((entry) => {
      if (!entry.groupId) return;
      if (!grouped.has(entry.groupId)) grouped.set(entry.groupId, []);
      grouped.get(entry.groupId).push(entry.slotKey);
    });
    return grouped;
  }, [rawTargetEntries]);

  const htmlSlotsData = useMemo(
    () =>
      buildHtmlWithWordSlotsAndGroups(normalizedSourceHtml, groupedTargetsById),
    [normalizedSourceHtml, groupedTargetsById]
  );

  const fallbackWordSlots = useMemo(() => {
    const slots = [];

    allWords?.forEach((token, tokenIndex) => {
      if (token === "\n" || isWhitespaceToken(token)) return;

      const parts = splitTokenToParts(token);
      parts.forEach((part, partIndex) => {
        if (part.type !== "word") return;

        slots.push({
          slotKey: `${tokenIndex}-${partIndex}`,
          word: part.value,
        });
      });
    });

    return slots;
  }, [allWords]);

  const wordSlots = useMemo(
    () =>
      htmlSlotsData.slots.length > 0 ? htmlSlotsData.slots : fallbackWordSlots,
    [htmlSlotsData.slots, fallbackWordSlots]
  );

  const slotToWord = useMemo(
    () =>
      Object.fromEntries(wordSlots.map(({ slotKey, word }) => [slotKey, word])),
    [wordSlots]
  );

  const targetSlotKeys = useMemo(() => {
    const slotKeySet = new Set(wordSlots.map(({ slotKey }) => slotKey));
    const directSlotKeys = [];
    const neededLegacyWords = {};

    rawTargetEntries.forEach((entry) => {
      if (slotKeySet.has(entry.slotKey)) {
        directSlotKeys.push(entry.slotKey);
        return;
      }

      neededLegacyWords[entry.slotKey] =
        (neededLegacyWords[entry.slotKey] || 0) + 1;
    });

    const consumedByWord = {};
    directSlotKeys.forEach((slotKey) => {
      const word = slotToWord[slotKey];
      if (!word) return;
      consumedByWord[word] = (consumedByWord[word] || 0) + 1;
    });

    const mappedLegacyKeys = [];
    wordSlots.forEach(({ slotKey, word }) => {
      const required = neededLegacyWords[word] || 0;
      const alreadyConsumed = consumedByWord[word] || 0;

      if (required > alreadyConsumed) {
        mappedLegacyKeys.push(slotKey);
        consumedByWord[word] = alreadyConsumed + 1;
      }
    });

    return unique([...directSlotKeys, ...mappedLegacyKeys]);
  }, [rawTargetEntries, wordSlots, slotToWord]);

  const groupedSlotKeyToGroupId = useMemo(() => {
    const map = new Map();
    groupedTargetsById.forEach((slotKeys, groupId) => {
      slotKeys.forEach((slotKey) => map.set(slotKey, groupId));
    });
    return map;
  }, [groupedTargetsById]);

  const resolveTargetGroup = (slotKey) => {
    const groupId = groupedSlotKeyToGroupId.get(slotKey);
    if (!groupId) return [slotKey];
    return groupedTargetsById.get(groupId) || [slotKey];
  };

  const usesSlotKeyTargets = useMemo(() => {
    const rawTargets = Array.isArray(targetWords) ? targetWords : [];
    const slotKeySet = new Set(wordSlots.map(({ slotKey }) => slotKey));
    const allAreSlotKeys =
      rawTargets.length > 0 &&
      rawTargets.every((target) => slotKeySet.has(target));
    return allAreSlotKeys;
  }, [targetWords, wordSlots]);

  const targetSlotKeySet = useMemo(
    () => new Set(targetSlotKeys),
    [targetSlotKeys]
  );

  const isControlledPreview =
    isPreviewMode &&
    Array.isArray(previewSelectionKeys) &&
    typeof onPreviewSelectionChange === "function";

  const previewSelection = isControlledPreview
    ? previewSelectionKeys
    : selectedSlotKeys;

  useEffect(() => {
    if (!isControlledPreview && isPreviewMode && targetSlotKeys.length > 0) {
      setSelectedSlotKeys(orderSlotKeys(targetSlotKeys, wordSlots));
    }
  }, [targetSlotKeys, isPreviewMode, wordSlots, isControlledPreview]);

  const displayedSelectedSet = useMemo(() => {
    if (!isPreviewMode) {
      return new Set(selectedSlotKeys);
    }

    return new Set([...targetSlotKeys, ...previewSelection]);
  }, [isPreviewMode, selectedSlotKeys, targetSlotKeys, previewSelection]);

  const handleWordClick = (slotKey) => {
    if (isSubmitted && !isPreviewMode) return;

    if (isControlledPreview) {
      const current = Array.isArray(previewSelectionKeys)
        ? previewSelectionKeys
        : [];
      const next = current.includes(slotKey)
        ? current.filter((key) => key !== slotKey)
        : [...current, slotKey];
      onPreviewSelectionChange(orderSlotKeys(next, wordSlots));
      return;
    }

    const scopeSlots = isPreviewMode ? [slotKey] : resolveTargetGroup(slotKey);

    let updatedKeys;
    const allSelected = scopeSlots.every((key) =>
      selectedSlotKeys.includes(key)
    );

    if (allSelected) {
      updatedKeys = selectedSlotKeys.filter((key) => !scopeSlots.includes(key));
    } else {
      updatedKeys = [
        ...selectedSlotKeys,
        ...scopeSlots.filter((key) => !selectedSlotKeys.includes(key)),
      ];
    }

    const orderedKeys = orderSlotKeys(updatedKeys, wordSlots);
    setSelectedSlotKeys(orderedKeys);

    if (isPreviewMode && onSelectionChange) {
      let previewPayload;
      if (previewGroupAdjacentSelection) {
        previewPayload = toGroupedTargets(orderedKeys, wordSlots);
      } else if (rawTargetEntries.some((entry) => entry.groupId)) {
        const selectedSet = new Set(orderedKeys);
        const preserved = rawTargetEntries.filter((entry) =>
          selectedSet.has(entry.slotKey)
        );
        const consumed = new Set(preserved.map((entry) => entry.slotKey));
        const additions = orderedKeys.filter(
          (slotKey) => !consumed.has(slotKey)
        );
        previewPayload = [...preserved.map((entry) => entry.raw), ...additions];
      } else {
        previewPayload = orderedKeys;
      }
      onSelectionChange(previewPayload);
    }
  };

  const handleGroupClick = (slotKeys) => {
    if (isSubmitted && !isPreviewMode) return;

    if (isControlledPreview) {
      const current = Array.isArray(previewSelectionKeys)
        ? previewSelectionKeys
        : [];
      const allSelected = slotKeys.every((slotKey) =>
        current.includes(slotKey)
      );
      const next = allSelected
        ? current.filter((slotKey) => !slotKeys.includes(slotKey))
        : [
            ...current,
            ...slotKeys.filter((slotKey) => !current.includes(slotKey)),
          ];
      onPreviewSelectionChange(orderSlotKeys(next, wordSlots));
      return;
    }

    const allSelected = slotKeys.every((slotKey) =>
      selectedSlotKeys.includes(slotKey)
    );
    const next = allSelected
      ? selectedSlotKeys.filter((slotKey) => !slotKeys.includes(slotKey))
      : [
          ...selectedSlotKeys,
          ...slotKeys.filter((slotKey) => !selectedSlotKeys.includes(slotKey)),
        ];

    const orderedKeys = orderSlotKeys(next, wordSlots);
    setSelectedSlotKeys(orderedKeys);

    if (isPreviewMode && onSelectionChange) {
      let previewPayload;
      if (previewGroupAdjacentSelection) {
        previewPayload = toGroupedTargets(orderedKeys, wordSlots);
      } else if (rawTargetEntries.some((entry) => entry.groupId)) {
        const selectedSet = new Set(orderedKeys);
        const preserved = rawTargetEntries.filter((entry) =>
          selectedSet.has(entry.slotKey)
        );
        const consumed = new Set(preserved.map((entry) => entry.slotKey));
        const additions = orderedKeys.filter(
          (slotKey) => !consumed.has(slotKey)
        );
        previewPayload = [...preserved.map((entry) => entry.raw), ...additions];
      } else {
        previewPayload = orderedKeys;
      }
      onSelectionChange(previewPayload);
    }
  };

  const checkAnswers = () => {
    if (isPreviewMode) return;

    const selectedSet = new Set(selectedSlotKeys);
    const incorrectSelections = selectedSlotKeys.filter(
      (slotKey) => !targetSlotKeySet.has(slotKey)
    );
    const missedCorrectAnswers = targetSlotKeys.filter(
      (slotKey) => !selectedSet.has(slotKey)
    );
    const totalCorrectTargets = targetSlotKeys.length;

    if (totalCorrectTargets === 0) {
      onSubmit([], 0, "Diese Übung enthält keine markierten Zielwörter.");
      return;
    }

    const score = Math.round(
      ((totalCorrectTargets -
        missedCorrectAnswers.length -
        incorrectSelections.length) /
        totalCorrectTargets) *
        100
    );

    let feedbackMessage = "";
    if (score === 100) {
      feedbackMessage =
        "Perfekt! Du hast alle " + targetCategory + " korrekt identifiziert!";
    } else if (score >= 90) {
      feedbackMessage = "Fast Perfekt! Punktzahl: " + score + "%";
    } else if (score >= 50) {
      feedbackMessage = "Gut gemacht! Punktzahl: " + score + "%";
    } else {
      feedbackMessage = "Weiter üben! Punktzahl: " + score + "%";
    }

    let selectedPayload;
    if (rawTargetEntries.some((entry) => entry.groupId)) {
      const selectedSet = new Set(selectedSlotKeys);
      const selectedWordCounts = {};
      [...selectedSet].forEach((slotKey) => {
        const word = slotToWord[slotKey];
        if (!word) return;
        selectedWordCounts[word] = (selectedWordCounts[word] || 0) + 1;
      });

      selectedPayload = rawTargetEntries
        .filter((entry) => {
          if (targetSlotKeySet.has(entry.slotKey)) {
            return selectedSet.has(entry.slotKey);
          }

          const remaining = selectedWordCounts[entry.slotKey] || 0;
          if (remaining <= 0) return false;
          selectedWordCounts[entry.slotKey] = remaining - 1;
          return true;
        })
        .map((entry) => entry.raw);
    } else {
      selectedPayload = usesSlotKeyTargets
        ? selectedSlotKeys
        : selectedSlotKeys.map((key) => slotToWord[key]).filter(Boolean);
    }

    onSubmit(selectedPayload, score, feedbackMessage);
  };

  const resetExercise = () => {
    setSelectedSlotKeys([]);
    setIsSubmitted(false);
    setMessage("");
  };

  const restorePreviousAnswers = () => {
    if (!previousAnswers || previousAnswers.length === 0) {
      setMessage("Keine vorherigen Antworten vorhanden.");
      return;
    }

    const availableSlotKeys = new Set(wordSlots.map(({ slotKey }) => slotKey));
    const previousAreSlotKeys = previousAnswers.every((answer) =>
      availableSlotKeys.has(answer)
    );

    let restoredKeys = [];

    if (previousAreSlotKeys) {
      restoredKeys = previousAnswers.filter((answer) =>
        availableSlotKeys.has(answer)
      );
    } else {
      const needed = {};
      previousAnswers.forEach((word) => {
        needed[word] = (needed[word] || 0) + 1;
      });

      const used = {};
      wordSlots.forEach(({ slotKey, word }) => {
        const remaining = (needed[word] || 0) - (used[word] || 0);
        if (remaining > 0) {
          restoredKeys.push(slotKey);
          used[word] = (used[word] || 0) + 1;
        }
      });
    }

    setSelectedSlotKeys(restoredKeys);
  };

  const getTokenStyle = (_word, slotKey) => {
    if (displayedSelectedSet.has(slotKey)) {
      if (isSubmitted && !isPreviewMode) {
        return targetSlotKeySet.has(slotKey)
          ? { backgroundColor: "var(--green)" }
          : { backgroundColor: "var(--red)" };
      }

      return { backgroundColor: "var(--click-selected-bg, var(--blue))" };
    }

    if (isSubmitted && targetSlotKeySet.has(slotKey) && !isPreviewMode) {
      return {
        backgroundColor: "var(--click-missed-bg, var(--yellow))",
        border: "1px solid var(--click-missed-border, var(--yellow-border))",
      };
    }

    return undefined;
  };

  const renderToken = (token, tokenIndex) => {
    if (token === "\n") {
      return <br key={`${tokenIndex}-nl`} />;
    }

    if (isWhitespaceToken(token)) {
      return (
        <span key={`${tokenIndex}-ws`} className="word-space">
          {token}
        </span>
      );
    }

    const parts = splitTokenToParts(token);

    return parts.map((part, partIndex) => {
      const slotKey = `${tokenIndex}-${partIndex}`;

      if (part.type === "word") {
        return (
          <Button
            key={slotKey}
            onClick={() => handleWordClick(slotKey)}
            variant="click"
            style={getTokenStyle(part.value, slotKey)}
          >
            {part.value}
          </Button>
        );
      }

      return (
        <span key={slotKey} className="word-punct">
          {part.value}
        </span>
      );
    });
  };

  return (
    <Column gap="md">
      <h1>{title}</h1>
      <div className="click-instruction">
        <i>{`Wähle alle ${targetCategory} aus dem untenstehenden Text aus.`}</i>
      </div>
      {htmlSlotsData.slots.length > 0 ? (
        <Container className="word-container click-source-html">
          <div className="rendered-html click-rendered-content">
            {parse(htmlSlotsData.html, {
              replace(domNode) {
                if (
                  domNode?.type === "tag" &&
                  domNode.name === "click-group" &&
                  domNode.attribs?.["data-group-id"]
                ) {
                  const groupId = domNode.attribs["data-group-id"];
                  const groupSlotKeys = String(
                    domNode.attribs?.["data-slot-keys"] || ""
                  )
                    .split(/\s+/)
                    .filter(Boolean);
                  const groupText = domNode.attribs?.["data-group-text"] || "";
                  const firstSlot = groupSlotKeys[0];

                  return (
                    <Button
                      key={groupId}
                      onClick={() => handleGroupClick(groupSlotKeys)}
                      variant="click"
                      style={getTokenStyle(groupText, firstSlot)}
                    >
                      {groupText}
                    </Button>
                  );
                }

                if (
                  domNode?.type === "tag" &&
                  domNode.name === "click-word" &&
                  domNode.attribs?.["data-slot-key"]
                ) {
                  const slotKey = domNode.attribs["data-slot-key"];
                  const word = domNode.attribs["data-word"] || "";

                  return (
                    <Button
                      key={slotKey}
                      onClick={() => handleWordClick(slotKey)}
                      variant="click"
                      style={getTokenStyle(word, slotKey)}
                    >
                      {word}
                    </Button>
                  );
                }
                return undefined;
              },
            })}
          </div>
        </Container>
      ) : (
        <Container className="word-container">
          {allWords?.map((token, index) => (
            <React.Fragment key={index}>
              {renderToken(token, index)}
            </React.Fragment>
          ))}
        </Container>
      )}
      {feedback && !isPreviewMode && (
        <>
          <div>{feedback}</div>
          <br />
        </>
      )}

      <Container className="message">
        {message && (
          <div style={{ backgroundColor: "var(--blue)" }}>{message}</div>
        )}
      </Container>

      <div>
        {!isSubmitted && !isPreviewMode ? (
          <Button size="sm" width="fit" onClick={checkAnswers}>
            Antworten überprüfen
          </Button>
        ) : (
          !isPreviewMode && (
            <Button size="sm" onClick={resetExercise}>
              Erneut versuchen
            </Button>
          )
        )}
      </div>

      <div>
        {!isPreviewMode && (
          <Button size="sm" width="fit" onClick={restorePreviousAnswers}>
            Vorherige Antworten ansehen/bearbeiten
          </Button>
        )}
      </div>
    </Column>
  );
};

export default WordSelectionExercise;
