import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

const account = getBankAccount(100);
const account2 = getBankAccount(150);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(1000)).toThrow(
      new InsufficientFundsError(account.getBalance()),
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(1000, account2)).toThrow(
      new InsufficientFundsError(account.getBalance()),
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(1000, account)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    expect(account.deposit(100)).toBe(account);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(50)).toBe(account);
  });

  test('should transfer money', () => {
    account.transfer(10, account2);

    expect(account.getBalance()).toBe(140);
    expect(account2.getBalance()).toBe(160);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(80);
    const balance = await account.fetchBalance();
    expect(balance).toBe(80);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(80);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(80);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      new SynchronizationFailedError(),
    );
  });
});
