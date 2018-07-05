import {Map} from 'immutable'

// {
//   1: {
//     1: X
//     2: null
//     3: O
//   }
//   2:
//   3:
// }

let board = Map();
for (let row = 0; row < 3; row++){
  for (let col = 0; col < 3; col++){
    board = board.setIn([row, col], '_')
  }
}
const turn = 'X';

const MOVE = 'MOVE';

//action generator
export function move(player, position){
  return {
    type: MOVE,
    position, //[row, col]
    player,
  }
}

export default function gameReducer(state = { board, turn }, action) {
  // TODO
  switch( action.type ){
    case MOVE:
      return {
        board: state.board.setIn(action.position, action.player),
        turn: action.player === 'X' ? 'O' : 'X',
      };
    default:
      return state;
  }
}

// module.exports = {
//   move
// }