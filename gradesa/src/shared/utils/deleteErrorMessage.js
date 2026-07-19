export async function getDeleteErrorMessage(response, fallbackMessage) {
    if (response.status === 403) {
        return "Sie haben keine Berechtigung, diesen Inhalt zu löschen.";
    }

    if (response.status === 401) {
        return "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.";
    }

    const message = await response.text();
    return message || fallbackMessage;
}