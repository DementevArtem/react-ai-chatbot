export function getErrorMessage(error) {
  const raw = String(error?.message || error || "");
  const text = raw.toLowerCase();

  if (
    text.includes("failed to fetch") ||
    text.includes("network") ||
    text.includes("offline") ||
    text.includes("load failed")
  ) {
    return "No internet connection. Check the network and try again.";
  }

  if (
    text.includes("api key") ||
    text.includes("401") ||
    text.includes("403") ||
    text.includes("permission") ||
    text.includes("unauthorized")
  ) {
    return "API key is invalid or blocked.";
  }

  if (
    text.includes("404") ||
    text.includes("not found") ||
    text.includes("no longer available")
  ) {
    return "This model is unavailable right now.";
  }

  if (
    text.includes("429") ||
    text.includes("quota") ||
    text.includes("rate") ||
    text.includes("resource exhausted")
  ) {
    return "Too many requests. Wait a bit and retry.";
  }

  if (
    text.includes("500") ||
    text.includes("503") ||
    text.includes("unavailable") ||
    text.includes("overloaded")
  ) {
    return "Gemini is temporarily down.";
  }

  return "Couldn't get a reply. Please try again.";
}
