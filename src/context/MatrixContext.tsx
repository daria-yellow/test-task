import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { CellType, MatrixType } from "../types";

export interface MatrixContextType {
  matrix: MatrixType;
  matrixValues: CellType[][];
  setMatrix: Dispatch<SetStateAction<MatrixType>>;
  setMatrixValues: Dispatch<SetStateAction<CellType[][]>>;
}

export const MatrixContext = React.createContext<MatrixContextType | null>(
  null
);

const defaultMatrix: MatrixType = {
  columns: 0,
  rows: 0,
  highlightAmount: 0,
};

interface MatrixProviderProps {
  children: ReactNode;
}

export const MatrixProvider: React.FC<MatrixProviderProps> = ({ children }) => {
  const [matrix, setMatrix] = useState<MatrixType>(defaultMatrix);
  const [matrixValues, setMatrixValues] = useState<CellType[][]>([]);

  return (
    <MatrixContext.Provider
      value={{ matrix, matrixValues, setMatrix, setMatrixValues }}
    >
      {children}
    </MatrixContext.Provider>
  );
};

export const useMatrix = (): MatrixContextType => {
  const context = useContext(MatrixContext);
  if (!context) {
    throw new Error("useMatrix must be used within a MatrixProvider");
  }
  return context;
};
