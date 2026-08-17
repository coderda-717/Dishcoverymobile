// dishcovery/app/services/localFallback.js
// ✅ Handles: (1) guest sessions that never persist personal data, and
//             (2) an on-device fallback so the app still works when the
//                 backend can't be reached (offline / server down).
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GUEST_FLAG_KEY = 'isGuest';
const LOCAL_USERS_KEY = 'localUsers'; // offline-only "accounts"
const LOCAL_RECIPES_KEY = 'localRecipes'; // offline-only recipes/cache

// ============================================
// GUEST MODE
// ============================================
// Guest access never writes an email, password, name, token, or any
// other personal info to storage — only a plain boolean flag so the
// app remembers it's in guest mode between screens/launches.
export const enterGuestMode = async () => {
  await AsyncStorage.setItem(GUEST_FLAG_KEY, 'true');
  await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
  // Make sure no leftover session data is hanging around
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userData');
};

export const exitGuestMode = async () => {
  await AsyncStorage.removeItem(GUEST_FLAG_KEY);
};

export const isGuestMode = async () => {
  const flag = await AsyncStorage.getItem(GUEST_FLAG_KEY);
  return flag === 'true';
};

// ============================================
// BACKEND REACHABILITY
// ============================================
// Cheap, short-timeout check so we don't make the user wait a full
// 30s timeout before falling back to local storage.
export const isBackendReachable = async (baseUrl, timeout = 5000) => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(`${baseUrl}/health`.replace('/api/health', '/health'), {
      method: 'GET',
      signal: controller.signal,
    }).catch(() =>
      // Some backends don't expose /health — fall back to hitting the API root
      fetch(baseUrl, { method: 'GET', signal: controller.signal })
    );
    clearTimeout(id);
    return !!response;
  } catch (error) {
    return false;
  }
};

// A request "failed because the backend is unreachable" (as opposed to
// failing with a normal 4xx/5xx from a live server) when fetch throws a
// network-level error or the request timed out via AbortController.
export const isNetworkFailure = (error) => {
  if (!error) return false;
  if (error.name === 'AbortError') return true; // timed out
  if (error.message && /network|failed to fetch|fetch is not defined/i.test(error.message)) {
    return true;
  }
  return false;
};

// ============================================
// LOCAL "AUTH" FALLBACK (offline accounts)
// ============================================
const getLocalUsers = async () => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalUsers = async (users) => {
  await AsyncStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

export const localSignup = async ({ firstName, lastName, email, password }) => {
  const users = await getLocalUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists (offline mode).' };
  }

  const newUser = {
    id: `local-${Date.now()}`,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email: normalizedEmail,
    password, // stored locally only, never sent anywhere while offline
    isLocal: true,
  };

  users.push(newUser);
  await saveLocalUsers(users);

  const { password: _pw, ...safeUser } = newUser;
  return {
    success: true,
    data: {
      token: `local-token-${newUser.id}`,
      user: safeUser,
    },
    offline: true,
  };
};

export const localLogin = async (email, password) => {
  const users = await getLocalUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const found = users.find((u) => u.email === normalizedEmail);

  if (!found || found.password !== password) {
    return { success: false, error: 'Invalid email or password (offline mode).' };
  }

  const { password: _pw, ...safeUser } = found;
  return {
    success: true,
    data: {
      token: `local-token-${found.id}`,
      user: safeUser,
    },
    offline: true,
  };
};

// ============================================
// LOCAL RECIPE CACHE FALLBACK
// ============================================
export const cacheRecipesLocally = async (recipes) => {
  try {
    await AsyncStorage.setItem(LOCAL_RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error caching recipes locally:', error);
  }
};

export const getLocallyCachedRecipes = async () => {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_RECIPES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRecipeLocally = async (recipe) => {
  const recipes = await getLocallyCachedRecipes();
  const localRecipe = {
    ...recipe,
    id: recipe.id || `local-${Date.now()}`,
    _pendingSync: true,
  };
  recipes.unshift(localRecipe);
  await cacheRecipesLocally(recipes);
  return localRecipe;
};

export default {
  GUEST_FLAG_KEY,
  enterGuestMode,
  exitGuestMode,
  isGuestMode,
  isBackendReachable,
  isNetworkFailure,
  localSignup,
  localLogin,
  cacheRecipesLocally,
  getLocallyCachedRecipes,
  saveRecipeLocally,
};