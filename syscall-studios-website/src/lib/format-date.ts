export function formatDate(
    date: Date,
    style: "short" | "long" = "short"
) {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: style === "long" ? "long" : "short",
        day: style === "short" ? "2-digit" : "numeric",
        timeZone: "UTC"
    });
}
