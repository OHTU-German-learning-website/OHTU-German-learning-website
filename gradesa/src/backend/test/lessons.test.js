import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, it, expect, vi } from "vitest";
import LessonsPage from "../../app/lessons/page";
import { render } from "@testing-library/react";
import mockRouter from "next/router";

vi.mock("../../app/lessons/page", () => ({
  default: LessonsPage,
}));
q;
describe("GET /lessons/page", () => {
  let response;
  let body;

  vi.setup(() => {
    mockRouter.push = jest.fn();
  });
});

beforeAll(async () => {
  response = await fetch("http://localhost:3000/lessons/page");
  body = await response.json();
});

it("should have response status 200", () => {
  expect(response.status).toBe(200);
});

// describe("GET /lessons/page", () => {
//     it("should go to exercise page when Übung is clicked", () => {
//       const request = mockGet("/lessons/page");

//       const exerciseLink = screen.getByText("Übung 1");
//       fireEvent.click(exerciseLink);

//       expect(window.location.pathname).toBe("/lessons/exercises");
//     });

// describe("GET /lessons/page", () => {
//   it("should show all tasks when 'mehr anzeigen' is clicked and hid them when 'weniger anzeigen' is clicked", () => {

//     const showMoreButton = screen.getByText("mehr anzeigen");
//     fireEvent.click(showMoreButton);

//     const exercise4 = screen.getByText("Übung 4");
//     const exercise5 = screen.getByText("Übung 5");
//     expect(exercise4).toBeVisible();
//     expect(exercise5).toBeVisible();

//     const showLessButton = screen.getByText("weniger anzeigen");
//     fireEvent.click(showLessButton);

//     expect(exercise4).not.toBeVisible();
//     expect(exercise5).not.toBeVisible();
//   });

//   it("should go to exercise page when Übung is clicked", () => {

//     const exerciseLink = screen.getByText("Übung 1");
//     fireEvent.click(exerciseLink);

//     expect(mockRouter.push).toHaveBeenCalledWith("/lessons/exercises");
//   });
// });
