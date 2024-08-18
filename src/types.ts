export type MatrixType = {
  columns: number;
  rows: number;
  highlightAmount: number;
};

export type CellIdType = number;
export type CellValueType = number;

export type CellType = {
  id: CellIdType;
  amount: CellValueType;
};
