using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace WebApp;


public class SeatHub : Hub
{
    // ett trådsäkert minne som håller koll på : ConnectionId -> Lista med låsta stolar ( "ScreeningsID_SeatID")
    private static readonly ConcurrentDictionary<string, HashSet<string>> _lockedSeats = new();

    // 1. Klient ansluter till en specifik visning (rum)
    public async Task JoinScreening(int screeningId)
    {
        string groupName = $"Screening_{screeningId}";
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        // Skapa en tom lista i minnet för denna användaren om den inte redan finns 
        _lockedSeats.TryAdd(Context.ConnectionId, new HashSet<string>());

        Console.WriteLine($"[$SignalR] Klient {Context.ConnectionId} anslöt till {groupName}");

    }

    // 2. Användaren klickar på en stol för att låsa dem
    public async Task LockSeat(int screeningId, int SeatId)
    {
        string groupName = $"Screening_{screeningId}";
        string seatKey = $"{screeningId}_{SeatId}";

        // Komma ihåg att denna användaren har låst stolen
        if (_lockedSeats.TryGetValue(Context.ConnectionId, out var seats))
        {
            seats.Add(seatKey);
        }

        // Meddela alla ANDRA i rummet (utom den som klickade ) att stolen är låst
        await Clients.GroupExcept(groupName, Context.ConnectionId).SendAsync("SeatLocked", SeatId);
    }


    // 3. Användaren klickar bort stolen (ångrar sig)
    public async Task UnlockSeat(int screeningId, int SeatId)
    {
        string groupName = $"Screening_{screeningId}";
        string seatKey = $"{screeningId}_{SeatId}";

        // Glöm bort att användaren äger stolen 
        if (_lockedSeats.TryGetValue(Context.ConnectionId, out var seats))
        {
            seats.Remove(seatKey);
        }

        // Meddela alla ANDRA i rummet att stolen är ledig igen
        await Clients.GroupExcept(groupName, Context.ConnectionId).SendAsync("SeatUnlocked", SeatId);
    }

    // användaren genomför bokningen 
    public async Task ConfimBooking(int screeningId, List<int> seatsId)
    {
        string groupName = $"Screening_{screeningId}";

        // Ta bort stolarna från "temporära låsta" så de inte råkar att låsas upp när användaren stänger sidan. 
        if (_lockedSeats.TryGetValue(Context.ConnectionId, out var seats))
        {
            foreach (var seatId in seatsId)
            {
                seats.Remove($"{screeningId}_{seatId}");
            }
        }

        // Berätta för alla i rummet att dessa stolar nu är permanent köpta
        await Clients.Group(groupName).SendAsync("SeatsBooked", seatsId);

    }

    // 5. Skyddsnätet: Vad händer om webbläsaren stängs ned ?
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Om användaren försvinner, kolla om de hade några stolar låsta
        if (_lockedSeats.TryRemove(Context.ConnectionId, out var abandonedSeats))
        {
            foreach (var seatKey in abandonedSeats)
            {
                // Ploack isär "45_12" till screenings id (45 ) och seatid (12)
                var parts = seatKey.Split('_');
                if (parts.Length == 2 &&
                    int.TryParse(parts[0], out int screeningId) &&
                    int.TryParse(parts[1], out int seatId))
                {
                    string groupName = $"Screening_{screeningId}";

                    // Lås upp stolen för alla andra!
                    await Clients.Group(groupName).SendAsync("SeatUnlocked", seatId);
                    Console.WriteLine($"[SignalR] Auto-upplåst stol {seatId} för visning {screeningId} (Användaren försvann)");
                }

            }
        }
        await base.OnDisconnectedAsync(exception);
    }
}