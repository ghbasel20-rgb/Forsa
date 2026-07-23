import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderBrand from './components/HeaderBrand';
import BottomNav from './components/BottomNav';
import FilterPanel from './components/FilterPanel';
import FilterSection from './components/FilterSection';
import SingleChoiceRow from './components/SingleChoiceRow';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import TitleText from './components/TitleText';
import { useLanguage } from './contexts/LanguageContext';
import { getCurrentUser } from './services/auth-service';
import { getAllOpportunities, scoreOpportunityMatch } from './services/opportunities-service';
import { getUserProfile } from './services/profile-service';
import { getDistinctValues, getMatchThresholdOptions, getSortOptions, sortItems } from './utils/filterUtils';

export default function AllOpportunities() {
  const router = useRouter();
  const { t } = useLanguage();
  const MATCH_THRESHOLD_OPTIONS = getMatchThresholdOptions(t);
  const SORT_OPTIONS = getSortOptions(t);
  const [searchQuery, setSearchQuery] = useState('');
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [sortBy, setSortBy] = useState('match');

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    const [opportunitiesResult, userResult] = await Promise.all([
      getAllOpportunities(),
      getCurrentUser(),
    ]);

    if (opportunitiesResult.success) {
      setAllOpportunities(opportunitiesResult.data);
    }

    if (userResult.success) {
      const profileResult = await getUserProfile(userResult.data.$id);
      if (profileResult.success) {
        setProfile(profileResult.data);
      }
    }

    setLoading(false);
  };

  const opportunitiesWithMatch = useMemo(
    () =>
      allOpportunities.map((opp) => ({
        ...opp,
        matchPercentage: scoreOpportunityMatch(opp, profile).matchPercentage,
      })),
    [allOpportunities, profile]
  );

  const skillOptions = useMemo(() => getDistinctValues(allOpportunities, 'skills'), [allOpportunities]);
  const interestOptions = useMemo(() => getDistinctValues(allOpportunities, 'interests'), [allOpportunities]);
  const categoryOptions = useMemo(() => {
    const values = new Set();
    allOpportunities.forEach((opp) => {
      if (opp.category) values.add(opp.category);
    });
    return Array.from(values).sort();
  }, [allOpportunities]);

  const filteredOpportunities = useMemo(() => {
    const filtered = opportunitiesWithMatch.filter((opp) => {
      if (!opp.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (opp.matchPercentage < matchThreshold) return false;
      if (selectedSkills.length > 0 && !selectedSkills.some((s) => (opp.skills || []).includes(s))) return false;
      if (
        selectedInterests.length > 0 &&
        !selectedInterests.some((i) => (opp.interests || []).includes(i))
      )
        return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(opp.category)) return false;
      return true;
    });

    return sortItems(filtered, sortBy);
  }, [
    opportunitiesWithMatch,
    searchQuery,
    matchThreshold,
    selectedSkills,
    selectedInterests,
    selectedCategories,
    sortBy,
  ]);

  const activeFilterCount =
    selectedSkills.length +
    selectedInterests.length +
    selectedCategories.length +
    (matchThreshold > 0 ? 1 : 0);

  const handleClearFilters = () => {
    setSelectedSkills([]);
    setSelectedInterests([]);
    setSelectedCategories([]);
    setMatchThreshold(0);
    setSortBy('match');
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <HeaderBrand style={styles.logoSlot} pointerEvents="box-none" />
          </View>

          <TitleText style={styles.title}>{t('allOpportunities.title')}</TitleText>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('allOpportunities.searchPlaceholder')}
              placeholderTextColor="#46a3a4"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FilterPanel activeCount={activeFilterCount} onClear={handleClearFilters}>
            <FilterSection
              label={t('filterLabels.skills')}
              options={skillOptions}
              selected={selectedSkills}
              onChange={setSelectedSkills}
            />
            <FilterSection
              label={t('filterLabels.interests')}
              options={interestOptions}
              selected={selectedInterests}
              onChange={setSelectedInterests}
            />
            {categoryOptions.length > 0 && (
              <FilterSection
                label={t('filterLabels.category')}
                options={categoryOptions}
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />
            )}
            <SingleChoiceRow
              label={t('filterLabels.minimumMatch')}
              options={MATCH_THRESHOLD_OPTIONS}
              value={matchThreshold}
              onChange={setMatchThreshold}
            />
            <SingleChoiceRow label={t('filterLabels.sortBy')} options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </FilterPanel>

          <View style={styles.opportunitiesContainer}>
            {loading ? (
              <Text style={styles.loadingText}>{t('allOpportunities.loadingText')}</Text>
            ) : filteredOpportunities.length === 0 ? (
              <Text style={styles.loadingText}>{t('allOpportunities.emptyText')}</Text>
            ) : (
              filteredOpportunities.map((opp) => (
                <TouchableOpacity
                  key={opp.$id}
                  style={styles.opportunityCard}
                  onPress={() => router.push(`/Opportunitydetail?id=${opp.$id}`)}
                >
                  <View style={styles.iconContainer}>
                    <Image
                      source={require('../assets/images/icon.png')}
                      style={styles.opportunityIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.opportunityTitle} numberOfLines={1} ellipsizeMode="tail">{opp.title}</Text>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{opp.matchPercentage}%</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          <TouchableOpacity
            style={styles.topMatchesButton}
            onPress={() => router.push('/TopMatches')}
          >
            <Text style={styles.topMatchesText}>{t('allOpportunities.viewTopMatches')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    padding: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoSlot: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  title: {
    fontSize: 32,
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 52,
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
  opportunitiesContainer: {
    gap: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#46a3a4',
    fontSize: 16,
    marginTop: 20,
  },
  opportunityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 16,
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
  opportunityIcon: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },
  opportunityTitle: {
    flex: 1,
    fontSize: 16,
    color: '#46a3a4',
    fontWeight: '500',
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
  topMatchesButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 16,
  },
  topMatchesText: {
    color: '#46a3a4',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});