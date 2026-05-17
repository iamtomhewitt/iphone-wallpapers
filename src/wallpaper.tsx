const Wallpaper = (props: any) => {
  const randomColour = (() => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  })();

  return (
    <div style={{
      alignItems: 'center',
      backgroundColor: randomColour,
      display: 'flex',
      fontSize: '40px',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    }}
    >
      Hello world!
    </div>
  );
};

export default Wallpaper;