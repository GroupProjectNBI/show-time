using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace WebApp;

public class SeatHub : Hub
{
    // ConnectionId -> HashSet med "ScreeningID_SeatID"
    private static readonly ConcurrentDictionary<string, HashSet<string>> _lockedSeats = new();

    // 1. Klient ansluter till en specifik visning
    public async Task JoinScreening(int screeningId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Screening_{screeningId}");
        Console.WriteLine($"[$SignalR] Klient {Context.ConnectionId} anslöt till Screening_{screeningId}");

        // --- RÄTTAD LOGIK: Hämta alla låsta stolar för denna screening ---
        string prefix = $"{screeningId}_";

        var lockedSeatsForThisScreening = _lockedSeats.Values
            .SelectMany(set => set)             // Slå ihop alla användares listor till en lång lista
            .Where(key => key.StartsWith(prefix)) // Filtrera fram de som börjar på t.ex. "64_"
            .Select(key => int.Parse(key.Split('_')[1])) // Plocka ut SeatID (delen efter _)
            .Distinct()                         // Ta bort dubbletter om de finns
            .ToList();

        await Clients.Caller.SendAsync("InitialLocks", lockedSeatsForThisScreening);
    }

    // 2. Användaren klickar på en stol
    public async Task LockSeat(int screeningId, int SeatId)
    {
        string groupName = $"Screening_{screeningId}";
        string seatKey = $"{screeningId}_{SeatId}";

        // TIPS: Använd GetOrAdd för att skapa listan om användaren inte finns än
        var seats = _lockedSeats.GetOrAdd(Context.ConnectionId, _ => new HashSet<string>());
        lock (seats) { seats.Add(seatKey); }

        await Clients.GroupExcept(groupName, Context.ConnectionId).SendAsync("SeatLocked", SeatId);
    }

    // 3. Användaren klickar bort stolen
    public async Task UnlockSeat(int screeningId, int SeatId)
    {
        string groupName = $"Screening_{screeningId}";
        string seatKey = $"{screeningId}_{SeatId}";

        if (_lockedSeats.TryGetValue(Context.ConnectionId, out var seats))
        {
            lock (seats) { seats.Remove(seatKey); }
        }

        await Clients.GroupExcept(groupName, Context.ConnectionId).SendAsync("SeatUnlocked", SeatId);
    }

    // 4. Användaren genomför bokningen (Rättat stavfel: Confim -> Confirm)
    public async Task ConfirmBooking(int screeningId, List<int> seatsId)
    {
        string groupName = $"Screening_{screeningId}";

        if (_lockedSeats.TryGetValue(Context.ConnectionId, out var seats))
        {
            lock (seats)
            {
                foreach (var seatId in seatsId)
                {
                    seats.Remove($"{screeningId}_{seatId}");
                }
            }
        }

        await Clients.Group(groupName).SendAsync("SeatsBooked", seatsId);
    }

    // 5. Skyddsnätet
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_lockedSeats.TryRemove(Context.ConnectionId, out var abandonedSeats))
        {
            foreach (var seatKey in abandonedSeats)
            {
                var parts = seatKey.Split('_');
                if (parts.Length == 2 &&
                    int.TryParse(parts[0], out int screeningId) &&
                    int.TryParse(parts[1], out int seatId))
                {
                    string groupName = $"Screening_{screeningId}";
                    await Clients.Group(groupName).SendAsync("SeatUnlocked", seatId);
                    Console.WriteLine($"[SignalR] Auto-upplåst stol {seatId} (Användaren försvann)");
                }
            }
        }
        await base.OnDisconnectedAsync(exception);
    }
}