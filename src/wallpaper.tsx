import { getDayOfYear, getTotalDaysInCurrentYear } from './date';

const Wallpaper = () => {
  const rowSize = 14;
  const numberOfDaysThisYear = getTotalDaysInCurrentYear();
  const dayOfYear = getDayOfYear();
  const daysRemaining = numberOfDaysThisYear - dayOfYear;
  const daysRemainingPercentage = (((numberOfDaysThisYear - daysRemaining) / numberOfDaysThisYear) * 100).toFixed(1);

  // gitlab contributions: https://gitlab.com/users/thewitt_wh/calendar.json

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
              let border = 'none';

              if (square === getDayOfYear()) {
                border = '6px solid green';
              }

              return (
                <div
                  key={square}
                  style={{
                    background: '#28272D',
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
            {`${daysRemaining}`} days left
          </span>

          <span style={{
            color: '#38373f',
          }}>
            {` - ${daysRemainingPercentage}`}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Wallpaper;