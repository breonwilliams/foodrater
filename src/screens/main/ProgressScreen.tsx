import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainTabParamList, RootStackParamList } from '../../types/navigation';

type ProgressScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Progress'>,
  StackNavigationProp<RootStackParamList>
>;

const { width } = Dimensions.get('window');

// Time period options
type TimePeriod = 'weekly' | 'monthly' | 'alltime';

// Mock data for different time periods
const chartData = {
  weekly: [
    { day: 'Mon', rating: 8.5, height: 85 },
    { day: 'Tue', rating: 7.0, height: 70 },
    { day: 'Wed', rating: 4.5, height: 45 },
    { day: 'Thu', rating: 8.0, height: 80 },
    { day: 'Fri', rating: 9.5, height: 95 },
    { day: 'Sat', rating: 7.5, height: 75 },
    { day: 'Sun', rating: 6.0, height: 60 },
  ],
  monthly: [
    { day: 'Week 1', rating: 7.8, height: 78 },
    { day: 'Week 2', rating: 8.2, height: 82 },
    { day: 'Week 3', rating: 6.5, height: 65 },
    { day: 'Week 4', rating: 7.9, height: 79 },
  ],
  alltime: [
    { day: 'Jan', rating: 6.2, height: 62 },
    { day: 'Feb', rating: 7.1, height: 71 },
    { day: 'Mar', rating: 7.8, height: 78 },
    { day: 'Apr', rating: 8.3, height: 83 },
    { day: 'May', rating: 7.5, height: 75 },
    { day: 'Jun', rating: 8.1, height: 81 },
  ],
};

const periodLabels = {
  weekly: 'Last 7 days',
  monthly: 'Last 4 weeks', 
  alltime: 'Last 6 months',
};

