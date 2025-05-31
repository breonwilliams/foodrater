import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

export const CameraScreen = () => {
  const [hasImage, setHasImage] = useState(false);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  const handleTakePhoto = () => {
    // Simulate taking photo
    Alert.alert(
      "Camera",
      "Photo captured! (Camera integration coming soon)",
      [{ text: "OK", onPress: () => setHasImage(true) }]
    );
  };

  const handleSelectFromGallery = () => {
    // Simulate gallery selection
    Alert.alert(
      "Gallery",
      "Photo selected! (Gallery integration coming soon)",
      [{ text: "OK", onPress: () => setHasImage(true) }]
    );
  };

  const handleAnalyze = () => {
    // Navigate to loading/results screen (we'll add this later)
    console.log('Navigate to analysis screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.appIconSmall}>
            <Ionicons name="star" size={16} color="white" />
          </View>
          <Text style={styles.appName}>Food Rater</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="sunny" size={16} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="person" size={16} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainContent}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Ready to rate your food?</Text>
          <Text style={styles.welcomeSubtitle}>Take a photo and get instant AI-powered health insights</Text>
        </View>

        {/* Camera Section */}
        <View style={styles.cameraSection}>
          <View style={styles.cameraPreview}>
            {!hasImage ? (
              <View style={styles.cameraPlaceholder}>
                <Ionicons 
                  name="camera" 
                  size={48} 
                  color={theme.colors.light.textTertiary} 
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>Tap to capture</Text>
                <Text style={styles.placeholderSubtext}>or select from gallery</Text>
              </View>
            ) : (
              <View style={styles.imagePreview}>
                <View style={styles.mockImage}>
                  <Ionicons name="image" size={48} color={theme.colors.light.textSecondary} />
                </View>
                <TouchableOpacity style={styles.analyzeOverlay} onPress={handleAnalyze}>
                  <Text style={styles.analyzeText}>Tap to analyze this food</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.btnSecondary} onPress={handleSelectFromGallery}>
              <Ionicons name="images" size={20} color={theme.colors.light.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btnCamera} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={32} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btnSecondary} onPress={() => console.log('History')}>
              <Ionicons name="time" size={20} color={theme.colors.light.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Foods Rated</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.statNumberPositive]}>7.2</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentGrid}>
            {[8.5, 6.2, 9.1].map((rating, index) => (
              <TouchableOpacity key={index} style={styles.recentItem}>
                <View style={styles.recentImage}>
                  <Ionicons name="star" size={24} color={theme.colors.light.textSecondary} />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentRating}>{rating}</Text>
                  <Text style={styles.recentDate}>{index === 0 ? '2 hours ago' : index === 1 ? '1 day ago' : '2 days ago'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Tip */}
      {!hasImage && (
        <View style={styles.floatingTip}>
          <Text style={styles.floatingTipText}>Tap the camera to get started!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.light.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIconSmall: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.light.accentDark,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
  },
  cameraSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  cameraPreview: {
    width: 280,
    height: 280,
    borderRadius: 20,
    backgroundColor: theme.colors.light.bgSecondary,
    borderWidth: 2,
    borderColor: theme.colors.light.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 5,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    gap: 16,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.textTertiary,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: theme.colors.light.textMuted,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mockImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  btnCamera: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.light.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.light.accentDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  btnSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.light.bgSecondary,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  viewAllBtn: {
    fontSize: 13,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
  },
  statNumberPositive: {
    color: '#10b981',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
    marginTop: 4,
    fontWeight: theme.typography.weights.medium,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 16,
  },
  recentGrid: {
    flexDirection: 'row',
  },
  recentItem: {
    width: 120,
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  recentImage: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    padding: 12,
  },
  recentRating: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
  },
  recentDate: {
    fontSize: 11,
    color: theme.colors.light.textMuted,
    marginTop: 4,
  },
  floatingTip: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    transform: [{ translateX: -100 }],
    backgroundColor: theme.colors.light.accentYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: 'rgba(255, 218, 128, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },
  floatingTipText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.accentDark,
  },
});