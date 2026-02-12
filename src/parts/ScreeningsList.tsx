import type { Screening } from "../interfaces/Screenings";

type Props = {
  screenings: Screening[];
};

export default function ScreeningsList({ screenings }: Props) {
  return (
    <section>
      <h2>Alla screenings</h2>

      {screenings.length === 0 ? (
        <p>Inga screenings att visa.</p>
      ) : (
        <ul>
          {screenings.map((s) => (
            <li key={s.id}>
              {s.movieTitle} – {s.date} {s.time}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
