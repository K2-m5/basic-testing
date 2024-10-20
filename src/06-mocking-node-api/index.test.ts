import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 2000;

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 2000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 2000;

    const setTimeoutSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 2000;

    doStuffByInterval(callback, timeout);

    jest.advanceTimersByTime(timeout * 4);

    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  const mockFilePath = 'test.txt';
  const mockFullPath = `/some/path/${mockFilePath}`;
  const mockFileContent = 'File content';

  beforeEach(() => {
    (join as jest.Mock).mockReturnValue(mockFullPath);
  });

  test('should call join with pathToFile', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(mockFileContent));

    const result = await readFileAsynchronously(mockFilePath);

    expect(join).toHaveBeenCalledWith(__dirname, mockFilePath);
    expect(existsSync).toHaveBeenCalledWith(mockFullPath);
    expect(readFile).toHaveBeenCalledWith(mockFullPath);
    expect(result).toBe(mockFileContent);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(mockFilePath);

    expect(join).toHaveBeenCalledWith(__dirname, mockFilePath);
    expect(existsSync).toHaveBeenCalledWith(mockFullPath);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(mockFileContent));

    const result = await readFileAsynchronously(mockFilePath);

    expect(join).toHaveBeenCalledWith(__dirname, mockFilePath);
    expect(existsSync).toHaveBeenCalledWith(mockFullPath);
    expect(readFile).toHaveBeenCalledWith(mockFullPath);
    expect(result).toBe(mockFileContent);
  });
});
