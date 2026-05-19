import { dayOfYearToDate, getDayOfYear, getTotalDaysInCurrentYear } from './date';

const Wallpaper = ({ contributions }: Props) => {
  const rowSize = 14;
  const numberOfDaysThisYear = getTotalDaysInCurrentYear();
  const dayOfYear = getDayOfYear();
  const daysRemaining = numberOfDaysThisYear - dayOfYear;
  const daysRemainingPercentage = (100 - (((numberOfDaysThisYear - daysRemaining) / numberOfDaysThisYear) * 100)).toFixed(1);

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
              // TODO this would probs be better a a `Cell` component or something
              let background = '#28272D';
              let border = 'none';
              const dateOfSquare = dayOfYearToDate(square + 1).toISOString().split('T')[0];
              const contributionsForDate = contributions[dateOfSquare] || 0;

              if (dateOfSquare === '2026-10-26') {
                border = '6px solid #009DC4';
                background = '#009DC4';
              }
              else if (square === getDayOfYear()) {
                border = '6px solid #5cb85c';
              }

              if (contributionsForDate > 50) {
                background = '#D2DCFF';
              }
              else if (contributionsForDate > 40) {
                background = '#7992F5';
              }
              else if (contributionsForDate > 30) {
                background = '#4E65CD';
              }
              else if (contributionsForDate > 20) {
                background = '#303570';
              }
              else if (contributionsForDate > 0) {
                background = '#28272D';
              }

              return (
                <div
                  key={square}
                  style={{
                    background,
                    border,
                    borderRadius: '30%',
                    display: 'flex',
                    height: '35px',
                    margin: '8px',
                    width: '35px',
                  }}
                />
              );
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
          Generated on {new Date().toTimeString().split('GMT')[0].trim()}
        </div>
      </div>
    </div>
  );
};

type Props = {
  contributions: Record<string, number>
}

export default Wallpaper;