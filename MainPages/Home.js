import { board, calculateWinner, squarify } from 'public/game-logic.js'
import { autorun, observable } from 'mobx';
import { sendData } from 'backend/realtime';
import { subscribe, unsubscribe } from 'wix-realtime';

let state = observable ({
  	player: 'X',
  	board,
  	winner: null,
  	subscriptionId: null, // remove later
  	channel: { name: 'thisChannel' }
})

$w.onReady( function () {
// handle creation of new repeated items
  	$w('#repeater1').onItemReady(($item, itemData) => {
    	autorun(() => $item('#square').label = itemData.piece)
  	});

// set the repeater data, triggering the creation of new items
	autorun(() => $w("#repeater1").data = state.board)

	subscribe( state.channel, handleMove)
	.then((id) => {
	  	state.subscriptionId = id
      	console.log(`${id} has joined the channel`);
	})

	$w('#square').onClick((event) => {
	// send move to subscribers
		let data = {
			context: event.context,
			piece: state.player
		}
		sendMove(data)
	})	
});

function turnover() {
// determine if someone won
	let winner = calculateWinner(squarify(state.board))
    if (winner) {
      state.winner = winner;
      showWinner(state);
      return;
    }
// if nobody won, change player
    state.player === 'X' ? state.player = 'O' : state.player = 'X'
}

function showWinner(state) {
  $w('#winnerBox').show()
  $w('#winnerText').text = `${state.winner} wins!`
  resetBoard(state);
}

const resetBoard = (state) => {
   // reset board state
   state.board.forEach((item) => { item.piece = "" })
   // enable square click
   $w("#repeater1").forEachItem(($item, itemData, index) => {
       $item("#square").enable()
   })
}

export function resetButton_click(event) {
	resetBoard(state)
}

export function closeButton_click(event) {
	$w('#winnerBox').hide()
}

// Start of Realtime Integration

const sendMove = (move) => {
	sendData('thisChannel', move).then(() => {
		// displayMove()
	}).catch(err => { console.error(err) })
}

const handleMove = ({ payload }) => {
// update board state
	state.board[payload.data.context.itemId].piece = state.player 
// disable button on click
	let $item = $w.at(payload.data.context)
	$item("#square").disable()
// change turn
	turnover()
