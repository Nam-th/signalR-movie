"use strict";
//localStorage.clear();

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.on("ReceiveSelectSeat", function (seatID) {
    const seat = document.getElementById(seatID);
    seat.classList.add("locked");
    seat.classList.remove("available");

    // Thêm id của ghế đã chọn vào local storage
    let storedSeatsId = JSON.parse(localStorage.getItem('seatId') || '[]');
    if (!storedSeatsId.includes(seat.id))
        storedSeatsId.push(seat.id);
    localStorage.setItem('seatId', JSON.stringify(storedSeatsId));

});

connection.on("ReceiveUnselectSeat", function (seatID) {
    const seat = document.getElementById(seatID);
    seat.classList.remove("locked");
    seat.classList.add("available");

    // Xóa id của ghế vừa bỏ chọn khỏi local storage
    let storedSeatsId = JSON.parse(localStorage.getItem('seatId') || '[]');

    const indexToDel = storedSeatsId.indexOf(seat.id);
    if (indexToDel != -1)
        storedSeatsId.splice(indexToDel, 1);

    localStorage.setItem('seatId', JSON.stringify(storedSeatsId));
});

connection.start().then(function () {
}).catch(function (err) {
    return console.error(err.toString());
});

//Lấy danh sách ghế
var seats = document.querySelectorAll(".list-seats .seat");

// Xử lí việc người dùng bỏ/chọn ghế
seats.forEach((seat) => {

    // Nếu ghế chưa khóa
    if (!seat.classList.contains("locked")) {

        // Khi ghế có sự kiện 'click'
        seat.addEventListener("click", function (event) {

            handleSelectSeat(seat);
            hanleUnselectSeat(seat);

            event.preventDefault();
        });
    }
})

//Hàm xử lí việc chọn ghế
function handleSelectSeat(seat) {
    // Nếu ghế chưa khóa
    if (!seat.classList.contains('locked')) {
        connection.invoke("SelectSeat", seat.id).catch(function (err) {
            return console.error(err.toString());
        });
        seat.classList.add("selected");

    }
}

//Hàm xử lí việc bỏ chọn ghế
function hanleUnselectSeat(seat) {
    // Nếu ghế đang được chọn và đã khóa
    if (seat.classList.contains('selected') && seat.classList.contains('locked')) {
        connection.invoke("UnselectSeat", seat.id).catch(function (err) {
            return console.error(err.toString());
        });
        seat.classList.remove("selected");

    }
}

// Hàm hiển thị ghế đã được chọn bởi người dùng khác (Locked)
function displayLockedSeat() {
    let storedSeatsId = JSON.parse(localStorage.getItem('seatId') || '[]');
    storedSeatsId.forEach(seatId => {
        const seat = document.getElementById(seatId);
        if (seat) {
            seat.classList.add("locked");
            seat.classList.remove("available");
        }
    })
}

// Khi trang được load
window.onload = function () {

    displayLockedSeat();


    var countdownTimer;

    // Start the countdown timer
    function startCountdown() {
        var seconds = 30;
        countdownTimer = setInterval(function () {
            seconds--;
            if (seconds <= 0) {
                clearInterval(countdownTimer);

                seats.forEach(function (seat) {
                    hanleUnselectSeat(seat);
                });
                alert('Timeout: Your selected seats have been cleared.');
            }
            updateCountdownTimer(seconds);
        }, 1000);
    }

    // Update the countdown timer display
    function updateCountdownTimer(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        document.getElementById('countdown').innerText = minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    }

    // Start countdown when the page loads
    startCountdown();

    // Handle click event for payment button
    document.getElementById('paymentButton').addEventListener('click', function (event) {
        clearInterval(countdownTimer);
        alert('Redirecting to payment page...');
        // Perform redirection to payment page here
        event.preventDefault(); // Prevent default behavior of link click
    });
};