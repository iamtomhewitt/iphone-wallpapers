import Square from './square';
import { dayKeyToNumber, dayNumberToDate, getFirstDayOfYear, getTotalDaysInCurrentYear } from '../lib/date';

const Wallpaper = ({ contributions, timeData }: Props) => {
  const numberOfDaysThisYear = getTotalDaysInCurrentYear();
  const dayOfYear = timeData.day_of_year;
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
        <div style={{
          display: 'flex',
          fontSize: '30px',
          margin: 'auto',
        }}>
          <span style={{
            color: '#FF6B36',
          }}>
            {`${daysRemaining}`} days left of {new Date().getFullYear()}
          </span>
        </div>

        <div style={{
          color: '#6d6d6d',
          display: 'flex',
          fontSize: '20px',
          margin: 'auto',
          marginBottom: '30px',
        }}>
          Generated at {timeData.datetime.substring(11, 16)}
        </div>

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
              return (
                <Square
                  contributions={contributionsForDate}
                  dayOfYear={dayOfYear}
                  squareNumber={square + 1}
                />
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );
};

type Props = {
  contributions: Record<string, number>;
  timeData: {
    abbreviation: string;
    client_ip: string;
    datetime: string;
    day_of_week: number;
    day_of_year: number;
    dst: boolean;
    dst_from: string;
    dst_offset: number;
    dst_until: string;
    raw_offset: number;
    timezone: string;
    unixtime: number;
    utc_datetime: string;
    utc_offset: string;
    week_number: number;
  };
}

export default Wallpaper;