/* eslint-disable @typescript-eslint/no-empty-function */
// Uncomment the code below and write your tests
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    mockOne();
    mockTwo();
    mockThree();

    expect(consoleSpy).not.toHaveBeenCalledWith('foo');
    expect(consoleSpy).not.toHaveBeenCalledWith('bar');
    expect(consoleSpy).not.toHaveBeenCalledWith('baz');

    consoleSpy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    unmockedFunction();

    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');

    consoleSpy.mockRestore(); // Восстанавливаем поведение консоли после теста
  });
});
