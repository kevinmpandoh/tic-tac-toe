import * as React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

// Reducer slice
const ticTacToe = createSlice({
  name: "ticTacToe",
  initialState: {
    squares: Array(9).fill(null),
    currentStep: 0,
    winner: null,
    nextValue: "X",
    status: "Next player: X",
  },
  reducers: {
    selectSquare(state, action) {
      if (!state.winner && !state.squares[action.payload]) {
        const newSquares = [...state.squares];
        newSquares[action.payload] = calculateNextValue(state.squares);
        const winner = calculateWinner(newSquares);
        const nextValue = calculateNextValue(newSquares);
        const status = calculateStatus(winner, newSquares, nextValue);
        return {
          squares: newSquares,
          winner,
          nextValue,
          status,
        };
      }
    },
    restart(state) {
      const newSquares = Array(9).fill(null);
      const winner = calculateWinner(newSquares);
      const nextValue = calculateNextValue(newSquares);
      const status = calculateStatus(winner, newSquares, nextValue);
      return {
        squares: newSquares,
        winner,
        nextValue,
        status,
      };
    },
  },
});

// Actions
export const { selectSquare, restart, jumpToMove } = ticTacToe.actions;

// Store
const store = configureStore({
  reducer: ticTacToe.reducer,
});

// Components
function Board() {
  const { status, squares } = useSelector((state) => state);
  const dispatch = useDispatch();
  function selectSquareHandler(squareIndex) {
    dispatch(selectSquare(squareIndex));
  }
  function renderSquare(i) {
    return (
      <button
        className="w-[100px] h-[100px]  border border-gray-500 flex items-center justify-center text-4xl font-bold cursor-pointer text-sky-600 hover:bg-gray-300"
        onClick={() => selectSquareHandler(i)}
      >
        {squares[i]}
      </button>
    );
  }

  return (
    <>
      <div className="mb-5 text-center text-2xl text-orange-500">{status}</div>
      <div className="flex flex-wrap w-[300px] h-[300px]">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  );
}

function Game() {
  const dispatch = useDispatch();
  function handleRestart() {
    dispatch(restart());
  }
  return (
    <div className="game flex justify-center items-center h-screen">
      <div className="game-board">
        <Board />
        <div className="flex justify-center">
          <button
            className="bg-red-600 mt-6 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? "X" : "O";
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}

export default App;
