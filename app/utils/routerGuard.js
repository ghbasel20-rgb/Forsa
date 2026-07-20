import { router } from 'expo-router';

// expo-router's `router` singleton is the same object returned by every
// useRouter() call, so patching it once here guards navigation app-wide.
const THROTTLE_MS = 600;
let lastNavAt = 0;

const throttle = (fn) => (...args) => {
  const now = Date.now();
  if (now - lastNavAt < THROTTLE_MS) {
    return;
  }
  lastNavAt = now;
  return fn(...args);
};

router.push = throttle(router.push);
router.replace = throttle(router.replace);