// Enhanced recent foods data with full food details for navigation
const recentFoods = [
  { 
    id: 'food_1',
    name: 'Quinoa Salad Bowl', 
    rating: 8.5, 
    time: '2 hours ago', 
    color: '#10b981',
    image: null,
    date: new Date().toISOString(),
    calories: 420,
    protein: 18,
    carbs: 52,
    fat: 14,
    fiber: 8,
    sugar: 6,
    sodium: 380,
    healthScores: {
      nutritional: 8.5,
      processing: 9.0,
      ingredients: 8.8,
      allergens: 7.2,
      sustainability: 8.0,
      overall: 8.3
    },
    ingredients: ['Quinoa', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Feta cheese', 'Olive oil', 'Lemon juice'],
    description: 'A nutritious and balanced salad bowl with quinoa, fresh vegetables, and feta cheese.',
    recommendations: [
      'Excellent source of complete protein from quinoa',
      'Rich in fiber and essential nutrients',
      'Well-balanced macronutrient profile'
    ]
  },
  { 
    id: 'food_2',
    name: 'Greek Yogurt', 
    rating: 9.1, 
    time: '5 hours ago', 
    color: '#10b981',
    image: null,
    date: new Date().toISOString(),
    calories: 150,
    protein: 20,
    carbs: 8,
    fat: 4,
    fiber: 0,
    sugar: 8,
    sodium: 65,
    healthScores: {
      nutritional: 9.2,
      processing: 8.8,
      ingredients: 9.5,
      allergens: 8.0,
      sustainability: 8.5,
      overall: 9.1
    },
    ingredients: ['Greek yogurt', 'Live cultures'],
    description: 'Plain Greek yogurt with live and active cultures.',
    recommendations: [
      'Excellent source of probiotics',
      'High protein content supports muscle health',
      'Low in added sugars'
    ]
  },
  { 
    id: 'food_3',
    name: 'Processed Snack', 
    rating: 3.2, 
    time: 'Yesterday', 
    color: '#ef4444',
    image: null,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    calories: 280,
    protein: 3,
    carbs: 35,
    fat: 15,
    fiber: 2,
    sugar: 18,
    sodium: 520,
    healthScores: {
      nutritional: 2.8,
      processing: 2.0,
      ingredients: 3.5,
      allergens: 4.0,
      sustainability: 3.2,
      overall: 3.2
    },
    ingredients: ['Corn', 'Vegetable oil', 'Salt', 'Artificial flavoring', 'Preservatives'],
    description: 'Highly processed snack food with artificial ingredients.',
    recommendations: [
      'Consider healthier snack alternatives',
      'High in sodium - limit intake',
      'Low nutritional value per calorie'
    ]
  },
  { 
    id: 'food_4',
    name: 'Smoothie Bowl', 
    rating: 7.8, 
    time: '2 days ago', 
    color: '#f59e0b',
    image: null,
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 8,
    fiber: 10,
    sugar: 28,
    sodium: 85,
    healthScores: {
      nutritional: 8.0,
      processing: 8.5,
      ingredients: 7.8,
      allergens: 7.5,
      sustainability: 7.2,
      overall: 7.8
    },
    ingredients: ['Acai puree', 'Banana', 'Blueberries', 'Granola', 'Chia seeds', 'Honey'],
    description: 'Acai smoothie bowl topped with fresh fruits and granola.',
    recommendations: [
      'Rich in antioxidants from berries',
      'Good source of fiber',
      'Watch portion size due to natural sugars'
    ]
  },
];

const healthGoals = [
  { title: 'Healthy Eating', progress: '5/5', completed: true, icon: 'leaf-outline', iconColor: '#10b981' },
  { title: 'Food Quality', progress: '7.2', completed: true, icon: 'star-outline', iconColor: '#8b5cf6' },
  { title: 'Stay Consistent', progress: '4/7', completed: false, icon: 'calendar-outline', iconColor: '#3b82f6' },
];

// Goal icon background colors
const getGoalIconStyle = (iconColor: string) => {
  switch (iconColor) {
    case '#10b981': // Healthy Eating - Green
      return { backgroundColor: '#10b98120' };
    case '#3b82f6': // Stay Consistent - Blue  
      return { backgroundColor: '#3b82f620' };
    case '#8b5cf6': // Food Quality - Purple
      return { backgroundColor: '#8b5cf620' };
    default:
      return { backgroundColor: theme.colors.light.bgTertiary };
  }
};

export const ProgressScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('weekly');
  const navigation = useNavigation<ProgressScreenNavigationProp>();

  const currentData = chartData[selectedPeriod];

  const getBarColor = (rating: number) => {
    if (rating >= 8.0) return '#10b981'; // Excellent - Green
    if (rating >= 6.0) return '#3b82f6'; // Good - Blue  
    if (rating >= 4.0) return '#f59e0b'; // Average - Yellow
    return '#ef4444'; // Poor - Red
  };

  const handleFoodPress = (food: typeof recentFoods[0]) => {
    navigation.navigate('FoodDetails', { food });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Your Progress</Text>
        <TouchableOpacity 
          style={styles.goalsButton}
          onPress={() => navigation.navigate('HealthGoals')}
        >
          <Ionicons name="flag-outline" size={16} color={theme.colors.light.textSecondary} />
          <Text style={styles.goalsButtonText}>Goals</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.mainContent} 
        showsVerticalScrollIndicator={false} 
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Hero Stats */}
        <View style={styles.heroStats}>
          <View style={styles.heroStatCard}>
            <Text style={[styles.heroStatNumber, styles.positive]}>7.2</Text>
            <Text style={styles.heroStatLabel}>Average Health Rating</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatNumber}>23</Text>
            <Text style={styles.heroStatLabel}>Foods Analyzed</Text>
          </View>
        </View>

        {/* Weekly Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          
          {/* Time Period Toggle */}
          <View style={styles.periodToggle}>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                selectedPeriod === 'weekly' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('weekly')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'weekly' && styles.periodButtonTextActive
              ]}>
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                selectedPeriod === 'monthly' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('monthly')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'monthly' && styles.periodButtonTextActive
              ]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.periodButton,
                selectedPeriod === 'alltime' && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod('alltime')}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === 'alltime' && styles.periodButtonTextActive
              ]}>
                All Time
              </Text>
            </TouchableOpacity>
          </View>

          {/* Period Label */}
          <View style={styles.periodLabelContainer}>
            <Text style={styles.periodLabel}>{periodLabels[selectedPeriod]}</Text>
          </View>
          
          <View style={styles.weeklyChart}>
            {currentData.map((data, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.chartBarContainer}>
                  <View 
                    style={[
                      styles.chartBar,
                      {
                        height: `${data.height}%`,
                        backgroundColor: getBarColor(data.rating),
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Month</Text>
            <View style={styles.timePeriod}>
              <Text style={styles.timePeriodText}>June 2025</Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>67</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>14</Text>
              <Text style={styles.statLabel}>Excellent Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>89%</Text>
              <Text style={styles.statLabel}>Goal Achievement</Text>
            </View>
          </View>
        </View>

        {/* Recent Foods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Foods</Text>
            <View style={styles.timePeriod}>
              <Text style={styles.timePeriodText}>Today</Text>
            </View>
          </View>
          
          <View style={styles.foodList}>
            {recentFoods.map((food, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.foodItem}
                onPress={() => handleFoodPress(food)}
                activeOpacity={0.7}
              >
                <View style={styles.foodImage}>
                  <Ionicons name="star" size={20} color={theme.colors.light.textSecondary} />
                </View>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodTime}>{food.time}</Text>
                </View>
                <Text style={[styles.foodRating, { color: food.color }]}>
                  {food.rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Health Goals */}
        <TouchableOpacity 
          style={styles.section}
          onPress={() => navigation.navigate('HealthGoals')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Goals</Text>
            <View style={styles.timePeriod}>
              <Text style={styles.timePeriodText}>This week</Text>
            </View>
          </View>
          
          <View style={styles.goalsGrid}>
            {healthGoals.map((goal, index) => (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalInfo}>
                  <View style={[styles.goalIcon, getGoalIconStyle(goal.iconColor)]}>
                    <Ionicons name={goal.icon as any} size={18} color={goal.iconColor} />
                  </View>
                  <Text style={styles.goalText}>{goal.title}</Text>
                </View>
                <Text style={[
                  styles.goalProgress,
                  goal.completed && styles.goalProgressCompleted
                ]}>
                  {goal.progress}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>


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
  pageTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    flex: 1,
  },
  goalsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    gap: 6,
  },
  goalsButtonText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.textSecondary,
  },

  mainContent: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom tab navigation
  },
  heroStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  heroStatNumber: {
    fontSize: 32,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    lineHeight: 36,
  },
  positive: {
    color: '#10b981',
  },
  heroStatLabel: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    marginTop: 8,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
  section: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  timePeriod: {
    backgroundColor: theme.colors.light.bgTertiary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timePeriodText: {
    fontSize: 13,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: theme.colors.light.accentDark,
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.textSecondary,
  },
  periodButtonTextActive: {
    color: 'white',
  },
  periodLabelContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  periodLabel: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  weeklyChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
    gap: 8,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    height: 100,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 8,
  },
  chartLabel: {
    fontSize: 11,
    color: theme.colors.light.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.light.textSecondary,
    marginTop: 4,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
  foodList: {
    gap: 12,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    gap: 12,
  },
  foodImage: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.light.bgTertiary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 2,
  },
  foodTime: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
  },
  foodRating: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    minWidth: 40,
    textAlign: 'right',
  },
  goalsGrid: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  goalIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.textPrimary,
    flex: 1,
  },
  goalProgress: {
    fontSize: 13,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.semibold,
  },
  goalProgressCompleted: {
    color: '#10b981',
  },

});
