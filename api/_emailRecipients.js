const REQUIRED_RECIPIENTS = ["info@mspixelpulse.com", "mspixelpulse@gmail.com"];

export function internalRecipients(configuredRecipients = "") {
  return Array.from(new Set([
    ...REQUIRED_RECIPIENTS,
    ...String(configuredRecipients)
      .split(/[;,]/)
      .map((recipient) => recipient.trim().toLowerCase())
      .filter(Boolean),
  ]));
}
