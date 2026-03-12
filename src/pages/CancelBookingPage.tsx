import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import type Route from "../interfaces/Route";

type Status = "idle" | "loading" | "success" | "error";

export default function CancelBookingPage() {
  const [searchParams] = useSearchParams();
  const bookingRef = useMemo(() => searchParams.get("bookingRef"), [searchParams]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  
  const onCancel = async () => {
    if (!bookingRef) {
      setStatus("error");
      setMessage("Ogiltig länk: bookingRef saknas.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // 1) Hämtar bokningen via bookingRef
      const bookingRes = await fetch(`/api/Booking?where=bookingRef=${encodeURIComponent(bookingRef)}`);
      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        setStatus("error");
        setMessage("Kunde inte hämta bokningen.");
        return;
      }

      
      const booking = Array.isArray(bookingData) ? bookingData[0] : bookingData;

      if (!booking || !booking.id) {
        setStatus("error");
        setMessage("Bokningen hittades inte (fel bookingRef).");
        return;
      }

      const bookingId = booking.id;

      // 2) Hämta alla tickets kopplade till bokningen
      const ticketsRes = await fetch(`/api/Ticket?where=BookingId=${bookingId}`);
      const ticketsData = await ticketsRes.json();

      if (!ticketsRes.ok) {
        setStatus("error");
        setMessage("Kunde inte hämta biljetter för bokningen.");
        return;
      }

      const tickets = Array.isArray(ticketsData) ? ticketsData : [];

      // 3) Radera tickets först (precis som MyPage )
      for (const t of tickets) {
        if (t?.id) {
          await fetch(`/api/Ticket/${t.id}`, { method: "DELETE" });
        }
      }

      // 4) Radera själva bokningen
      const delBookingRes = await fetch(`/api/Booking/${bookingId}`, { method: "DELETE" });
      if (!delBookingRes.ok) {
        setStatus("error");
        setMessage("Kunde inte avboka bokningen.");
        return;
      }

      setStatus("success");
      setMessage("Din bokning är nu avbokad.");
    } catch {
      setStatus("error");
      setMessage("Tekniskt fel vid avbokning.");
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: 16 }}>
      <h1>Avboka bokning</h1>

      {!bookingRef && (
        <>
          <p>Ogiltig länk: bookingRef saknas.</p>
          <p><Link to="/">Till startsidan</Link></p>
        </>
      )}

      {bookingRef && status === "idle" && (
        <>
          <p>
            Vill du avboka bokningen med referens: <strong>{bookingRef}</strong>?
          </p>
          <button onClick={onCancel}>Bekräfta avbokning</button>
          <p style={{ marginTop: 12 }}>
            <Link to="/mypage">Gå till Min sida</Link>
          </p>
        </>
      )}

      {status === "loading" && <p>Avbokar...</p>}
      {status === "success" && (
        <>
          <p>{message}</p>
          <p><Link to="/">Till startsidan</Link></p>
        </>
      )}
      {status === "error" && (
        <>
          <p>{message}</p>
          <p><Link to="/mypage">Gå till Min sida</Link></p>
        </>
      )}
    </div>
  );
}

CancelBookingPage.route = {
  path: "/cancel-booking",
  index: 0,
} as Route;
