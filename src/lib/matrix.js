import { floatIsEqual } from "./math";
import { Tuple } from "./tuple";

/**
 * Initialize a rows x columns matrix
 */
export const Matrix = (rows, columns, initValue = 0) => {
  let data = new Array(columns);

  for (let i = 0; i < columns; i++) {
    data[i] = new Array(rows);

    for (let j = 0; j < rows; j++) {
      data[i][j] = initValue;
    }
  }

  return {
    rows,
    columns,
    width: () => columns,
    height: () => rows,
    get: (i, j) => data[j][i],
    set: (i, j, val) => (data[j][i] = val),
    row: i => {
      return data.reduce((acc, curr) => {
        acc.push(curr[i]);
        return acc;
      }, []);
    },
    col: i => data[i],
    toString: () => {
      let s = "";
      for (let i = 0; i < rows; i++) {
        s += "\n| ";
        for (let j = 0; j < columns; j++) {
          s += data[j][i] + " | ";
        }
      }
      return s;
    }
  };
};

/**
 * Initialize a matrix using nested arrays
 */
Matrix.initFromArray = rows => {
  let m = Matrix(rows.length, rows[0].length);

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      m.set(i, j, rows[i][j]);
    }
  }

  return m;
};

/**
 * Identity matrix (4x4 only)
 */
Matrix.identity = Matrix.initFromArray([
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
]);

// operators
//
export const equals = (m1, m2) => {
  if (m1.rows !== m2.rows || m1.columns !== m2.columns) {
    return false;
  }

  for (let i = 0; i < m1.rows; i++) {
    for (let j = 0; j < m1.columns; j++) {
      if (!floatIsEqual(m1.get(i, j), m2.get(i, j))) {
        return false;
      }
    }
  }

  return true;
};

/**
 * matrix multiplication for matrices of equal dimensions
 * ie. 2x2, 4x4, etc.
 * @returns {Matrix}
 */
export const multiply = (m1, m2) => {
  let m = Matrix(m1.rows, m1.columns);

  for (let i = 0; i < m1.rows; i++) {
    for (let j = 0; j < m1.columns; j++) {
      let product = 0;

      for (let k = 0; k < m1.rows; k++) {
        product += m1.get(i, k) * m2.get(k, j);
      }

      m.set(i, j, product);
    }
  }

  return m;
};

/**
 * matrix multipication with 1x4 tuple
 * @returns {Tuple}
 */
export const multiplyTuple = (m, t) => {
  const x =
    m.get(0, 0) * t.x +
    m.get(0, 1) * t.y +
    m.get(0, 2) * t.z +
    m.get(0, 3) * t.w;
  const y =
    m.get(1, 0) * t.x +
    m.get(1, 1) * t.y +
    m.get(1, 2) * t.z +
    m.get(1, 3) * t.w;
  const z =
    m.get(2, 0) * t.x +
    m.get(2, 1) * t.y +
    m.get(2, 2) * t.z +
    m.get(2, 3) * t.w;
  const w =
    m.get(3, 0) * t.x +
    m.get(3, 1) * t.y +
    m.get(3, 2) * t.z +
    m.get(3, 3) * t.w;

  return Tuple(x, y, z, w);
};

/**
 * @returns {Matrix}
 */
export const transpose = m => {
  let data = [];

  for (let i = 0; i < m.columns; i++) {
    let row = [];

    for (let j = 0; j < m.rows; j++) {
      row.push(m.get(j, i));
    }

    data.push(row);
  }

  return Matrix.initFromArray(data);
};

/**
 * Calculates determinant of a matrix
 * @returns {Number}
 */
export const determinant = m => {
  let det = 0;

  if (m.rows === 2) {
    det = m.get(0, 0) * m.get(1, 1) - m.get(0, 1) * m.get(1, 0);
  } else {
    for (let j = 0; j < m.columns; j++) {
      det += m.get(0, j) * cofactor(m, 0, j);
    }
  }

  return det;
};

/**
 * Remove row and col from matrix m
 * @returns {Matrix}
 */
export const submatrix = (m, row, col) => {
  let sub = Matrix(m.rows - 1, m.columns - 1);

  for (let i = 0, mi = 0; i < m.rows; i++) {
    if (i !== row) {
      for (let j = 0, mj = 0; j < m.columns; j++) {
        if (j !== col) {
          sub.set(mi, mj, m.get(i, j));
          mj++;
        }
      }
      mi++;
    }
  }

  return sub;
};

/**
 * Calculates matrix minor
 * @returns {Number}
 */
export const minor = (m, row, col) => determinant(submatrix(m, row, col));

/**
 * @returns {Number}
 */
export const cofactor = (m, row, col) => {
  const m_minor = minor(m, row, col);

  return (row + col) % 2 ? -m_minor : m_minor;
};

export const isInvertible = m => determinant(m) !== 0;

/**
 * @returns {Matrix}
 */
export const inverse = m => {
  if (!isInvertible(m)) {
    throw new Error(`inverse: matrix is not invertible: ${m.toString()}`);
  }

  let m2 = Matrix(m.rows, m.columns);
  const md = determinant(m);

  for (let i = 0; i < m.rows; i++) {
    for (let j = 0; j < m.columns; j++) {
      const c = cofactor(m, i, j);

      // Precision here might cause problems with unit tests
      //m2.set(j, i, Number((c / md).toPrecision(5)));
      m2.set(j, i, c / md);
    }
  }

  return m2;
};
