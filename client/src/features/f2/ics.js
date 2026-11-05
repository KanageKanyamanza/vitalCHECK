// Rappel d'agenda (.ics) généré dans le navigateur, sans aucun appel serveur.

const pad = (n) => String(n).padStart(2, "0");
const dateOnly = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const utcStamp = (d) =>
	`${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

// Échappement RFC 5545 : antislash, point-virgule, virgule, retours à la ligne
const escapeText = (text) => String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Date du rappel : dans `days` jours (30 par défaut), sur une journée entière. */
export const reminderDate = (now, days = 30) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);

/**
 * Événement d'une journée, avec une alarme la veille à 9 h.
 * Lignes séparées par CRLF, comme l'exige le format iCalendar.
 */
export const buildReminderIcs = ({ title, description, start, now, uid }) => {
	const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
	return [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Ubuntu Business Builders//vitalCHECK//FR",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		"BEGIN:VEVENT",
		`UID:${uid}`,
		`DTSTAMP:${utcStamp(now)}`,
		`DTSTART;VALUE=DATE:${dateOnly(start)}`,
		`DTEND;VALUE=DATE:${dateOnly(end)}`,
		`SUMMARY:${escapeText(title)}`,
		`DESCRIPTION:${escapeText(description)}`,
		"TRANSP:TRANSPARENT",
		"BEGIN:VALARM",
		"ACTION:DISPLAY",
		`DESCRIPTION:${escapeText(title)}`,
		"TRIGGER:-PT15H",
		"END:VALARM",
		"END:VEVENT",
		"END:VCALENDAR",
		"",
	].join("\r\n");
};

/** Fait télécharger le fichier .ics (ouvert par l'agenda du téléphone ou de l'ordinateur). */
export const downloadIcs = (content, filename) => {
	const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	setTimeout(() => URL.revokeObjectURL(url), 1000);
};
