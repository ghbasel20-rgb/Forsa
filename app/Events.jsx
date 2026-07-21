import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Logo from '../assets/images/logowname.svg';
import BackButton from './components/BackButton';
import BottomNav from './components/BottomNav';
import FilterPanel from './components/FilterPanel';
import FilterSection from './components/FilterSection';
import SingleChoiceRow from './components/SingleChoiceRow';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import TitleText from './components/TitleText';
import { getCurrentUser } from './services/auth-service';
import {
  formatCompactEventDate,
  formatDueDate,
  getEvents,
  isEventClosed,
  scoreEventMatch,
} from './services/events-service';
import { getUserProfile } from './services/profile-service';
import { getSavedEvents } from './services/saved-events-service';
import {
  AGE_BUCKETS,
  eventMatchesAgeBuckets,
  EVENT_SORT_OPTIONS,
  getDistinctValues,
  MATCH_THRESHOLD_OPTIONS,
  sortItems,
} from './utils/filterUtils';

const APPLIED_OPTIONS = [
  { label: 'All Events', value: 'all' },
  { label: 'Applied Only', value: 'applied' },
];

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [appliedEventIds, setAppliedEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedAgeBuckets, setSelectedAgeBuckets] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState('all');
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [sortBy, setSortBy] = useState('match');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const [eventsResult, userResult] = await Promise.all([getEvents(), getCurrentUser()]);

    if (eventsResult.success) {
      setEvents(eventsResult.data);
    }

    if (userResult.success) {
      const [profileResult, savedEventsResult] = await Promise.all([
        getUserProfile(userResult.data.$id),
        getSavedEvents(userResult.data.$id),
      ]);

      if (profileResult.success) {
        setProfile(profileResult.data);
      }
      if (savedEventsResult.success) {
        setAppliedEventIds(new Set(savedEventsResult.data.map((saved) => saved.eventId)));
      }
    }

    setLoading(false);
  };

  const eventsWithMatch = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        matchPercentage: scoreEventMatch(event, profile).matchPercentage,
        isClosed: isEventClosed(event),
        dueDateText: formatDueDate(event.dueDate),
        eventDateText: formatCompactEventDate(event.eventDate),
      })),
    [events, profile]
  );

  const skillOptions = useMemo(() => getDistinctValues(events, 'skills'), [events]);
  const interestOptions = useMemo(() => getDistinctValues(events, 'interests'), [events]);
  const ageBucketOptions = useMemo(() => AGE_BUCKETS.map((bucket) => bucket.label), []);

  const filteredEvents = useMemo(() => {
    const filtered = eventsWithMatch.filter((event) => {
      if (!event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (event.matchPercentage < matchThreshold) return false;
      if (selectedSkills.length > 0 && !selectedSkills.some((s) => (event.skills || []).includes(s)))
        return false;
      if (
        selectedInterests.length > 0 &&
        !selectedInterests.some((i) => (event.interests || []).includes(i))
      )
        return false;
      if (!eventMatchesAgeBuckets(event, selectedAgeBuckets)) return false;
      if (appliedFilter === 'applied' && !appliedEventIds.has(event.$id)) return false;
      return true;
    });

    return sortItems(filtered, sortBy);
  }, [
    eventsWithMatch,
    searchQuery,
    matchThreshold,
    selectedSkills,
    selectedInterests,
    selectedAgeBuckets,
    appliedFilter,
    appliedEventIds,
    sortBy,
  ]);

  const activeFilterCount =
    selectedSkills.length +
    selectedInterests.length +
    selectedAgeBuckets.length +
    (matchThreshold > 0 ? 1 : 0) +
    (appliedFilter !== 'all' ? 1 : 0);

  const handleClearFilters = () => {
    setSelectedSkills([]);
    setSelectedInterests([]);
    setSelectedAgeBuckets([]);
    setAppliedFilter('all');
    setMatchThreshold(0);
    setSortBy('match');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton />
          </View>

          <TitleText style={styles.title}>OUR EVENTS</TitleText>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              placeholderTextColor="#46a3a4"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FilterPanel activeCount={activeFilterCount} onClear={handleClearFilters}>
            <FilterSection
              label="Skills"
              options={skillOptions}
              selected={selectedSkills}
              onChange={setSelectedSkills}
            />
            <FilterSection
              label="Interests"
              options={interestOptions}
              selected={selectedInterests}
              onChange={setSelectedInterests}
            />
            <FilterSection
              label="Age Range"
              options={ageBucketOptions}
              selected={selectedAgeBuckets}
              onChange={setSelectedAgeBuckets}
            />
            <SingleChoiceRow
              label="Status"
              options={APPLIED_OPTIONS}
              value={appliedFilter}
              onChange={setAppliedFilter}
            />
            <SingleChoiceRow
              label="Minimum Match"
              options={MATCH_THRESHOLD_OPTIONS}
              value={matchThreshold}
              onChange={setMatchThreshold}
            />
            <SingleChoiceRow label="Sort By" options={EVENT_SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </FilterPanel>

          <View style={styles.eventsContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Loading events...</Text>
            ) : filteredEvents.length === 0 ? (
              <Text style={styles.loadingText}>No events match your search or filters</Text>
            ) : (
              filteredEvents.map((event) => (
                <TouchableOpacity
                  key={event.$id}
                  style={[styles.eventCard, event.isClosed && styles.eventCardClosed]}
                  onPress={() => router.push(`/EventDetail?id=${event.$id}`)}
                >
                  <View style={styles.eventCardTop}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={require('../assets/images/icon.png')}
                        style={styles.eventIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[styles.eventTitle, event.isClosed && styles.eventTitleClosed]}>
                      {event.title}
                    </Text>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{event.matchPercentage}%</Text>
                    </View>
                  </View>

                  {event.dueDateText && (
                    <View style={styles.dueDateRow}>
                      <Text
                        style={[styles.dueDateText, event.isClosed && styles.dueDateTextClosed]}
                      >
                        {event.dueDateText}
                      </Text>
                      {event.isClosed && (
                        <View style={styles.closedBadge}>
                          <Text style={styles.closedBadgeText}>Closed</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {event.eventDateText && (
                    <Text
                      style={[styles.dueDateText, event.isClosed && styles.dueDateTextClosed]}
                    >
                      {event.eventDateText}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <Logo width={400} height={88} style={styles.brandLogo} />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    padding: 20,
    paddingTop: 130,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  brandLogo: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 50,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#0a445c',
  },
  eventsContainer: {
    gap: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#46a3a4',
    fontSize: 16,
    marginTop: 20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#46a3a4',
    borderRadius: 15,
    padding: 16,
    gap: 12,
  },
  eventCardClosed: {
    backgroundColor: '#e9e9e9',
    borderColor: '#b5b5b5',
    opacity: 0.7,
  },
  eventCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#46a3a4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIcon: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    color: '#0a445c',
    fontWeight: '500',
  },
  eventTitleClosed: {
    color: '#8a8a8a',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDateText: {
    fontSize: 13,
    color: '#46a3a4',
    fontWeight: '600',
  },
  dueDateTextClosed: {
    color: '#8a8a8a',
  },
  closedBadge: {
    backgroundColor: '#8a8a8a',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  closedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  scoreBadge: {
    backgroundColor: '#e1e4e4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  scoreText: {
    color: '#0E445C',
    fontSize: 14,
    fontWeight: '700',
  },
});
