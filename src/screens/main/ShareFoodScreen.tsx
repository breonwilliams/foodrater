import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types/navigation';
import { STORAGE_KEYS, type FoodPost } from '../../data/mockSocialData';

type ShareFoodScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ShareFood'>;
type ShareFoodScreenRouteProp = RouteProp<RootStackParamList, 'ShareFood'>;

export const ShareFoodScreen = () => {
  const navigation = useNavigation<ShareFoodScreenNavigationProp>();
  const route = useRoute<ShareFoodScreenRouteProp>();
  const { foodData } = route.params || {};

  const [caption, setCaption] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const maxCaptionLength = 280;

  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return '#10b981'; // Green
    if (rating >= 6.0) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const handlePost = async () => {
    if (!foodData) {
      Alert.alert('Error', 'No food data available to share.');
      return;
    }

    setIsPosting(true);

    try {
      // Create new food post
      const newPost: FoodPost = {
        id: `post_${Date.now()}`,
        userId: 'user_1', // Current user ID
        foodName: foodData.name || foodData.foodName || 'Unknown Food',
        category: foodData.category || 'Food',
        calories: foodData.calories || 0,
        image: foodData.image || null,
        rating: foodData.rating || foodData.overallRating || 0,
        caption: caption.trim(),
        isPublic,
        createdAt: new Date().toISOString(),
        foodData,
      };

      // Load existing posts
      const existingPostsJson = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_POSTS);
      const existingPosts: FoodPost[] = existingPostsJson ? JSON.parse(existingPostsJson) : [];

      // Add new post to the beginning
      const updatedPosts = [newPost, ...existingPosts];

      // Save updated posts
      await AsyncStorage.setItem(STORAGE_KEYS.FOOD_POSTS, JSON.stringify(updatedPosts));

      // Update user profile stats
      const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        profile.stats.postsCount = updatedPosts.length;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      }

      Alert.alert(
        'Posted!',
        'Your food has been shared to your profile.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error posting food:', error);
      Alert.alert('Error', 'Failed to share your food. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (caption.trim()) {
      Alert.alert(
        'Discard Post?',
        'Are you sure you want to discard this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (!foodData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No food data available to share.</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share to Profile</Text>
          <TouchableOpacity 
            style={[
              styles.postButton,
              (!caption.trim() || isPosting) && styles.postButtonDisabled
            ]} 
            onPress={handlePost}
            disabled={!caption.trim() || isPosting}
          >
            <Text style={[
              styles.postButtonText,
              (!caption.trim() || isPosting) && styles.postButtonTextDisabled
            ]}>
              {isPosting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Food Preview */}
          <View style={styles.foodPreview}>
            <View style={styles.foodImageContainer}>
              {foodData.image ? (
                // TODO: Add actual image when available
                <View style={styles.mockFoodImage}>
                  <Ionicons name="restaurant" size={32} color={theme.colors.light.textSecondary} />
                </View>
              ) : (
                <View style={styles.mockFoodImage}>
                  <Ionicons name="restaurant" size={32} color={theme.colors.light.textSecondary} />
                </View>
              )}
            </View>
            
            <View style={styles.foodInfo}>
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingText, { color: getRatingColor(foodData.rating || foodData.overallRating || 0) }]}>
                  Rating: {foodData.rating || foodData.overallRating || 0} ⭐
                </Text>
              </View>
              <Text style={styles.foodName}>
                {foodData.name || foodData.foodName || 'Unknown Food'}
              </Text>
              <Text style={styles.foodMeta}>
                {foodData.category || 'Food'} • {foodData.calories || 0} cal
              </Text>
            </View>
          </View>

          {/* Caption Input */}
          <View style={styles.captionSection}>
            <Text style={styles.captionLabel}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              value={caption}
              onChangeText={setCaption}
              placeholder="What's your thought on this meal...?"
              placeholderTextColor={theme.colors.light.textMuted}
              multiline
              maxLength={maxCaptionLength}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {caption.length}/{maxCaptionLength}
            </Text>
          </View>

          {/* Privacy Toggle */}
          <View style={styles.privacySection}>
            <View style={styles.privacyOption}>
              <View style={styles.privacyIconContainer}>
                <Ionicons 
                  name={isPublic ? "globe" : "lock-closed"} 
                  size={20} 
                  color={isPublic ? theme.colors.light.accentDark : theme.colors.light.textSecondary} 
                />
              </View>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>
                  {isPublic ? 'Share publicly' : 'Keep private'}
                </Text>
                <Text style={styles.privacyDescription}>
                  {isPublic 
                    ? 'Anyone can see this post on your profile'
                    : 'Only you can see this post'
                  }
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ 
                  false: theme.colors.light.borderLight, 
                  true: theme.colors.light.accentDark 
                }}
                thumbColor={isPublic ? 'white' : theme.colors.light.textMuted}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  keyboardContainer: {
    flex: 1,
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  postButton: {
    backgroundColor: theme.colors.light.accentDark,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  postButtonDisabled: {
    backgroundColor: theme.colors.light.textMuted,
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
  },
  postButtonTextDisabled: {
    color: theme.colors.light.bgSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  foodPreview: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  foodImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mockFoodImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  foodInfo: {
    alignItems: 'center',
  },
  ratingContainer: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
  },
  foodName: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  foodMeta: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
  },
  captionSection: {
    marginBottom: 24,
  },
  captionLabel: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 12,
  },
  captionInput: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.light.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
    textAlign: 'right',
    marginTop: 8,
  },
  privacySection: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  privacyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: theme.colors.light.accentDark,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
  },
});
