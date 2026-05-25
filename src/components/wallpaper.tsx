import Square from './square';
import { dayKeyToNumber, dayNumberToDate, getDayOfYear, getFirstDayOfYear, getTotalDaysInCurrentYear } from '../lib/date';

const Wallpaper = ({ contributions }: Props) => {
  const numberOfDaysThisYear = getTotalDaysInCurrentYear();
  const dayOfYear = getDayOfYear();
  const numberOfDaysBeforeYearStarts = dayKeyToNumber(getFirstDayOfYear());
  const rowSize = 14;
  const daysRemaining = numberOfDaysThisYear - dayOfYear;

  const grid = (() => {
    const rows: number[][] = [];

    for (let i = -numberOfDaysBeforeYearStarts; i < numberOfDaysThisYear + numberOfDaysBeforeYearStarts; i += rowSize) {
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
              const lookupDateKey = dayNumberToDate(square + 1);
              const contributionsForDate = contributions[lookupDateKey] || 0;
              return <Square contributions={contributionsForDate} squareNumber={square + 1} />;
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
  contributions: Record<string, number>;
}

export default Wallpaper;