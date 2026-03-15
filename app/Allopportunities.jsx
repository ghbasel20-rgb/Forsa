import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AllOpportunities() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const allOpportunities = [
    { id: 1, title: 'Opportunity', location: 'Tel Aviv' },
    { id: 2, title: 'Opportunity', location: 'Jerusalem' },
    { id: 3, title: 'Opportunity', location: 'Haifa' },
    { id: 4, title: 'Opportunity', location: 'Beer Sheva' },
  ];

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
            <Image
              source={require('../assets/images/Logo.png')}
              style={styles.logoSmall}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>FORSA</Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
              <Image
                source={require('../assets/images/Search.png')}
                style={styles.searchIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/Profile')}>
              <Image
                source={require('../assets/images/home-icon.png')}
                style={styles.homeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search opportunities..."
              placeholderTextColor="#46a3a4"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        <Text style={styles.title}>ALL{'\n'}OPPORTUNITIES</Text>

        <View style={styles.locationFilter}>
          <Text style={styles.locationLabel}>Location:</Text>
        </View>

        <View style={styles.opportunitiesContainer}>
          {filteredOpportunities.map((opp) => (
            <View key={opp.id} style={styles.opportunityCard}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../assets/images/icon.png')}
                  style={styles.opportunityIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.opportunityTitle}>{opp.title}</Text>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => router.push('/Opportunitydetail')}
              >
                <Text style={styles.readMoreText}>Read more</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
    width: 30,
    height: 30,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a445c',
    letterSpacing: 1,
  },
  searchIcon: {
    width: 30,
    height: 30,
  },
  homeIcon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 30,
    lineHeight: 42,
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
  readMoreButton: {
    backgroundColor: '#e1e4e4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  readMoreText: {
    color: '#0a445c',
    fontSize: 12,
  },
});