/**
 * Formats notification count for display with professional UX:
 * - 0: Returns empty string (badge should be hidden)
 * - 1-9: Returns exact number as string
 * - 10+: Returns "9+"
 */
export const formatNotificationCount = (count: number): string => {
  if (count <= 0) return "";
  if (count >= 10) return "9+";
  return count.toString();
};

export default formatNotificationCount;
