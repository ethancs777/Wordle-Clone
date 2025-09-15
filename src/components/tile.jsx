import '../css/Tile.css'

function Tile({ value, enabled, onChange }) {
  return (
    <div className={"tile"}>
      <input
        type="text"
        maxLength="1"
        className='letter'
        value={value || ''}
        disabled={!enabled}
        onChange={e => onChange(e.target.value)}
        style={{ textAlign: 'center', textTransform: 'uppercase' }}
      />
    </div>
  );
}

export default Tile;