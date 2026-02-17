// export function formatDate(date: Date) {
//     return date.getFullYear() + '-' +
//         (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
//         date.getDate().toString().padStart(2, '0');
// }


export function formatTime(dateInput: string | Date): string {
    const date = new Date(dateInput);

    // Tvingar svenska och 24h-format
    return date.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}