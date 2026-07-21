import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeIcon from '../assets/images/home-icon.svg';
import Logo from '../assets/images/Logo.svg';
import Text from './components/AppText';
import TextInput from './components/AppTextInput';
import TitleText from './components/TitleText';
import { getAllOpportunities } from './services/opportunities-service';

export default function AllOpportunities() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    const result = await getAllOpportunities();
    if (result.success) {
      setAllOpportunities(result.data);
    }
    setLoading(false);
  };

  const filteredOpportunities = allOpportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>
            <Logo width={38} height={38} style={styles.logoSmall} />
            <Text style={styles.brandName}>FORSA</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={() => router.push('/Homepage')}>
              <HomeIcon width={40} height={40} style={styles.homeIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <TitleText style={styles.title}>ALL{'\n'}OPPORTUNITIES</TitleText>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities..."
            placeholderTextColor="#46a3a4"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.locationFilter}>
          <Text style={styles.locationLabel}>Location:</Text>
        </View>

        <View style={styles.opportunitiesContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Loading opportunities...</Text>
          ) : filteredOpportunities.length === 0 ? (
            <Text style={styles.loadingText}>No opportunities found</Text>
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
                <Text style={styles.opportunityTitle}>{opp.title}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.topMatchesButton}
          onPress={() => router.push('/TopMatches')}
        >
          <Text style={styles.topMatchesText}>View your top matches</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#e1e4e4',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#0a445c',
  },
  logoSmall: {
    width: 38,
    height: 38,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
  },
  homeIcon: {
    width: 40,
    height: 40,
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
  locationFilter: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 18,
    color: '#46a3a4',
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