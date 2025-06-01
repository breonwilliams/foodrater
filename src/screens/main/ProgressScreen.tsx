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
import type { MainTabParamList } from '../../types/navigation';

type ProgressScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Progress'>;

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

const recentFoods = [
  { name: 'Quinoa Salad Bowl', rating: 8.5, time: '2 hours ago', color: '#10b981' },
  { name: 'Greek Yogurt', rating: 9.1, time: '5 hours ago', color: '#10b981' },
  { name: 'Processed Snack', rating: 3.2, time: 'Yesterday', color: '#ef4444' },
  { name: 'Smoothie Bowl', rating: 7.8, time: '2 days ago', color: '#f59e0b' },
];

const healthGoals = [
  { title: 'Eat 5 healthy meals', progress: '5/5', completed: true, icon: 'pulse' },
  { title: 'Average rating above 7.0', progress: '7.2', completed: true, icon: 'star' },
  { title: 'Track meals daily', progress: '4/7', completed: false, icon: 'time' },
  { title: 'Try 3 new healthy foods', progress: '1/3', completed: false, icon: 'leaf' },
];

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={16} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Your Progress</Text>
        </View>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        
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
              <Text style={styles.timePeriodText}>December 2024</Text>
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
              <TouchableOpacity key={index} style={styles.foodItem}>
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
        <View style={styles.section}>
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
                  <View style={styles.goalIcon}>
                    <Ionicons name={goal.icon as any} size={16} color={theme.colors.light.textSecondary} />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },

  mainContent: {
    flex: 1,
    padding: 20,
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
    backgroundColor: theme.colors.light.bgTertiary,
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
  bottomPadding: {
    height: 20,
  },
});
