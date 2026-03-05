import { jwtDecode } from "jwt-decode";

/**
 * Checks if the JWT token is expired
 * @param {string} token - The JWT token from localStorage
 * @returns {boolean} - True if token is expired or invalid, False if token is valid
 */
export function isTokenExpired(token) {
  if (!token) {
    return true;
  }

  try {
    const decoded = jwtDecode(token);
    
    // Check if the token has an expiration claim
    if (!decoded.exp) {
      // No expiration claim means we can't determine if it's expired
      // Treat as not expired to be safe
      return false;
    }

    // Get current time in seconds
    const currentTime = Date.now() / 1000;
    
    // Return true if the token is expired
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    // If we can't decode the token, treat it as expired
    return true;
  }
}

/**
 * Clears all auth data from localStorage
 */
export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Gets the user data from localStorage if token is valid
 * @returns {object|null} - User data object or null if not authenticated
 */
export function getAuthUser() {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (!token || isTokenExpired(token)) {
    clearAuthData();
    return null;
  }
  
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      // Invalid user data, try to decode from token
      return decodeUserFromToken(token);
    }
  }
  
  return decodeUserFromToken(token);
}

/**
 * Decodes user information from the JWT token
 * @param {string} token - The JWT token
 * @returns {object|null} - User data object or null
 */
function decodeUserFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.sub || decoded.userId,
      name: decoded.name || decoded.fullName || decoded.userName || 'User',
      email: decoded.email || ''
    };
  } catch (e) {
    return null;
  }
}
