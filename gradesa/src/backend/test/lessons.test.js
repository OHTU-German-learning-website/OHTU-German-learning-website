import { useTestDatabase } from "./testdb";
import { TestFactory } from "./testfactory";
import { describe, it, expect } from "vitest";
import LessonsPage from "@/app/lessons/page";
import ExercisePage from "@/app/lessons/exercises/page";
import { BrowserRouter as Router } from "react-router-dom";
import LessonsLayout from "@/app/lessons/layout";
import { render, fireEvent, screen } from "@testing-library/react";

describe("User", () => {
  useTestDatabase();
  it("should create a user", async () => {
    const user = await TestFactory.user();
    expect(user).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password_hash).toBeDefined();
    expect(user.id).toBe("1");
  });
});

describe("LessonsPage", () => {
  it("should show all tasks when 'mehr anzeigen' is clicked and hid them when 'weniger anzeigen' is clicked", () => {
    render(
      <Router>
        <LessonsPage />
      </Router>
    );

    const showMoreButton = screen.getByText("mehr anzeigen");
    fireEvent.click(showMoreButton);

    const exercise4 = screen.getByText("Übung 4");
    const exercise5 = screen.getByText("Übung 5");
    expect(exercise4).toBeVisible();
    expect(exercise5).toBeVisible();

    const showLessButton = screen.getByText("weniger anzeigen");
    fireEvent.click(showLessButton);

    expect(exercise4).not.toBeVisible();
    expect(exercise5).not.toBeVisible();
  });

  it("should go to exercise page", () => {
    render(
      <Router>
        <LessonsPage />
      </Router>
    );

    const exerciseLink = screen.getByText("Übung 1");
    fireEvent.click(exerciseLink);

    expect(window.location.pathname).toBe("/lessons/exercises");
  });
});
