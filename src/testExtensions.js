import { equals as tequals } from "./lib/tuple";
import { equals, isInvertible } from "./lib/matrix";
import { floatIsEqual } from "./lib/math";

const toEqualTuple = (received, expected) => {
  const passed = tequals(received, expected);

  if (passed) {
    return {
      pass: true,
      message: () => `expected ${received} not to be equal to ${expected}`
    };
  } else {
    return {
      pass: false,
      message: () => `expected ${received} to be equal to ${expected}`
    };
  }
};

expect.extend({
  toEqualFloat(received, expected) {
    const passed = floatIsEqual(received, expected);

    if (passed) {
      return {
        pass: true,
        message: () => `expected ${received} not to be equal to ${expected}`
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be equal to ${expected}`
      };
    }
  },
  toEqualTuple,
  toEqualPoint(received, expected) {
    return toEqualTuple(received, expected);
  },
  toEqualVector(received, expected) {
    return toEqualTuple(received, expected);
  },
  toEqualColor(received, expected) {
    return toEqualTuple(received, expected);
  },
  toEqualMatrix(received, expected) {
    const passed = equals(received, expected);

    if (passed) {
      return {
        pass: true,
        message: () => `expected ${received} not to be equal to ${expected}`
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be equal to ${expected}`
      };
    }
  },
  toBeInvertible(received) {
    const passed = isInvertible(received);

    if (passed) {
      return {
        pass: true,
        message: () => `expected ${received} not to be invertible`
      };
    } else {
      return {
        pass: false,
        message: () => `expected ${received} to be invertible`
      };
    }
  },
});
