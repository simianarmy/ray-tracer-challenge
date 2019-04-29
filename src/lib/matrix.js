import {floatIsEqual} from "./math";

/**
 * Initialize a rows x columns matrix
 */
export const Matrix = (rows, columns, initValue = 0) => {
  let data = new Array(columns);

  for (let i=0; i<columns; i++) {
    data[i] = new Array(rows);

    for (let j=0; j<rows; j++) {
      data[i][j] = initValue;
    }
  }

  return {
    rows, columns,
    width: () => columns,
    height: () => rows,
    get: (i, j) => data[j][i],
    set: (i, j, val) => data[j][i] = val,
  }
};

/**
 * Initialize a matrix using nested arrays
 */
Matrix.initFromArray = rows => {
  let m = Matrix(rows.length, rows[0].length);

  for (let i=0; i<rows.length; i++) {
    for (let j=0; j<rows[0].length; j++) {
      m.set(i, j, rows[i][j]);
    }
  }

  return m;
};

// operators
//
export const equals = (m1, m2) => {
  if (m1.rows !== m2.rows || m1.columns !== m2.columns) {
    return false;
  }

  for (let i=0; i<m1.rows; i++) {
    for (let j=0; j<m1.columns; j++) {
      if (!floatIsEqual(m1.get(i, j), m2.get(i, j))) {
        return false;
      }
    }
  }

  return true;
};
