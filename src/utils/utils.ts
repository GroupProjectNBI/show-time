// src/utils.ts


export function getAssetUrl(path: string | undefined) {

    if (!path) return undefined;
    // Om det är en extern länk (t.ex. placehold.co), rör den inte
    if (path.startsWith('http')) return path;

    // Ta bort inledande snedstreck
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Bygg ihop med Vites base URL
    return `${import.meta.env.BASE_URL}${cleanPath}`;
};

