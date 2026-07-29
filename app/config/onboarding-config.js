// `scrollable: true` marks steps whose target renders inside Homepage's
// ScrollView, so the tutorial only tries to scroll a target into view when
// it's actually a descendant of that scroll container. Every other target
// (bottom nav tabs, the about button) is pinned outside the ScrollView and
// is always on screen.
export const ONBOARDING_STEPS = [
  { id: 'welcome', target: null },
  { id: 'opportunities', target: 'opportunitiesCard', scrollable: true },
  { id: 'events', target: 'eventsCard', scrollable: true },
  { id: 'opportunitiesTab', target: 'opportunities' },
  { id: 'eventsTab', target: 'events' },
  { id: 'profile', target: 'profile' },
  { id: 'notifications', target: 'notifications' },
  { id: 'about', target: 'aboutButton' },
];
