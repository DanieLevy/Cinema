'use strict'

var gCinema
var gElSelectedSeat = null

function onInit() {
    gCinema = createCinema()
    renderCinema()
}


function createCinema() {
    var cinema = []
    for (var i = 0; i < 7; i++) {
        cinema[i] = []
        for (var j = 0; j < 15; j++) {
           var cell = {
                isSeat: (j !== 7)
           }
              if (cell.isSeat) {
                  cell.price = 5 + i
                cell.isBooked = false
              }
            cinema[i][j] = cell
            

        }
    }
    cinema[3][7].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gCinema[i].length; j++) {
            var className = (gCinema[i][j].isSeat) ? 'seat' : 'empty'
            if (gCinema[i][j].isBooked) className += ' booked'
            if (i === 3 && j === 7) className += ' aisle'
            strHTML += `<td class="${className}" 
            onclick="onSeatClicked(this, ${i}, ${j})"><span class="inSeatText"></span></td>`
        }
        strHTML += '</tr>'
    }
    var elCinema = document.querySelector('.cinema')
    elCinema.innerHTML = strHTML


}

function onSeatClicked(elCell, i, j) {
    if (!gCinema[i][j].isSeat) return
    if (gCinema[i][j].isBooked) return
    if (gElSelectedSeat) gElSelectedSeat.classList.remove('selected')
    gElSelectedSeat = elCell
    gElSelectedSeat.classList.add('selected')
    var pos = { i: i, j: j }
    showSeatDetails(pos)
}

function showSeatDetails(pos) {
    var elPopup = document.querySelector('.popup')
    elPopup.hidden = false
    var seatPrice = gCinema[pos.i][pos.j].price
    var elSeatDetails = document.querySelector('.seat-details')
    var elBtn = document.querySelector('.btn-book')
    elSeatDetails.innerHTML = `
    Reserve your seat: <br>
    Seat: ${pos.i + 1}-${pos.j + 1} <br> 
    Price: ${gCinema[pos.i][pos.j].price}$ <br>
    Available seats: ${countAvailableSeats(gCinema, pos.i, pos.j)}`
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j


}

function onBookSeat(elBtn){
    var i = +elBtn.dataset.i
    var j = +elBtn.dataset.j
    gCinema[i][j].isBooked = true
    renderCinema()
    hideSeatDetails()
}

function hideSeatDetails() {
    var elPopup = document.querySelector('.popup')
    elPopup.hidden = true
}

function countAvailableSeats(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if ( i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isSeat && !board[i][j].isBooked) count++
        }
    }
    return count
}