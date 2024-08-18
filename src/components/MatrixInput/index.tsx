import "./MatrixInput.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMatrix } from "../../context/MatrixContext";
import { CellType, MatrixType } from "../../types";

export const MatrixInput: React.FC = () => {
  const { setMatrix, setMatrixValues } = useMatrix();

  const validationSchema = yup
    .object()
    .shape<Record<keyof MatrixType, yup.AnySchema>>({
      highlightAmount: yup
        .number()
        .required("Fill the amount")
        .min(0, "Amount should be positive number")
        .test(
          "Amount",
          "Amount should be less than matrix size",
          (value, context) => {
            const matrixSize = context.parent.columns * context.parent.rows;
            return value < matrixSize
          }
        ),
      columns: yup
        .number()
        .required("Fill columns amount")
        .min(0, "Amount should be positive number")
        .max(100, "Amount should be less or equal 100"),
      rows: yup
        .number()
        .required("Fill row amount")
        .min(0, "Amount should be positive number")
        .max(100, "Amount should be less or equal 100"),
    });

  const handleSubmitForm = () => {
    setMatrix({
      columns: values.columns,
      rows: values.rows,
      highlightAmount: values.highlightAmount,
    });

    const matrixValues = [];

    for (let i = 1; i <= values.rows; i++) {
      const row = [];
      for (let j = 1; j <= values.columns; j++) {
        const item: CellType = {
          id: +((i * 100).toString() + j.toString()),
          amount: Math.floor(Math.random() * 900) + 100,
        };
        row.push(item);
      }
      matrixValues.push(row);
    }

    setMatrixValues(matrixValues);
  };

  const initialValues: MatrixType = {
    columns: 0,
    rows: 0,
    highlightAmount: 0,
  };

  const { values, handleSubmit, handleChange, errors, touched } = useFormik({
    initialValues,
    onSubmit: handleSubmitForm,
    validationSchema,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
  });

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="columns"
            onChange={handleChange}
            value={values.columns || ""}
            placeholder="Columns"
          />
          {errors.columns && touched.columns ? (
            <div className="error">{errors.columns}</div>
          ) : null}
        </div>

        <div>
          <input
            name="rows"
            onChange={handleChange}
            value={values.rows || ""}
            placeholder="Rows"
          />
          {errors.rows && touched.rows ? (
            <div className="error">{errors.rows}</div>
          ) : null}
        </div>

        <div>
          <input
            name="highlightAmount"
            onChange={handleChange}
            value={values.highlightAmount || ""}
            placeholder="Numbers to hightlight"
          />
          {errors.highlightAmount && touched.highlightAmount ? (
            <div className="error">{errors.highlightAmount}</div>
          ) : null}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
