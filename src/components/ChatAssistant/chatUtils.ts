/**
 * Frontend-only chat utilities for the UNIfy chatbot
 * Uses rule-based intent detection and local data - no backend calls
 */

import { StudentEvent } from "../../types/student";

export interface ChatData {
  events: StudentEvent[];
  favorites: StudentEvent[];
  registrations: StudentEvent[];
  studentName: string;
}

export type Intent =
  | "favorites"
  | "registrations"
  | "events"
  | "event_details"
  | "recommendations"
  | "help"
  | "greeting"
  | "unknown";

/**
 * Normalize text for matching: lowercase, trim, remove diacritics
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[ăâ]/g, "a")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .replace(/[îâ]/g, "i")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
};

/**
 * Detect user intent from message using keyword matching
 */
export const detectIntent = (message: string): { intent: Intent; eventName?: string } => {
  const normalized = normalizeText(message);
  const lower = message.toLowerCase().trim();

  // Greeting detection
  if (
    /^(salut|buna|hello|hey|hi|hei|ciao|servus|noroc)[!?.\s]*$/i.test(lower) ||
    lower.includes("ce faci") ||
    lower.includes("cum esti")
  ) {
    return { intent: "greeting" };
  }

  // Help detection
  if (
    lower.includes("ajutor") ||
    lower.includes("help") ||
    lower.includes("ce poti") ||
    lower.includes("ce poți")
  ) {
    return { intent: "help" };
  }

  // Favorites detection
  if (
    lower.includes("favorit") ||
    lower.includes("salvat") ||
    normalized.includes("favorite")
  ) {
    return { intent: "favorites" };
  }

  // Registrations detection - "la ce sunt înscris", "evenimentele mele"
  if (
    lower.includes("inscris") ||
    lower.includes("înscris") ||
    (lower.includes("eveniment") && lower.includes("mele")) ||
    lower.includes("participarile mele") ||
    lower.includes("participările mele")
  ) {
    return { intent: "registrations" };
  }

  // Event details detection
  if (
    lower.includes("detalii") ||
    lower.includes("spune-mi despre") ||
    lower.includes("zi-mi despre") ||
    lower.includes("info despre") ||
    lower.includes("ce este")
  ) {
    // Extract event name from message
    let eventName = lower
      .replace(/spune-mi despre|zi-mi despre|detalii despre|detaliile evenimentului|info despre|ce este/gi, "")
      .replace(/eveniment(ul)?/gi, "")
      .trim();
    
    return { intent: "event_details", eventName };
  }

  // Recommendations detection
  if (
    lower.includes("recomand") ||
    lower.includes("suggest") ||
    lower.includes("ce sa") ||
    lower.includes("ce să") ||
    lower.includes("pentru mine")
  ) {
    return { intent: "recommendations" };
  }

  // Available events detection
  if (
    lower.includes("eveniment") ||
    lower.includes("disponibil") ||
    lower.includes("viitoare") ||
    lower.includes("lista")
  ) {
    return { intent: "events" };
  }

  return { intent: "unknown" };
};

/**
 * Format date for display
 */
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/**
 * Format a list of events for chat display
 */
const formatEventList = (events: StudentEvent[], limit = 5): string => {
  if (events.length === 0) return "";
  
  return events
    .slice(0, limit)
    .map((e, i) => `${i + 1}. **${e.name || e.title || "Eveniment"}** - ${formatDate(e.date)} • ${e.location}`)
    .join("\n");
};

/**
 * Get event display name (handles both name and title fields)
 */
const getEventName = (event: StudentEvent): string => {
  return event.name || event.title || "Eveniment";
};

/**
 * Find event by name with fuzzy matching
 */
