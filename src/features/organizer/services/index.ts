// REZOLVARE EROARE TS:
// 'eventsService' este un export default în fișierul lui, deci trebuie exportat cu 'default as ...'
export { default as eventsService } from "./eventsService";
export {
  notificationsService,
  default as notificationsServiceDefault,
} from "./notificationsService";
