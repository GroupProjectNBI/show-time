export interface Screening {
  id: string;
  movieTitle: string;
  date: string;
  time: string; //??
  salon: string; //?
  startTime: string;     // Lade till denna
  theaterName: string;   // Lade till denna
  avaliableSeats: number; // Lade till denna
  priceSek: number;
}