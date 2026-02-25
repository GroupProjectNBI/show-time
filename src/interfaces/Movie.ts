export default interface Movie {
    movieId: number;
    title: string;
    duration: number;
    description: string;
    categories: string;
    averageRating: number;
    reviewCount: number;
    ageLimit: number;
    // behöver updatera för reviews object array och (något som behöver åtgärdas?)
}