const findEventByName = (
  events: StudentEvent[],
  searchName: string
): StudentEvent | StudentEvent[] | null => {
  if (!searchName || searchName.length < 2) return null;

  const normalizedSearch = normalizeText(searchName);

  // Try exact match first
  let found = events.find(
    (e) => normalizeText(getEventName(e)) === normalizedSearch
  );
  if (found) return found;

  // Try partial match
  found = events.find(
    (e) =>
      normalizeText(getEventName(e)).includes(normalizedSearch) ||
      normalizedSearch.includes(normalizeText(getEventName(e)))
  );
  if (found) return found;

  // Try word-by-word matching
  const searchWords = normalizedSearch.split(/\s+/).filter((w) => w.length > 2);
  found = events.find((e) => {
    const eventName = normalizeText(getEventName(e));
    return searchWords.every((word) => eventName.includes(word));
  });
  if (found) return found;

  // Return similar events if no exact match
  const similar = events.filter((e) => {
    const eventName = normalizeText(getEventName(e));
    return searchWords.some((word) => eventName.includes(word));
  });

  if (similar.length > 0) return similar.slice(0, 3);

  return null;
};

/**
 * Generate response based on intent and data
 */
export const generateResponse = (
  message: string,
  data: ChatData
): string => {
  const { intent, eventName } = detectIntent(message);
  const { events, favorites, registrations, studentName } = data;
  const firstName = studentName || "Student";

  switch (intent) {
    case "greeting":
      return `Bună, ${firstName}! 👋 Mă bucur să te văd!\n\n` +
        `${registrations.length > 0 ? `Ești înscris la **${registrations.length}** eveniment${registrations.length > 1 ? "e" : ""}. ` : ""}` +
        `${events.length > 0 ? `Sunt **${events.length}** evenimente disponibile.\n\n` : "\n"}` +
        `Cu ce te pot ajuta?\n• "La ce sunt înscris?"\n• "Ce îmi recomanzi?"\n• "Care sunt favoritele mele?"`;

    case "help":
      return `${firstName}, sunt asistentul tău UNIfy! 👋\n\n` +
        `Te pot ajuta cu:\n` +
        `• **Evenimentele tale** - "La ce sunt înscris?"\n` +
        `• **Recomandări** - "Ce îmi recomanzi?"\n` +
        `• **Favorite** - "Care sunt favoritele mele?"\n` +
        `• **Detalii** - "Spune-mi despre [eveniment]"\n` +
        `• **Lista** - "Ce evenimente sunt disponibile?"\n\n` +
        `Cu ce te pot ajuta?`;

    case "favorites":
      if (favorites.length === 0) {
        return `${firstName}, nu ai evenimente favorite încă. ❤️\n\n` +
          `Poți adăuga evenimente la favorite apăsând pe iconița ❤️ de pe cardul evenimentului.`;
      }
      return `**Evenimentele tale favorite** ❤️\n\n${formatEventList(favorites, 10)}\n\n` +
        `Ai **${favorites.length}** eveniment${favorites.length > 1 ? "e" : ""} salvat${favorites.length > 1 ? "e" : ""}.`;

    case "registrations":
      if (registrations.length === 0) {
        return `${firstName}, nu ești înscris la niciun eveniment momentan. 📋\n\n` +
          `Explorează evenimentele disponibile și înscrie-te la cele care te interesează!`;
      }
      return `**Evenimentele la care ești înscris** 📋\n\n${formatEventList(registrations, 10)}\n\n` +
        `Ești înscris la **${registrations.length}** eveniment${registrations.length > 1 ? "e" : ""}.`;

    case "events":
      if (events.length === 0) {
        return `Momentan nu sunt evenimente disponibile. 📅\n\n` +
          `Verifică mai târziu pentru noi oportunități!`;
      }
      return `**Evenimente disponibile** 📅\n\n${formatEventList(events, 8)}\n\n` +
        `Sunt **${events.length}** evenimente în total. Întreabă-mă pentru detalii despre oricare!`;

    case "event_details":
      if (!eventName || eventName.length < 2) {
        return `Te rog să specifici numele evenimentului. 🔍\n\n` +
          `Exemplu: "Spune-mi despre Balul Bobocilor"`;
      }

      const foundEvent = findEventByName(events, eventName);

      if (!foundEvent) {
        return `Nu am găsit evenimentul "${eventName}". 🔍\n\n` +
          `Verifică numele sau întreabă-mă "Ce evenimente sunt disponibile?" pentru lista completă.`;
      }

      if (Array.isArray(foundEvent)) {
        // Multiple similar events found
        return `Nu am găsit exact "${eventName}", dar poate te referi la:\n\n` +
          foundEvent.map((e) => `• **${getEventName(e)}**`).join("\n") +
          `\n\nÎntreabă-mă despre oricare dintre acestea!`;
      }

      // Single event found - show details
      const spotsLeft = foundEvent.maxParticipants - foundEvent.currentParticipants;
      const organizerName = typeof foundEvent.organizer === "object" 
        ? foundEvent.organizer.name 
        : String(foundEvent.organizer || "N/A");
      return `**${getEventName(foundEvent)}**\n\n` +
        `📅 **Data:** ${formatDate(foundEvent.date)} • ${foundEvent.time}\n` +
        `📍 **Locație:** ${foundEvent.location}\n` +
        `🏷️ **Categorie:** ${foundEvent.category || "N/A"}\n` +
        `👥 **Participanți:** ${foundEvent.currentParticipants}/${foundEvent.maxParticipants} ` +
        `(${spotsLeft > 0 ? `${spotsLeft} locuri disponibile` : "Complet"})\n` +
        `🏛️ **Organizator:** ${organizerName}\n` +
        `${foundEvent.description ? `\n📝 ${foundEvent.description.substring(0, 200)}${foundEvent.description.length > 200 ? "..." : ""}` : ""}`;

    case "recommendations":
      // Filter out events already in favorites or registrations
      const favIds = new Set(favorites.map((f) => f.id));
      const regIds = new Set(registrations.map((r) => r.id));
      
      const recommendations = events.filter(
        (e) => !favIds.has(e.id) && !regIds.has(e.id)
      );

      if (recommendations.length === 0) {
        return `${firstName}, ai deja toate evenimentele în favorite sau înscrise! 🎉\n\n` +
          `Verifică mai târziu pentru noi evenimente.`;
      }

      // Take random 5 recommendations
      const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 5);

      return `**Recomandări pentru tine** 🎯\n\n${formatEventList(selected, 5)}\n\n` +
        `Acestea sunt evenimente la care nu ești înscris și nu le ai în favorite.`;

    case "unknown":
    default:
      return `${firstName}, nu am înțeles exact ce cauți. 🤔\n\n` +
        `Încearcă una din acestea:\n` +
        `• "La ce sunt înscris?" - vezi evenimentele tale\n` +
        `• "Ce îmi recomanzi?" - recomandări personalizate\n` +
        `• "Care sunt favoritele mele?" - evenimentele salvate\n` +
        `• "Ce evenimente sunt disponibile?" - lista completă`;
  }
};

/**
 * Generate welcome message using local data
 */
export const generateWelcomeMessage = (data: ChatData): string => {
  const { events, registrations, studentName } = data;
  const firstName = studentName || "Student";

  return `Bună, ${firstName}! 👋 Sunt asistentul tău personal UNIfy.\n\n` +
    `${registrations.length > 0 ? `Ești înscris la **${registrations.length}** eveniment${registrations.length > 1 ? "e" : ""}. ` : ""}` +
    `${events.length > 0 ? `Sunt **${events.length}** evenimente disponibile.\n\n` : "\n\n"}` +
    `Te pot ajuta cu:\n` +
    `• **Evenimentele tale** - "La ce sunt înscris?"\n` +
    `• **Recomandări** - "Ce îmi recomanzi?"\n` +
    `• **Căutare** - "Spune-mi despre [eveniment]"\n` +
    `• **Favorite** - "Care sunt favoritele mele?"\n\n` +
    `Cu ce te pot ajuta?`;
};
