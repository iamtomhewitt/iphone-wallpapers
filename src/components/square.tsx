import { dayNumberToDate } from '../lib/date';

const Square = ({ contributions = 0, dayOfYear = 0, squareNumber = 0 }: Props) => {
  const dateOfSquare = dayNumberToDate(squareNumber);
  const isToday = squareNumber === dayOfYear;
  const isFuture = squareNumber > dayOfYear;
  const isPast = squareNumber <= 0;
  const isBirthday = dateOfSquare === '2026-10-26';
  const isSecondMonday = (() => {
    // 1970-01-05 is a known Monday (UTC)
    const anchorMonday = new Date('1970-01-05T00:00:00Z');
    const date = new Date(`${dateOfSquare}T00:00:00Z`);
    const isMonday = date.getUTCDay() === 1;
    const diffInDays = Math.floor((date.getTime() - anchorMonday.getTime()) / (1000 * 60 * 60 * 24));
    return isMonday && (Math.floor(diffInDays / 7) % 2 === 0);
  })();

  const css = (() => {
    let background = '#28272D';
    let border = 'none';
    let margin = '8px';

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

    if (isSecondMonday) {
      margin = '8px 8px 8px 32px';
    }

    return {
      background,
      border,
      margin,
    };
  })();

  if (isPast) {
    return <div
      style={{
        ...css,
        background: 'transparent',
        borderRadius: '30%',
        display: 'flex',
        height: '35px',

        width: '35px',
      }}
    />;
  }

  return (
    <div
      style={{
        ...css,
        borderRadius: '30%',
        display: 'flex',
        height: '35px',
        width: '35px',
      }}
    />
  );
};

type Props = {
  contributions: number;
  dayOfYear: number;
  squareNumber: number;
}

export default Square;