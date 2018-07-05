import {Map} from 'immutable'
import { stat } from 'fs';

const MOVE = 'MOVE'

function turnReducer(turn='X', action) {
  if (action.type === MOVE) return turn === 'X' ? 'O' : 'X';
  return turn
}

function boardReducer(board=Map(), action) {
  if (action.type === MOVE) return board.setIn(action.coord, action.player)
  return board
}

export function move(player, coord){
  return {
    type: MOVE,
    player,
    coord,
  }
}

export function bad (state, action) {
  if (action.coord && action.coord.some(coord => coord < 0 || coord > 2)) {
    return `Invalid input`;
  }
  if (action.player !== state.turn) {
    return `Player ${state.turn} it is not your turn!`
  }
  if (state.board && state.board.getIn(action.coord)) {
    return `Square is already taken.`
  }

  return null;
}

export default function gameReducer(state={}, action) {
  if (bad(state, action)) {
    return {...state, error: bad(state, action)}
  }
  return {
    board: boardReducer(state.board, action),
    turn: turnReducer(state.turn, action),
  }
}

// gameReducer(undefined, {
//   type: MOVE,
//   coord: [1, 1],
//   player: 'X',
// })

//row is an object of the row num from the board
function checkRow (board, row, marker) {
  //if marker is blank return false
  if (marker == null || marker === "_") {
    return false;
  }
  //if the marker is x or o check if the the rest of the row hs the same marker
  if (board.getIn([row, 0]) === marker && board.getIn([row, 1]) === marker && board.getIn([row, 2]) === marker) {
    return true;
  }
  return false;
}

function checkCol (board, col, marker) {
  //if marker is blank return false
  if (marker == null || marker === "_") {
    return false;
  }
  if (board.getIn([0, col]) === marker && board.getIn([1, col]) === marker && board.getIn([2, col]) === marker) {
    return true;
  }
  return false;
}

function checkRightDiag (board) {
  let marker = board.getIn([0, 0]);
  if (marker !== 'X' || marker !== 'O') {
    return false;
  }
  if (board.getIn([0, 0]) === marker && board.getIn([1, 1]) === marker && board.getIn([2, 2]) === marker) {
    return true;
  }
  return false;
}

function checkLeftDiag (board) {
  let marker = board.getIn([0, 2]);
  if (marker !== 'X' || marker !== 'O') {
    return false;
  }
  if (board.getIn([0, 2]) === marker && board.getIn([1, 1]) === marker && board.getIn([2, 0]) === marker) {
    return true;
  }
  return false;
}

export function winner(board){
  const [result, victor] = hasWinner(board);
  if (result){
    if (victor === null) {
      console.log(`Draw!`);
    } else {
      console.log(`winner is: ${victor}`);
    }
    process.exit(0);
  }
}

function hasWinner (board) {
  for (let i = 0 ; i < 3; i++) {
    //case row if row has winner
    if (checkRow(board, i, board.getIn([i, 0]))) {
      return [true, board.getIn([i, 0])];
    }
    //case col
    if (checkCol(board, i, board.getIn([0, i]))) {
      return [true, board.getIn([i, 0])];
    }
  }
  if (checkRightDiag(board) ) {
    return [true, board.getIn([0, 0])];
  }
  if(checkLeftDiag(board)){
    return [true, board.getIn([0, 2])];
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board.getIn([i, j]) === '_' || board.getIn([i, j]) == null) {
        return [false, null];
      } 
    }
  }
  return [true, null];
}