export const iconSize = 40;

export function getIconGridDimensions({
  columns,
  gap,
  iconCount,
}: {
  columns: number;
  gap: number;
  iconCount: number;
}) {
  const rows = Math.ceil(iconCount / columns);
  const usedColumns = Math.min(columns, iconCount);

  return {
    height: rows * iconSize + Math.max(rows - 1, 0) * gap,
    width: usedColumns * iconSize + Math.max(usedColumns - 1, 0) * gap,
  };
}
