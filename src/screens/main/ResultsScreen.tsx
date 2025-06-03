import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;

const { width } = Dimensions.get('window');

// Mock analysis data
const analysisResult = {
  overallRating: 8.5,
  foodName: "Quinoa Salad Bowl",
  category: "Healthy Bowl",
  calories: 320,
  criteria: [
    {
      name: "Nutrient Density",
      score: 9.2,
      icon: "nutrition",
      color: "#10b981",
      description: "Rich in vitamins, minerals, and antioxidants"
    },
    {
      name: "Processing Level",
      score: 8.8,
      icon: "leaf",
      color: "#3b82f6", 
      description: "Minimally processed, whole food ingredients"
    },
    {
      name: "Sugar Content",
      score: 9.0,
      icon: "water",
      color: "#8b5cf6",
      description: "Low added sugars, natural sweetness"
    },
    {
      name: "Healthy Fats",
      score: 7.5,
      icon: "heart",
      color: "#f59e0b",
      description: "Good source of omega-3 and monounsaturated fats"
    },
    {
      name: "Glycemic Impact",
      score: 8.2,
      icon: "trending-down",
      color: "#06b6d4",
      description: "Low glycemic index, steady energy release"
    },
    {
      name: "Inflammation",
      score: 8.8,
      icon: "shield-checkmark",
      color: "#84cc16",
      description: "Anti-inflammatory ingredients"
    }
  ],
  recommendations: [
    "Add more healthy fats like avocado or nuts",
    "Consider reducing portion size slightly",
    "Great choice for sustained energy!"
  ]
};

export const ResultsScreen = () => {
  const [ratingAnimation] = useState(new Animated.Value(0));
  const [criteriaAnimation] = useState(new Animated.Value(0));
  const navigation = useNavigation<ResultsScreenNavigationProp>();

  useEffect(() => {
    // Animate the rating reveal
    Animated.sequence([
      Animated.timing(ratingAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(criteriaAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const handleSaveResult = () => {
    // Save to history
    console.log('Save result to history');
  };

  const handleShareResult = () => {
    // Share functionality
    console.log('Share result');
  };

  const handleScanAnother = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareResult}>
          <Ionicons name="share-outline" size={20} color={theme.colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Food Image & Rating */}
        <View style={styles.heroSection}>
          <View style={styles.foodImageContainer}>
            <View style={styles.mockFoodImage}>
              <Ionicons name="restaurant" size={48} color={theme.colors.light.textSecondary} />
            </View>
          </View>

          <Animated.View 
            style={[
              styles.ratingContainer,
              {
                opacity: ratingAnimation,
                transform: [{
                  scale: ratingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
              },
            ]}
          >
            <Text style={[styles.ratingScore, { color: getRatingColor(analysisResult.overallRating) }]}>
              {analysisResult.overallRating}
            </Text>
            <Text style={styles.ratingLabel}>{getRatingLabel(analysisResult.overallRating)}</Text>
          </Animated.View>

          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{analysisResult.foodName}</Text>
            <Text style={styles.foodCategory}>{analysisResult.category} • {analysisResult.calories} calories</Text>
          </View>
        </View>

        {/* Quick Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.summaryTitle}>Health Summary</Text>
          </View>
          <Text style={styles.summaryText}>
            This is a <Text style={styles.summaryHighlight}>nutritious choice</Text> with excellent nutrient density and minimal processing. Great for sustained energy and overall health!
          </Text>
        </View>

        {/* Detailed Criteria */}
        <Animated.View 
          style={[
            styles.criteriaSection,
            {
              opacity: criteriaAnimation,
              transform: [{
                translateY: criteriaAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>
          
          {analysisResult.criteria.map((criterion, index) => (
            <View key={criterion.name} style={styles.criterionCard}>
              <View style={styles.criterionHeader}>
                <View style={[styles.criterionIcon, { backgroundColor: `${criterion.color}20` }]}>
                  <Ionicons name={criterion.icon as any} size={20} color={criterion.color} />
                </View>
                <View style={styles.criterionInfo}>
                  <Text style={styles.criterionName}>{criterion.name}</Text>
                  <Text style={styles.criterionDescription}>{criterion.description}</Text>
                </View>
                <View style={styles.criterionScore}>
                  <Text style={[styles.scoreNumber, { color: criterion.color }]}>
                    {criterion.score}
                  </Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View 
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
        </Animated.View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {analysisResult.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationIcon}>
                <Ionicons name="bulb" size={16} color={theme.colors.light.accentYellow.replace('#', '#')} />
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryAction} onPress={handleScanAnother}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.primaryActionText}>Scan Another Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareToProfileAction} onPress={() => navigation.navigate('ShareFood', { foodData: analysisResult })}>
            <Ionicons name="people-outline" size={20} color={theme.colors.light.textSecondary} />
            <Text style={styles.shareToProfileText}>Share to Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryAction} onPress={handleSaveResult}>
            <Ionicons name="bookmark-outline" size={20} color={theme.colors.light.textSecondary} />
            <Text style={styles.secondaryActionText}>Save to History</Text>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 64,
    fontWeight: theme.typography.weights.bold,
    lineHeight: 70,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textSecondary,
    marginTop: 4,
  },
  foodInfo: {
    alignItems: 'center',
  },
  foodName: {
    fontSize: 24,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  summaryText: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    lineHeight: 20,
  },
  summaryHighlight: {
    fontWeight: theme.typography.weights.semibold,
    color: '#10b981',
  },
  criteriaSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    marginBottom: 16,
  },
  criterionCard: {
    backgroundColor: theme.colors.light.bgSecondary,
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
  criterionDescription: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
  },
  criterionScore: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: theme.typography.weights.bold,
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
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.light.bgSecondary,
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
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
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
  shareToProfileAction: {
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
  shareToProfileText: {
    color: theme.colors.light.textSecondary,
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
  },
  bottomPadding: {
    height: 40,
  },
});
