import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Share,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type FoodDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FoodDetails'>;

const { width } = Dimensions.get('window');

// Mock detailed food data
const foodData = {
  id: '1',
  name: 'Quinoa Salad Bowl',
  category: 'Healthy Bowl',
  rating: 8.5,
  date: '2 hours ago',
  calories: 320,
  servingSize: '1 bowl (250g)',
  image: null, // Would be actual image URI
  details: 'Brown quinoa, roasted vegetables, feta cheese, olive oil dressing',
  nutritionFacts: {
    calories: 320,
    protein: '14g',
    carbs: '42g',
    fat: '12g',
    fiber: '6g',
    sugar: '8g',
    sodium: '420mg',
  },
  criteria: [
    {
      name: "Nutrient Density",
      score: 9.2,
      icon: "nutrition",
      color: "#10b981",
      description: "Rich in vitamins, minerals, and antioxidants",
      details: "Excellent source of complete protein from quinoa, vitamin A from vegetables, and healthy fats from olive oil."
    },
    {
      name: "Processing Level",
      score: 8.8,
      icon: "leaf",
      color: "#3b82f6", 
      description: "Minimally processed, whole food ingredients",
      details: "Whole grain quinoa and fresh vegetables with minimal processing. Olive oil is cold-pressed."
    },
    {
      name: "Sugar Content",
      score: 9.0,
      icon: "water",
      color: "#8b5cf6",
      description: "Low added sugars, natural sweetness",
      details: "Natural sugars from vegetables only. No added sweeteners or refined sugars detected."
    },
    {
      name: "Healthy Fats",
      score: 7.5,
      icon: "heart",
      color: "#f59e0b",
      description: "Good source of omega-3 and monounsaturated fats",
      details: "Olive oil provides monounsaturated fats. Could benefit from omega-3 rich additions like walnuts."
    },
    {
      name: "Glycemic Impact",
      score: 8.2,
      icon: "trending-down",
      color: "#06b6d4",
      description: "Low glycemic index, steady energy release",
      details: "Quinoa and fiber from vegetables help maintain stable blood sugar levels."
    },
    {
      name: "Inflammation",
      score: 8.8,
      icon: "shield-checkmark",
      color: "#84cc16",
      description: "Anti-inflammatory ingredients",
      details: "Olive oil and colorful vegetables provide anti-inflammatory compounds."
    }
  ],
  recommendations: [
    "Add nuts or seeds for extra healthy fats and protein",
    "Consider reducing sodium by using herbs instead of salt",
    "Perfect portion size for sustained energy",
    "Great choice for post-workout nutrition"
  ],
  tags: ['Vegetarian', 'High Protein', 'High Fiber', 'Heart Healthy']
};

