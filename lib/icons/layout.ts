export type IconGridPlacement = {
  height: number;
  index: number;
  width: number;
  x: number;
  y: number;
};

export type IconGridLayout = {
  height: number;
  placements: IconGridPlacement[];
  width: number;
};

export function getIconGridLayout({
  columns,
  gap,
  iconCount,
  iconSize,
}: {
  columns: number;
  gap: number;
  iconCount: number;
  iconSize: number;
}): IconGridLayout {
  const rows = Math.ceil(iconCount / columns);
  const usedColumns = Math.min(columns, iconCount);

  return {
    height: rows * iconSize + Math.max(rows - 1, 0) * gap,
    placements: Array.from({ length: iconCount }, (_, index) => ({
      height: iconSize,
      index,
      width: iconSize,
      x: (index % columns) * (iconSize + gap),
      y: Math.floor(index / columns) * (iconSize + gap),
    })),
    width: usedColumns * iconSize + Math.max(usedColumns - 1, 0) * gap,
  };
}
