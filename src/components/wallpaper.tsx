import Square from './square';
import { dayOfYearToDate, getDayOfYear, getTotalDaysInCurrentYear } from '../lib/date';

const Wallpaper = ({ contributions }: Props) => {
  const rowSize = 14;
  const numberOfDaysThisYear = getTotalDaysInCurrentYear();
  const dayOfYear = getDayOfYear();
  const daysRemaining = numberOfDaysThisYear - dayOfYear;

  const grid = (() => {
    const rows: number[][] = [];

    for (let i = 0; i < numberOfDaysThisYear; i += rowSize) {
      const row: number[] = [];

      for (let j = i; j < i + rowSize && j < numberOfDaysThisYear; j++) {
        row.push(j);
      }

      rows.push(row);
    }

    return rows;
  })();

  return (
    <div style={{
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      display: 'flex',
      fontSize: '40px',
      height: '100%',
      justifyContent: 'center',
      margin: 'auto',
      width: '100%',
    }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '250px',
      }}>
        {grid.map((row, i) => (
          <div
            key={i}
            style={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            {row.map((square) => {
              const [month, day, year] = dayOfYearToDate(square + 1).toLocaleDateString().split('/')
              const lookupDateKey = [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-')
              const contributionsForDate = contributions[lookupDateKey] || 0;
              return <Square contributions={contributionsForDate} squareNumber={square} />;
            })}
          </div>
        ))}

        <div style={{
          margin: 'auto',
          fontSize: '30px',
          display: 'flex',
        }}>
          <span style={{
            color: '#FF6B36',
          }}>
            {`${daysRemaining}`} days left of {new Date().getFullYear()}
          </span>
        </div>

        <div style={{
          margin: 'auto',
          color: '#6d6d6d',
          fontSize: '20px',
          display: 'flex',
        }}>
          Generated at {new Date().toLocaleTimeString().split('GMT')[0].trim().toLowerCase().replace(' ', '')}
        </div>
      </div>
    </div>
  );
};

type Props = {
  contributions: Record<string, number>
}

export default Wallpaper;