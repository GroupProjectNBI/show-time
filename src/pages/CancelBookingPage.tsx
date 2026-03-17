import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import type Route from "../interfaces/Route";
import { useAuth } from "../context/AuthContext";

type Status = "idle" | "loading" | "success" | "error";

export default function CancelBookingPage() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [searchParams] = useSearchParams();
  const bookingRef = useMemo(() => searchParams.get("bookingRef"), [searchParams]);

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  // OBS: Vi kör inte auto-cancel på load (mail-klienter kan "prefetcha" länkar).
  const isWorking = status === "loading";

  // Vi visar knappar när sidan har en bookingRef och vi inte redan är klara.
  // (idle + loading = användaren är kvar i bekräftelseflödet)
  const showConfirm = bookingRef && (status === "idle" || status === "loading");

  const onCancel = async () => {
    if (!bookingRef) {
      setStatus("error");
      setMessage("Ogiltig länk: bokningskoden saknas.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // 1) Hämta bokningen via bookingRef 
      const bookingRes = await fetch(
        `/api/Booking?where=bookingRef=${encodeURIComponent(bookingRef)}`
      );
      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        setStatus("error");
        setMessage("Kunde inte hämta bokningen.");
        return;
      }

      // Generiskt GET /api/{table} returnerar oftast en array
      const booking = Array.isArray(bookingData) ? bookingData[0] : bookingData;

      if (!booking || !booking.id) {
        setStatus("error");
        setMessage("Bokningen hittades inte. Kontrollera bokningskoden.");
        return;
      }

      const bookingId = Number(booking?.id);
      if (!bookingId) {
        setStatus("error");
        setMessage("Bokningen hittades inte. Kontrollera bokningskoden.");
        return;
      }

      // 2) Hämta alla tickets kopplade till bokningen
      const ticketsRes = await fetch(`/api/Ticket?where=BookingId=${bookingId}`);
      const ticketsData = await ticketsRes.json();

      if (!ticketsRes.ok) {
        setStatus("error");
        setMessage("Kunde inte hämta biljetter för bokningen.");
        return;
      }

      const tickets = Array.isArray(ticketsData) ? ticketsData : [];

      // 3) Radera tickets först 
      for (const t of tickets) {
        if (t?.id) {
          await fetch(`/api/Ticket/${t.id}`, { method: "DELETE" });
        }
      }

      // 4) Radera själva bokningen
      const delBookingRes = await fetch(`/api/Booking/${bookingId}`, { method: "DELETE" });
      if (!delBookingRes.ok) {
        setStatus("error");
        setMessage("Kunde inte avboka bokningen. Försök igen.");
        return;
      }

      setStatus("success");
      setMessage("Din bokning är nu avbokad.");
    } catch {
      setStatus("error");
      setMessage("Ett tekniskt fel uppstod. Försök igen senare.");
    }
  };

  // Inloggad användare ska skickas till Min sida, annars startsidan
  const primaryLinkTo = isLoggedIn ? "/min-sida" : "/";
  const primaryLinkLabel = isLoggedIn ? "Till Min sida" : "Till startsidan";

  // Följer vårt tema
  const red = "#680909";      // bg-primary
  const redHover = "#7A0C0C"; // lite ljusare vid hover (premium)
  const gold = "#C6A96A";     // text-accent
  const white = "#FFFFFF";    // hover-text

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div
        style={{
          width: "min(720px, 100%)",
          background: "rgba(0,0,0,0.45)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 22,
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: 0.2 }}>
            Avboka bokning
          </h1>
          <p style={{ margin: "8px 0 0 0", opacity: 0.85 }}>
            {bookingRef
              ? "Bekräfta att du vill avboka bokningen nedan."
              : "Länken saknar bokningskod."}
          </p>
        </div>

        {bookingRef && (
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px dashed rgba(255,255,255,0.14)",
              borderRadius: 12,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>BOKNINGSKOD</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>{bookingRef}</div>
          </div>
        )}

        {status === "loading" && (
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              marginBottom: 14,
            }}
          >
            Avbokar… vänta lite.
          </div>
        )}

        {(status === "success" || status === "error") && (
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background:
                status === "success" ? "rgba(0,255,128,0.10)" : "rgba(255,80,80,0.10)",
              border:
                status === "success"
                  ? "1px solid rgba(0,255,128,0.25)"
                  : "1px solid rgba(255,80,80,0.25)",
              marginBottom: 14,
            }}
          >
            {message}
          </div>
        )}

        {/* Vi visar bekräftelse-knapparna när vi har en bookingRef och inte är "klar" */}
        {showConfirm && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={onCancel}
              disabled={isWorking}
              style={{
                cursor: isWorking ? "not-allowed" : "pointer",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 900,
                letterSpacing: 0.2,
                background: red,
                color: gold,
                boxShadow: isWorking ? "none" : "0 10px 22px rgba(0,0,0,0.40)",
                transition:
                  "transform 120ms ease, box-shadow 160ms ease, background 160ms ease, color 160ms ease",
              }}
              onMouseEnter={(e) => {
                if (isWorking) return;
                e.currentTarget.style.background = redHover;
                e.currentTarget.style.color = white;
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.45)";
              }}
              onMouseLeave={(e) => {
                if (isWorking) return;
                e.currentTarget.style.background = red;
                e.currentTarget.style.color = gold;
                e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.40)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onMouseDown={(e) => {
                if (isWorking) return;
                e.currentTarget.style.transform = "translateY(1px)";
              }}
              onMouseUp={(e) => {
                if (isWorking) return;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Bekräfta avbokning
            </button>

            <Link
              to={primaryLinkTo}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 900,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.10)",
                background: red,
                color: gold,
                boxShadow: "0 10px 22px rgba(0,0,0,0.40)",
                transition: "box-shadow 160ms ease, background 160ms ease, color 160ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = redHover;
                e.currentTarget.style.color = white;
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = red;
                e.currentTarget.style.color = gold;
                e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.40)";
              }}
            >
              {primaryLinkLabel}
            </Link>
          </div>
        )}

        {/* Om länken är trasig (saknar bookingRef) visar vi bara en tydlig väg tillbaka */}
        {!bookingRef && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to={primaryLinkTo}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 900,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.10)",
                background: red,
                color: gold,
                boxShadow: "0 10px 22px rgba(0,0,0,0.40)",
                transition: "box-shadow 160ms ease, background 160ms ease, color 160ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = redHover;
                e.currentTarget.style.color = white;
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = red;
                e.currentTarget.style.color = gold;
                e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.40)";
              }}
            >
              {primaryLinkLabel}
            </Link>
          </div>
        )}

        {/* Efter success/error ska användaren också kunna navigera vidare */}
        {(status === "success" || status === "error") && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to={primaryLinkTo}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 900,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.10)",
                background: red,
                color: gold,
                boxShadow: "0 10px 22px rgba(0,0,0,0.40)",
                transition: "box-shadow 160ms ease, background 160ms ease, color 160ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = redHover;
                e.currentTarget.style.color = white;
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = red;
                e.currentTarget.style.color = gold;
                e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.40)";
              }}
            >
              {primaryLinkLabel}
            </Link>
          </div>
        )}

        {/* Liten hint längst ner */}
        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.7 }}>
          {isLoggedIn
            ? "Du är inloggad — du kan även se bokningar under “Min sida”."
            : "Du är inte inloggad — du kan alltid gå till startsidan och boka igen."}
        </div>
      </div>
    </div>
  );
}


CancelBookingPage.route = {
  path: "/avboka", // Ändrad från /cancel-booking
  index: 0,
} as Route;