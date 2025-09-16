import '../css/Tile.css'

function Tile({ value, enabled, onChange, backgroundColor, flipPhase, inputRef, onEnter }) {
  return (
    <div className="tile">
      <div
        className={`tile-inner${flipPhase === 'flipping' ? ' flipping' : ''}${flipPhase === 'back' ? ' back' : ''}`}
        style={{ transition: 'transform 0.5s', transform: flipPhase === 'back' ? 'rotateY(180deg)' : flipPhase === 'flipping' ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="tile-front">
          <input
            ref={inputRef}
            type="text"
            maxLength="1"
            className='letter'
            value={value || ''}
            disabled={!enabled}
            onChange={e => onChange(e.target.value, e)}
            onInput={e => onChange(e.target.value, e)}
            onKeyDown={e => {
              if (e.key === 'Backspace' && !value) {
                onChange('', { inputType: 'deleteContentBackward' });
              }
              if (e.key === 'Enter' && onEnter) {
                onEnter();
              }
            }}
            style={{ textAlign: 'center', textTransform: 'uppercase' }}
          />
        </div>
        <div className="tile-back" style={{ backgroundColor: backgroundColor || undefined }}>
          <span className='letter'>{value}</span>
        </div>
      </div>
    </div>
  );
}

export default Tile;