export interface Screening {
  id: string;
  movieTitle: string;
  date: string;
  time: string; //?? ska denna finnas?
  salon: string; //? ska denna finnas?
  startTime: string;     // Lade till denna
  theaterName: string;   // Lade till denna
  availableSeats: number; // Lade till denna
  priceSek: number;
  movieId: number;
  duration: number;
  totalAmountOfSeats: number;
}