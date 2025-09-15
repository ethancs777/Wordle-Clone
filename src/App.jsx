import './css/App.css'
import Tile from './components/tile'
import { useState, useEffect } from 'react'

const initialGrid = Array.from({ length: 6 }, () => Array(5).fill(''));

function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [activeRow, setActiveRow] = useState(0);
  const [word, setWord] = useState('REACT');

  const fetchWord = async () => {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
      const data = await response.json();
      if (data && data[0]) {
        setWord(data[0].toUpperCase());
        console.log('New word fetched:', data[0].toUpperCase());
        setWord(data[0].toUpperCase());
      }
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  }

  useEffect(() => {
    fetchWord();
  }, []);

  const handleCheck = () => {
    if (grid[activeRow].some(cell => cell.length !== 1)) {
      alert('Not enough letters');
      return;
    }
    if(grid[activeRow].join('') === word) {
      alert('Congratulations! You guessed the word!');
      return;
    } else if (activeRow === 5) {
      alert(`Game Over! The word was ${word}`);
      return;
    } if (activeRow < 5) {
      setActiveRow(activeRow + 1);
    } else {
      alert('Game Over');
    }
  };

  const handleInputChange = (rowIdx, colIdx, value) => {
    console.log('Input change:', { rowIdx, colIdx, value });
    if (value.length > 1) return;
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => (r === rowIdx && c === colIdx ? value.toUpperCase() : cell))
    );
    setGrid(newGrid);
  };

  const isActiveRowFilled = grid[activeRow].every(cell => cell.length === 1);

  return (
    <>
      <div>
        <h1>Wordle</h1>
      </div>
      <div className='board'>
        {grid.map((row, rowIdx) => (
          <div className='row' key={rowIdx}>
            {row.map((cell, colIdx) => (
              <Tile key={colIdx} value={cell} enabled={rowIdx === activeRow} onChange={val => handleInputChange(rowIdx, colIdx, val)} />
            ))}
          </div>
        ))}
        <button className='check-button' onClick={handleCheck} disabled={!isActiveRowFilled}>Check</button>
      </div>
    </>
  );
}

export default App;
