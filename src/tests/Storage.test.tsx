import { describe, it, expect, beforeEach } from 'vitest';
import { setLocal, getLocal, removeLocal } from '../routes/storage';

describe('Local Storage Utilities', () => {
	const testKey = 'testKey';
	const testValue = { username: 'testuser', email: 'testemail' };

	beforeEach(() => {
		localStorage.clear();
	})

	it('sets data in localStorage', () => {
		setLocal(testKey, testValue);

		const stored = localStorage.getItem(testKey);
		expect(stored).toBe(JSON.stringify(testValue));
	});

	it('gets data from localStorage', () => {
		localStorage.setItem(testKey, JSON.stringify(testValue));

		const result = getLocal(testKey);
		expect(result).toEqual(testValue);
	});

	it('returns null if key does not exist', () => {
		const result = getLocal(testKey);
		expect(result).toBeNull();
	});

	it('removes data from localStorage', () => {
		localStorage.setItem(testKey, JSON.stringify(testValue));
		removeLocal(testKey);
		expect(localStorage.getItem(testKey)).toBeNull();
	});
});