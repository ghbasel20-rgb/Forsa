import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCurrentUser } from './services/auth-service';
import { getOpportunityById } from './services/opportunities-service';
import { checkIfSaved, saveOpportunity, unsaveOpportunity } from './services/saved-opportunities-service';

export default function Opportunitydetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocumentId, setSavedDocumentId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunityData();
  }, [id]);

  const loadOpportunityData = async () => {
    if (!id) return;
    
    const oppResult = await getOpportunityById(id);
    if (oppResult.success) {
      setOpportunity(oppResult.data);
    }

    const userResult = await getCurrentUser();
    if (userResult.success) {
      setUserId(userResult.data.$id);
      
      const savedCheck = await checkIfSaved(userResult.data.$id, id);
      if (savedCheck.success) {
        setIsSaved(savedCheck.isSaved);
        setSavedDocumentId(savedCheck.documentId);
      }
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!userId || !opportunity) {
      Alert.alert('Error', 'Please log in to save opportunities');
      return;
    }

    if (isSaved) {
      const result = await unsaveOpportunity(savedDocumentId);
      if (result.success) {
        setIsSaved(false);
        setSavedDocumentId(null);
        Alert.alert('Success', 'Opportunity removed from saved');
      } else {
        Alert.alert('Error', result.error);
      }
    } else {
      const result = await saveOpportunity(userId, opportunity.$id, opportunity.title);
      if (result.success) {
        setIsSaved(true);
        setSavedDocumentId(result.data.$id);
        Alert.alert('Success', 'Opportunity saved!');
      } else {
        Alert.alert('Error', result.error);
      }
    }
  };

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
          <TouchableOpacity onPress={() => router.push('/Profile')}>
            <Image
              source={require('../assets/images/home-icon.png')}
              style={styles.homeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.opportunityIcon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{loading ? 'LOADING...' : opportunity?.title || 'OPPORTUNITY'}</Text>

        {!loading && opportunity && (
          <>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{opportunity.location || 'Not specified'}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Category:</Text>
              <Text style={styles.value}>{opportunity.category || 'Not specified'}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{opportunity.description || 'No description available'}</Text>
            </View>

            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>Requirements:</Text>
                {opportunity.requirements.map((req, index) => (
                  <Text key={index} style={styles.requirementItem}>• {req}</Text>
                ))}
              </View>
            )}

            {opportunity.url && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>Apply/Learn More:</Text>
                <Text style={styles.urlText}>{opportunity.url}</Text>
              </View>
            )}
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{isSaved ? 'Unsave' : 'Save'}</Text>
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
  homeIcon: {
    width: 40,
    height: 40,
  },
  iconContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#46a3a4',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  opportunityIcon: {
    width: 120,
    height: 120,
    tintColor: '#ffffff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0a445c',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    color: '#46a3a4',
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#0a445c',
    lineHeight: 24,
  },
  requirementItem: {
    fontSize: 16,
    color: '#0a445c',
    marginLeft: 10,
    marginBottom: 4,
  },
  urlText: {
    fontSize: 14,
    color: '#46a3a4',
    textDecorationLine: 'underline',
  },
  saveButton: {
    backgroundColor: '#c6a2ba',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});