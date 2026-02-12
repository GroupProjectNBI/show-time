import ScreeningsList from "../parts/ScreeningsList";
import type { Screening } from "../interfaces/Screenings";

function ScreeningsPage() {
  const screenings: Screening[] = []; // empty for now, will add mockdata

  return (
    <main>
      <h1>Screenings</h1>
      <ScreeningsList screenings={screenings} />
    </main>
  );
}
    
ScreeningsPage.route = {
  path: "/screenings",
  menuLabel: "Screenings",
  index: 2
};

export default ScreeningsPage;