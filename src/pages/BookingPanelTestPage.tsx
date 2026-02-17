import BookingSnackPanel from "../parts/BookingSnackPanel";

export default function BookingPanelTestPage() {
  return (
    <div className="min-h-screen bg-[#] flex items-end">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-10">
        <BookingSnackPanel
          movieTitle="Joker"
          ticketCount={3}
          ticketPrice={120}
          seatsLabelLines={[
            "Stol 1, Rad 2",
            "Stol 2, Rad 2",
            "Stol 9, Rad 2",
          ]}
          onBook={({ email, snack }) => {
            console.log("BOOK:", { email, snack });
          }}
        />
      </div>
    </div>
  );
}


BookingPanelTestPage.route = {
  path: "/booking-panel-test",
  index: 999,
};
