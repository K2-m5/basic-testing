import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 6, b: 2, action: Action.Subtract, expected: 4 },
  { a: 4, b: 5, action: Action.Multiply, expected: 20 },
  { a: 10, b: 2, action: Action.Multiply, expected: 20 },
  { a: 20, b: 4, action: Action.Divide, expected: 5 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 10, b: 0, action: Action.Divide, expected: Infinity },
  { a: 'invalid', b: 2, action: Action.Add, expected: null },
  { a: 2, b: 2, action: 'invalidAction', expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should calculate $a $action $b correctly and return $expected',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
