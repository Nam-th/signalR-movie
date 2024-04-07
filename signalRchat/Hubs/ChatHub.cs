using Microsoft.AspNetCore.SignalR;

namespace signalRchat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SelectSeat(string seatID)
        {
            await Clients.All.SendAsync("ReceiveSelectSeat", seatID);
        }
        public async Task UnselectSeat(string seatID)
        {
            await Clients.All.SendAsync("ReceiveunselectSeat", seatID);
        }
    }
}
