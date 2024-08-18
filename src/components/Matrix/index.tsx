import "./Matrix.css";
import { useMatrix } from "../../context/MatrixContext";
import { useCallback, useMemo, useState } from "react";
import { CellType } from "../../types";

export const Matrix: React.FC = () => {
  const { matrix, matrixValues, setMatrixValues, setMatrix } = useMatrix();
  const [hoveredCell, setHoveredCell] = useState<CellType | null>();
  const [hoveredRow, setHoveredRow] = useState<number | null>();

  const backToStart = useCallback(() => {
    setMatrixValues([]);

    setMatrix({
      columns: 0,
      rows: 0,
      highlightAmount: 0,
    });
  }, [matrix, matrixValues]);

  const removeRow = useCallback(() => {
    const matrixValuesCopy = matrixValues;

    matrixValuesCopy.pop();

    setMatrixValues(matrixValuesCopy);

    setMatrix({
      columns: matrix.columns,
      rows: +matrix.rows - 1,
      highlightAmount: matrix.highlightAmount,
    });
  }, [matrix, matrixValues]);

  const addNewRow = useCallback(() => {
    const matrixValuesCopy = matrixValues;
    const newRow: CellType[] = [];

    for (let i = 1; i <= matrix.columns; i++) {
      const item: CellType = {
        id: +(((+matrix.rows + 1) * 100).toString() + i.toString()),
        amount: Math.floor(Math.random() * 900) + 100,
      };
      newRow.push(item);
    }
    matrixValuesCopy.push(newRow);

    setMatrixValues(matrixValuesCopy);

    setMatrix({
      columns: matrix.columns,
      rows: +matrix.rows + 1,
      highlightAmount: matrix.highlightAmount,
    });
  }, [matrix, matrixValues]);

  const closestAmounts: number[] = useMemo(() => {
    if (!hoveredCell) {
      return [];
    }

    const allValues: CellType[] = [];

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        allValues.push(matrixValues[i][j]);
      }
    }

    const sortedArray = allValues.sort(
      (a, b) =>
        Math.abs(a.amount - hoveredCell.amount) -
        Math.abs(b.amount - hoveredCell.amount)
    );

    const arr = sortedArray
      .slice(0, +matrix.highlightAmount + 1)
      .map((item) => item.id);

    return arr;
  }, [matrix, matrixValues, hoveredCell]);

  const increaseCellValue = useCallback(
    (item: CellType) => {
      const matrixCopy = [...matrixValues];
      let itemTochange: CellType;
      for (let i = 0; i < matrix.rows; i++) {
        const elem = matrixCopy[i].find((i) => i.id === item.id);
        if (elem) {
          itemTochange = elem;
        }
      }

      itemTochange!.amount++;
      setMatrixValues(matrixCopy);
    },
    [matrixValues, matrix]
  );

  const renderHeader = useMemo(() => {
    return (
      <tr>
        <th></th>
        {Array.from(Array(Number(matrix.columns)).keys()).map((item) => (
          <th key={item}>Cell values N={item + 1}</th>
        ))}
        <th>Sum values</th>
      </tr>
    );
  }, [matrix]);

  const renderRow = useCallback(
    (items: CellType[], rowNum: number) => {
      const sumValues = items.reduce((accum, curr) => accum + curr.amount, 0);

      return (
        <tr key={rowNum}>
          <th>Cell value M={rowNum + 1}</th>
          {items.map((item) => (
            <th
              key={item.id}
              onClick={() => increaseCellValue(item)}
              className={
                closestAmounts.includes(item.id)
                  ? "rowValue closest"
                  : "rowValue"
              }
              onMouseEnter={() => setHoveredCell(item)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {rowNum === hoveredRow
                ? ((item.amount / sumValues) * 100).toFixed() + "%"
                : item.amount}
              <div
                className={rowNum === hoveredRow ? "rowHovered" : ""}
                style={{
                  width: ((item.amount / sumValues) * 100).toFixed() + "%",
                }}
              />
            </th>
          ))}
          <th
            onMouseEnter={() => setHoveredRow(rowNum)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            {sumValues}
          </th>
        </tr>
      );
    },
    [closestAmounts, hoveredRow, matrix]
  );

  const renderAverage = useMemo(() => {
    const transposeMatrix = Array.from(
      Array(+matrix.columns),
      () => new Array(+matrix.rows)
    );
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.columns; j++) {
        transposeMatrix[j][i] = matrixValues[i][j].amount;
      }
    }

    return (
      <tr>
        <th>Average values</th>
        {Array.from(Array(Number(matrix.columns)).keys()).map((item) => {
          const average =
            transposeMatrix[item].reduce(
              (sum, currentValue) => sum + currentValue,
              0
            ) / matrix.rows;

          return <th key={item}>{average.toFixed(2)}</th>;
        })}
        <th></th>
      </tr>
    );
  }, [matrix, matrixValues]);

  return (
    <div>
      <table>
        <thead>{renderHeader}</thead>
        <tbody>{matrixValues.map((row, i) => renderRow(row, i))}</tbody>
        <tfoot>{renderAverage}</tfoot>
      </table>

      <div className="buttons">
        <div>
          <button onClick={addNewRow}>Add a new row</button>
          <button onClick={removeRow}>Remove a row</button>
        </div>

        <button onClick={backToStart}>Back</button>
      </div>
    </div>
  );
};
