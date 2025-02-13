"use client";
import { useState } from "react";
import LessonsLayout from "./layout";

export default function LessonsPage() {
  const [showMoreGrammatik1, setShowMoreGrammatik1] = useState(false);
  const [showMoreGrammatik2, setShowMoreGrammatik2] = useState(false);
  const [showMoreGrammatik3, setShowMoreGrammatik3] = useState(false);
  const [showMoreGrammatik4, setShowMoreGrammatik4] = useState(false);

  const handleShowMoreGrammatik1 = (e) => {
    e.preventDefault();
    setShowMoreGrammatik1(!showMoreGrammatik1);
  };

  const handleShowMoreGrammatik2 = (e) => {
    e.preventDefault();
    setShowMoreGrammatik2(!showMoreGrammatik2);
  };

  const handleShowMoreGrammatik3 = (e) => {
    e.preventDefault();
    setShowMoreGrammatik3(!showMoreGrammatik3);
  };

  const handleShowMoreGrammatik4 = (e) => {
    e.preventDefault();
    setShowMoreGrammatik4(!showMoreGrammatik4);
  };

  return (
    <LessonsLayout>
      <div>
        <h1>Übungen</h1>
        <div className="flex-parent-element">
          <div className="flex-child-element">
            <h2>Grammatik 1</h2>
            <ul>
              <li>Übung 1</li>
              <li>Übung 2</li>
              <li>Übung 3</li>
              {showMoreGrammatik1 && (
                <>
                  <li className="more">Übung 4</li>
                  <li className="more">Übung 5</li>
                </>
              )}
            </ul>
            <div className="show-list">
              <a href="#" id="more" onClick={handleShowMoreGrammatik1}>
                {showMoreGrammatik1 ? "weniger anzeigen" : "mehr anzeigen"}
              </a>
            </div>
          </div>
          <div className="flex-child-element">
            <h2>Grammatik 2</h2>
            <ul>
              <li>Übung 1</li>
              <li>Übung 2</li>
              <li>Übung 3</li>
              {showMoreGrammatik2 && (
                <>
                  <li className="more">Übung 4</li>
                  <li className="more">Übung 5</li>
                </>
              )}
            </ul>
            <div className="show-list">
              <a href="#" id="more" onClick={handleShowMoreGrammatik2}>
                {showMoreGrammatik2 ? "weniger anzeigen" : "mehr anzeigen"}
              </a>
            </div>
          </div>
        </div>
        <div className="flex-parent-element">
          <div className="flex-child-element">
            <h2>Grammatik 3</h2>
            <ul>
              <li>Übung 1</li>
              <li>Übung 2</li>
              <li>Übung 3</li>
              {showMoreGrammatik3 && (
                <>
                  <li className="more">Übung 4</li>
                  <li className="more">Übung 5</li>
                </>
              )}
            </ul>
            <div className="show-list">
              <a href="#" id="more" onClick={handleShowMoreGrammatik3}>
                {showMoreGrammatik3 ? "weniger anzeigen" : "mehr anzeigen"}
              </a>
            </div>
          </div>
          <div className="flex-child-element">
            <h2>Grammatik 4</h2>
            <ul>
              <li>Übung 1</li>
              <li>Übung 2</li>
              <li>Übung 3</li>
              {showMoreGrammatik4 && (
                <>
                  <li className="more">Übung 4</li>
                  <li className="more">Übung 5</li>
                </>
              )}
            </ul>
            <div className="show-list">
              <a href="#" id="more" onClick={handleShowMoreGrammatik4}>
                {showMoreGrammatik4 ? "weniger anzeigen" : "mehr anzeigen"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </LessonsLayout>
  );
}
