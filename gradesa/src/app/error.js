"use client";

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Etwas ist schiefgelaufen / Something went wrong</h2>
      <p>
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      <button onClick={() => reset()}>Erneut versuchen / Try again</button>
    </div>
  );
}
