export function calculatingTime(min: number) {
    const hours = Math.floor(min / 60);
    const minutes = min % 60;

    // Om filmen är under en timme, visa bara minuter
    if (hours === 0) {
        return `${minutes}min`;
    }

    // Om det är jämna timmar, visa bara timmar (t.ex. "2h")
    if (minutes === 0) {
        return `${hours} h`;
    }

    // Standardformatet: "1h 20min"
    return `${hours}h ${minutes} min`;
}