export const FoodDetailsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'nutrition' | 'analysis'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<FoodDetailsScreenNavigationProp>();

  // Check if food is already in favorites on component mount
  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        const isAlreadyFavorite = favorites.some((fav: any) => fav.id === foodData.id);
        setIsFavorite(isAlreadyFavorite);
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const saveFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      // Add current food to favorites with timestamp
      const favoriteFood = {
        ...foodData,
        savedAt: new Date().toISOString(),
      };
      
      favorites.push(favoriteFood);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      
      return true;
    } catch (error) {
      console.error('Error saving favorite:', error);
      return false;
    }
  };

  const removeFavorite = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        const updatedFavorites = favorites.filter((fav: any) => fav.id !== foodData.id);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  };

  const getRatingColor = (score: number) => {
    if (score >= 8.0) return '#10b981'; // Green
    if (score >= 6.0) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getRatingLabel = (score: number) => {
    if (score >= 8.0) return 'Excellent';
    if (score >= 6.0) return 'Good';
    return 'Needs Improvement';
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my food rating! ${foodData.name} scored ${foodData.rating}/10 for healthiness on Food Rater app! 🥗`,
        title: 'Food Rating Share',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleSaveToFavorites = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const success = await removeFavorite();
        if (success) {
          setIsFavorite(false);
          Alert.alert(
            'Removed from Favorites',
            `${foodData.name} has been removed from your favorites.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', 'Failed to remove from favorites. Please try again.');
        }
      } else {
        // Add to favorites
        const success = await saveFavorite();
        if (success) {
          setIsFavorite(true);
          Alert.alert(
            'Added to Favorites',
            `${foodData.name} has been saved to your favorites!`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', 'Failed to save to favorites. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error handling favorites:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              isFavorite && styles.favoriteButton,
              isLoading && styles.loadingButton
            ]} 
            onPress={handleSaveToFavorites}
            disabled={isLoading}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? "#ef4444" : theme.colors.light.textPrimary} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.foodImageContainer}>
            {foodData.image ? (
              <Image source={{ uri: foodData.image }} style={styles.foodImage} />
            ) : (
              <View style={styles.mockFoodImage}>
                <Ionicons name="restaurant" size={48} color={theme.colors.light.textSecondary} />
              </View>
            )}
          </View>

          <View style={styles.ratingContainer}>
            <Text style={[styles.ratingScore, { color: getRatingColor(foodData.rating) }]}>
              {foodData.rating}
            </Text>
            <Text style={styles.ratingLabel}>{getRatingLabel(foodData.rating)}</Text>
          </View>

          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{foodData.name}</Text>
            <Text style={styles.foodMeta}>
              {foodData.category} • {foodData.calories} calories • {foodData.date}
            </Text>
            {foodData.details && (
              <Text style={styles.foodDetails}>{foodData.details}</Text>
            )}
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {foodData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'nutrition' && styles.activeTab]}
            onPress={() => setSelectedTab('nutrition')}
          >
            <Text style={[styles.tabText, selectedTab === 'nutrition' && styles.activeTabText]}>
              Nutrition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'analysis' && styles.activeTab]}
            onPress={() => setSelectedTab('analysis')}
          >
            <Text style={[styles.tabText, selectedTab === 'analysis' && styles.activeTabText]}>
              Analysis
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Quick Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{foodData.nutritionFacts.calories}</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{foodData.nutritionFacts.protein}</Text>
                  <Text style={styles.statLabel}>Protein</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{foodData.nutritionFacts.fiber}</Text>
                  <Text style={styles.statLabel}>Fiber</Text>
                </View>
              </View>
            </View>

            {/* Top Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {foodData.recommendations.slice(0, 2).map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationIcon}>
                    <Ionicons name="bulb" size={16} color={theme.colors.light.accentYellow.replace('#', '#')} />
                  </View>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'nutrition' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition Facts</Text>
              <Text style={styles.servingSize}>Per {foodData.servingSize}</Text>
              
              <View style={styles.nutritionGrid}>
                {Object.entries(foodData.nutritionFacts).map(([key, value]) => (
                  <View key={key} style={styles.nutritionItem}>
                    <Text style={styles.nutritionLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                    <Text style={styles.nutritionValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Macronutrient Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Macronutrient Breakdown</Text>
              <View style={styles.macroChart}>
                <View style={styles.macroItem}>
                  <View style={[styles.macroColor, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.macroLabel}>Protein ({foodData.nutritionFacts.protein})</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroColor, { backgroundColor: '#3b82f6' }]} />
                  <Text style={styles.macroLabel}>Carbs ({foodData.nutritionFacts.carbs})</Text>
                </View>
                <View style={styles.macroItem}>
                  <View style={[styles.macroColor, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.macroLabel}>Fat ({foodData.nutritionFacts.fat})</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'analysis' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detailed Health Analysis</Text>
              
              {foodData.criteria.map((criterion, index) => (
                <View key={criterion.name} style={styles.criterionCard}>
                  <View style={styles.criterionHeader}>
                    <View style={[styles.criterionIcon, { backgroundColor: `${criterion.color}20` }]}>
                      <Ionicons name={criterion.icon as any} size={20} color={criterion.color} />
                    </View>
                    <View style={styles.criterionInfo}>
                      <Text style={styles.criterionName}>{criterion.name}</Text>
                      <Text style={styles.criterionScore}>{criterion.score}/10</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.criterionDescription}>{criterion.description}</Text>
                  <Text style={styles.criterionDetails}>{criterion.details}</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <View 
                        style={[
                          styles.progressFill,
                          { 
                            backgroundColor: criterion.color,
                            width: `${criterion.score * 10}%`,
                          },
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* All Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Recommendations</Text>
              {foodData.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationIcon}>
                    <Ionicons name="bulb" size={16} color={theme.colors.light.accentYellow.replace('#', '#')} />
                  </View>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="analytics" size={20} color={theme.colors.light.textSecondary} />
            <Text style={styles.secondaryActionText}>Compare Foods</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryAction} onPress={() => navigation.navigate('MainTabs')}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.primaryActionText}>Scan Another</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  loadingButton: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  foodImageContainer: {
    marginBottom: 24,
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  mockFoodImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingScore: {
    fontSize: 48,
    fontWeight: theme.typography.weights.bold,
    lineHeight: 52,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textSecondary,
    marginTop: 4,
  },
  foodInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  foodMeta: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  foodDetails: {
    fontSize: 14,
    color: theme.colors.light.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: theme.colors.light.bgTertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.textSecondary,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.bgSecondary,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: theme.colors.light.accentDark,
  },
  tabText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.textSecondary,
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  statValue: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  servingSize: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  nutritionGrid: {
    gap: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
  },
  nutritionLabel: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  nutritionValue: {
    fontSize: 14,
    color: theme.colors.light.textPrimary,
    fontWeight: theme.typography.weights.semibold,
  },
  macroChart: {
    gap: 12,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  macroColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  macroLabel: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  criterionCard: {
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  criterionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  criterionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  criterionInfo: {
    flex: 1,
  },
  criterionName: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 2,
  },
  criterionScore: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textSecondary,
  },
  criterionDescription: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: theme.typography.weights.medium,
  },
  criterionDetails: {
    fontSize: 13,
    color: theme.colors.light.textTertiary,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: theme.colors.light.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  recommendationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${theme.colors.light.accentYellow}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    lineHeight: 20,
  },
  bottomActions: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  secondaryAction: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  secondaryActionText: {
    color: theme.colors.light.textSecondary,
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
  },
  primaryAction: {
    backgroundColor: theme.colors.light.accentDark,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
  },
  bottomPadding: {
    height: 40,
  },
});
