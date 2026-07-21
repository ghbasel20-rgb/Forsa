import { router } from 'expo-router';

// expo-router's `router` singleton is the same object returned by every
// useRouter() call, so patching it once here guards navigation app-wide.
//
// This resets the window on every attempt (blocked or not), not just on the
// last successful navigation — a fixed re-open time would let a tap landing
// just past the window through mid-spam, since a real spam-tap session often
// runs longer than a single window. Resetting on every attempt means the
// lock only releases once taps actually stop for THROTTLE_MS.
const THROTTLE_MS = 600;
let lastAttemptAt = 0;

const throttle = (fn) => (...args) => {
  const now = Date.now();
  const withinWindow = now - lastAttemptAt < THROTTLE_MS;
  lastAttemptAt = now;
  if (withinWindow) {
    return;
  }
  return fn(...args);
};

router.push = throttle(router.push);
router.replace = throttle(router.replace);
router.back = throttle(router.back);
