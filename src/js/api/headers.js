import { API_KEY } from './constants.js';
import { getToken } from '../utilities/token.js';

/**
 * Generates headers for API requests, including Content-Type, Authorization, and X-Noroff-API-Key.
 * @param {boolean} hasBody - Indicates if the request has a body (for setting Content-Type).
 * @returns {Headers} - Configured headers for the request.
 * @throws {Error} - Throws an error if the user is not logged in (missing token).
 */
export function headers(hasBody = false) {
  const headers = new Headers();
  const token = getToken();

  if (!token) {
    window.location.href = '/auth/login/';
    throw new Error('Authorization token is missing.');
  }

  headers.append('Authorization', `Bearer ${token}`);
  headers.append('X-Noroff-API-Key', API_KEY);

  if (hasBody) {
    headers.append('Content-Type', 'application/json');
  }

  return headers;
}
