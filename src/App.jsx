/* 
Main body of the Wordle game application. Animations generated using GenAI tools.
*/

import './css/App.css'
import Tile from './components/tile'
import React, { useState, useEffect, useRef } from 'react'

const initialGrid = Array.from({ length: 6 }, () => Array(5).fill(''));
const initialColors = Array.from({ length: 6 }, () => Array(5).fill(''));
const WORD_LIST = [
  'REACT', 'PLANT', 'WORLD', 'GAMES', 'SHARE', 'BRAVE', 'CODES', 'TREND', 'LEARN', 'SMART',
  'QUICK', 'VIVID', 'MOUSE', 'CHAIR', 'SWORD', 'BRAIN', 'CLOUD', 'SHEET', 'SNAKE', 'TRIAL',
  'APPLE', 'BERRY', 'CRANE', 'DREAM', 'EAGER', 'FAITH', 'GRACE', 'HEART', 'INDEX', 'JOKER',
  'KNIFE', 'LUNCH', 'MAGIC', 'NURSE', 'OCEAN', 'PIZZA', 'QUEEN', 'ROBIN', 'SUGAR', 'TIGER',
  'UNION', 'VOTER', 'WOMAN', 'YOUTH', 'ZEBRA', 'ALERT', 'BASIC', 'CANDY', 'DELTA', 'ENEMY',
  'FANCY', 'GIANT', 'HONEY', 'INPUT', 'JELLY', 'KNOCK', 'LEMON', 'MANGO', 'NOBLE', 'OPERA',
  'PRIZE', 'QUILT', 'RIVER', 'SOLAR', 'TOWER', 'URBAN', 'VIRUS', 'WAGON', 'YEAST', 'ZONED',
  'ANGEL', 'BLEND', 'COVER', 'DRIVE', 'EAGLE', 'FLOOD', 'GHOST', 'HUMAN', 'IDEAL', 'JUDGE',
  'KARMA', 'LASER', 'MERCY', 'NINJA', 'OASIS', 'PILOT', 'QUOTA', 'RANCH', 'SHOCK', 'THINK',
  'ULTRA', 'VILLA', 'WORST', 'YACHT', 'ZESTY', 'ADULT', 'BLOOM', 'CIVIL', 'DEPTH', 'EPOCH',
  'FIBER', 'GLASS', 'HABIT', 'ICING', 'JOLLY', 'KNEEL', 'LAYER', 'METER', 'NORTH', 'OZONE'
];

function getRandomWord() {
  const idx = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[idx];
}

