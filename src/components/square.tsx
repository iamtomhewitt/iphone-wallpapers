import { dayNumberToDate, getDayOfYear } from '../lib/date';

const Square = ({ contributions = 0, squareNumber = 0 }: Props) => {
  const dateOfSquare = dayNumberToDate(squareNumber);
  const dayOfYear = getDayOfYear();
  const isToday = squareNumber === dayOfYear;
  const isFuture = squareNumber > dayOfYear;
  const isPast = squareNumber <= 0;
  const isBirthday = dateOfSquare === '2026-10-26';

  const { background, border } = (() => {
    let background = '#28272D';
    let border = 'none';

    if (contributions > 50) {
      background = '#D2DCFF';
    }
    else if (contributions > 40) {
      background = '#7992F5';
    }
    else if (contributions > 30) {
      background = '#4E65CD';
    }
    else if (contributions > 20) {
      background = '#303570';
    }
    else if (contributions > 0) {
      background = '#312e3e';
    }

    if (isBirthday) {
      border = '6px solid #FF6B36';
      background = '#FF6B36';
    }
    else if (isToday) {
      border = '2px solid #5cb85c';
      background = '#5cb85c';
    }
    else if (isFuture) {
      background = '#1f1f1f';
    }

    return {
      background,
      border,
    };
  })();

  if (isPast) {
    return <div
      style={{
        background: 'transparent',
        border,
        borderRadius: '30%',
        display: 'flex',
        height: '35px',
        margin: '8px',
        width: '35px',
      }}
    />;
  }

  return (
    <div
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
};

type Props = {
  contributions: number;
  squareNumber: number;
}

export default Square;