export function getYouTubeId(url: string | undefined): string | null {
    if (!url) return null;

    // Denna regex hanterar:
    // 1. youtube.com/watch?v=ID
    // 2. youtu.be/ID (Din länk!)
    // 3. youtube.com/embed/ID
    // 4. Rensar bort ?si=... och annat skräp på slutet
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
}