function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [tileColors, setTileColors] = useState(initialColors);
  const [activeRow, setActiveRow] = useState(0);
  const [word, setWord] = useState('');
  const [revealing, setRevealing] = useState(false);
  const [flipPhases, setFlipPhases] = useState(Array(6).fill(null).map(() => Array(5).fill('front')));
  const [showHelp, setShowHelp] = useState(false);
  const revealStagger = 0.15;
  const inputRefs = useRef(Array.from({ length: 6 }, () => Array(5).fill(null).map(() => React.createRef())));

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  useEffect(() => {
    console.log('Target word:', word);
  }, [word]);

  const handleCheck = () => {
    if (revealing) return;
    if (grid[activeRow].some(cell => cell.length !== 1)) {
      alert('Not enough letters');
      return;
    }
    const guess = grid[activeRow].join('');
    const wordArr = word.split('');
    const guessArr = guess.split('');
    const rowColors = Array(5).fill('gray');
    const used = Array(5).fill(false);
    for (let i = 0; i < 5; i++) {
      if (guessArr[i] === wordArr[i]) {
        rowColors[i] = 'green';
        used[i] = true;
      }
    }
    for (let i = 0; i < 5; i++) {
      if (rowColors[i] !== 'green') {
        for (let j = 0; j < 5; j++) {
          if (!used[j] && guessArr[i] === wordArr[j]) {
            rowColors[i] = 'gold';
            used[j] = true;
            break;
          }
        }
      }
    }
    setRevealing(true);
    setFlipPhases(phases => phases.map((row, idx) => idx === activeRow ? Array(5).fill('front') : row));
    function flipTile(idx) {
      if (idx >= 5) {
        setTimeout(() => {
          setRevealing(false);
          if (guess === word) {
            alert('Congratulations! You guessed the word!');
            return;
          }
          if (activeRow < 5) {
            setActiveRow(activeRow + 1);
          } else {
            alert('Game Over');
          }
        }, revealStagger * 1000);
        return;
      }
      setFlipPhases(phases => phases.map((row, ridx) =>
        ridx === activeRow ? row.map((phase, cidx) => cidx === idx ? 'flipping' : phase) : row
      ));
      setTimeout(() => {
        setFlipPhases(phases => phases.map((row, ridx) =>
          ridx === activeRow ? row.map((phase, cidx) => cidx === idx ? 'back' : phase) : row
        ));
        setTileColors(colors => {
          const updated = [...colors];
          const rowCopy = [...updated[activeRow]];
          rowCopy[idx] = rowColors[idx];
          updated[activeRow] = rowCopy;
          return updated;
        });
        setTimeout(() => {
          flipTile(idx + 1);
        }, (revealStagger * 1000) / 2);
      }, (revealStagger * 1000) / 2);
    }
    flipTile(0);
  };

  const handleInputChange = (rowIdx, colIdx, value, event) => {
    if (value.length > 1) return;
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => (r === rowIdx && c === colIdx ? value.toUpperCase() : cell))
    );
    setGrid(newGrid);
    if (value && colIdx < 4) {
      inputRefs.current[rowIdx][colIdx + 1].current?.focus();
    }
    if (
      event &&
      event.inputType === 'deleteContentBackward' &&
      !value &&
      colIdx > 0
    ) {
      setGrid(g => g.map((row, r) =>
        row.map((cell, c) => (r === rowIdx && c === colIdx - 1 ? '' : cell))
      ));
      inputRefs.current[rowIdx][colIdx - 1].current?.focus();
    }
  };

  const isActiveRowFilled = grid[activeRow].every(cell => cell.length === 1);

  return (
    <>
      <a
        href="#"
        id="help"
        aria-label="Help and instructions for playing Wordle"
        style={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}
        onClick={e => { e.preventDefault(); setShowHelp(true); }}
      >
        <img src="help.svg" alt="Help and instructions for playing Wordle" style={{ width: 32, height: 32, cursor: 'pointer' }} />
      </a>
      {showHelp && (
        <div className="help-modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={e => e.stopPropagation()}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontFamily: 'Arial, sans-serif' }}>How to Play</h1>
            <ul>
              <li>Guess the 5-letter word in 6 tries.</li>
              <li>Each guess must be a valid 5-letter word.</li>
              <li>After each guess, the color of the tiles will change to show how close your guess was to the word.</li>
              <li>Green indicates the letter is correct and in the right position.</li>
              <li>Yellow indicates the letter is in the word but in the wrong position.</li>
              <li>Gray indicates the letter is not in the word.</li>
            </ul>
            <button onClick={() => setShowHelp(false)}>Close</button>
          </div>
        </div>
      )}
      <div>
        <h1>
          {'Wordle'.split('').map((char, i) => {
            const colorClasses = ['green', 'green', 'yellow', 'yellow', 'gray', 'gray'];
            return <span key={i} className={colorClasses[i]}>{char}</span>;
          })}
        </h1>
      </div>
      <div className='board'>
        {grid.map((row, rowIdx) => (
          <div className='row' key={rowIdx}>
            {row.map((cell, colIdx) => (
              <Tile
                key={colIdx}
                value={cell}
                enabled={rowIdx === activeRow && !revealing}
                onChange={(val, e) => handleInputChange(rowIdx, colIdx, val, e)}
                backgroundColor={tileColors[rowIdx][colIdx]}
                flipPhase={flipPhases[rowIdx][colIdx]}
                inputRef={inputRefs.current[rowIdx][colIdx]}
                onEnter={() => {
                  if (rowIdx === activeRow && isActiveRowFilled && !revealing) handleCheck();
                }}
              />
            ))}
          </div>
        ))}
        <button className='check-button' onClick={handleCheck} disabled={!isActiveRowFilled || revealing}>Check</button>
      </div>
    </>
  );
}

export default App;
