export const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const API_ENDPOINTS = {
  SEARCH: `${API_BASE_URL}/search.php`,
  LOOKUP: `${API_BASE_URL}/lookup.php`,
  RANDOM: `${API_BASE_URL}/random.php`,
} as const;

export const MAX_SEARCH_QUERY_LENGTH = 100;
export const MEAL_DB_MAX_INGREDIENTS = 20;
export const CLICK_THRESHOLD_MS = 200;
