"use client";

import { chapters } from "./[chapter]/page";
import Link from "next/link";
import "@/app/grammar/themes/lessons.css";

export default function Chapter() {
  return (
    <div className="themes-title">
      <h1>Kommunikationssituationen</h1>
      <div className="lessons-container">
        {chapters.map((chapter) => (
          <div className="flex-parent-element" key={chapter.id}>
            <div className="flex-child-element">
              <Link href={chapter.link}>{chapter.title}</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
