const ColorPalette = () => {
  const penColors = [
    "#000000",
    "#FFFFFF",
    "#7B7B8B",
    "#FF1744", // red
    "#1E90FF", // blue
    "#00C853", // green
    "#FFD600", // yellow
    "#FF6D00", // orange
    "#AA00FF", // purple
  ];
  return (
    <div className="absolute bg-white grid grid-cols-5 -top-[124px] p-4 left-0 bg-red-1500  border gap-4 w-[234px] rounded-lg">
      {penColors.map((color) => {
        return (
          <div
            key={color}
            className={
              `w-8 h-8 rounded-full cursor-pointer${
                (color === '#FFFFFF' || color === '#F9F9F9') ? ' !border !border-gray-300' : ''
              }`
            }
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
};

export default ColorPalette;
