import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const mockedAxios = axios.create as jest.Mock;
    const axiosClientMock = { get: jest.fn().mockResolvedValue({ data: {} }) };
    mockedAxios.mockReturnValue(axiosClientMock);

    await throttledGetDataFromApi('/posts');

    expect(mockedAxios).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockedAxios = axios.create as jest.Mock;
    const axiosClientMock = { get: jest.fn().mockResolvedValue({ data: {} }) };
    mockedAxios.mockReturnValue(axiosClientMock);

    await throttledGetDataFromApi('/posts/1');

    expect(axiosClientMock.get).toHaveBeenCalledWith('/posts/1');
  });

  test('should return response data', async () => {
    const mockedAxios = axios.create as jest.Mock;
    const responseData = { id: 1, title: 'Test Post' };
    const axiosClientMock = {
      get: jest.fn().mockResolvedValue({ data: responseData }),
    };
    mockedAxios.mockReturnValue(axiosClientMock);

    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toEqual(responseData);
  });
});
