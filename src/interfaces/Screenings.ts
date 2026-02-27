export interface Screening {
  id: string;
  movieTitle: string;
  date: string;
  time: string; //??
  salon: string; //?
  startTime: string;     // Lade till denna
  theaterName: string;   // Lade till denna
  availableSeats: number; // Lade till denna
  priceSek: number;
  movieId: number;
  ageLimit: "11" | "15" | "18";
  duration: number;
  totalAmountOfSeats: number;
}