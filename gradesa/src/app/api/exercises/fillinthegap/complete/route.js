import { NextResponse } from "next/server";
import logger from "@/lib/logger";
import { saveUserAnswers } from "@/lib/db";

export async function POST(request, { params }) {
  const { exerciseId } = params;
  const { userId, userAnswers } = await request.json();

  if (!exerciseId || !userId || !userAnswers) {
    logger.error(
      "Fehlende Angaben für Übung %s, Nutzer %s",
      exerciseId,
      userId
    );
    return NextResponse.json({ error: "Fehlende Angaben" }, { status: 400 });
  }

  try {
    await saveUserAnswers(exerciseId, userId, userAnswers);
    logger.info(
      "Antworten erfolgreich gespeichert für Übung %s, Nutzer %s",
      exerciseId,
      userId
    );
    return NextResponse.json(
      { message: "Antworten erfolgreich gespeichert" },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      "Fehler beim Speichern der Antworten für Übung %s: %O",
      exerciseId,
      error
    );
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen" },
      { status: 500 }
    );
  }
}
