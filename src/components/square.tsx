import { dayOfYearToDate, getDayOfYear } from '../lib/date';

const Square = ({ contributions = 0, squareNumber = 0 }: Props) => {
  const dateOfSquare = dayOfYearToDate(squareNumber + 1).toISOString().split('T')[0];
  const dayOfYear = getDayOfYear();
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

    if (dateOfSquare === '2026-10-26') {
      border = '6px solid #FF6B36';
      background = '#FF6B36';
    }
    else if (squareNumber === dayOfYear) {
      border = '2px solid #5cb85c';
      background = '#5cb85c';
    }
    else if (squareNumber > dayOfYear) {
      background = '#1f1f1f';
    }

    return {
      background,
      border, 
    };
  })();

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