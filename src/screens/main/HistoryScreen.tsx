import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SectionList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainTabParamList, RootStackParamList } from '../../types/navigation';

type HistoryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'History'>,
  StackNavigationProp<RootStackParamList>
>;

const { width } = Dimensions.get('window');

// Mock history data organized by date
const mockHistoryData = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        name: 'Quinoa Salad Bowl',
        rating: 8.5,
        time: '2 hours ago',
        category: 'Healthy Bowl',
        calories: 320,
        color: '#10b981'
      },
      {
        id: '2',
        name: 'Greek Yogurt with Berries',
        rating: 9.1,
        time: '5 hours ago',
        category: 'Breakfast',
        calories: 180,
        color: '#10b981'
      }
    ]
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '3',
        name: 'Processed Snack Bar',
        rating: 3.2,
        time: 'Yesterday 8:30 PM',
        category: 'Snack',
        calories: 250,
        color: '#ef4444'
      },
      {
        id: '4',
        name: 'Grilled Chicken Salad',
        rating: 8.8,
        time: 'Yesterday 1:15 PM',
        category: 'Lunch',
        calories: 280,
        color: '#10b981'
      },
      {
        id: '5',
        name: 'Avocado Toast',
        rating: 7.2,
        time: 'Yesterday 8:00 AM',
        category: 'Breakfast',
        calories: 220,
        color: '#3b82f6'
      }
    ]
  },
  {
    title: 'This Week',
    data: [
      {
        id: '6',
        name: 'Smoothie Bowl',
        rating: 7.8,
        time: '2 days ago',
        category: 'Breakfast',
        calories: 290,
        color: '#3b82f6'
      },
      {
        id: '7',
        name: 'Pizza Slice',
        rating: 4.1,
        time: '3 days ago',
        category: 'Fast Food',
        calories: 380,
        color: '#f59e0b'
      },
      {
        id: '8',
        name: 'Salmon with Vegetables',
        rating: 9.3,
        time: '4 days ago',
        category: 'Dinner',
        calories: 340,
        color: '#10b981'
      },
      {
        id: '9',
        name: 'Energy Drink',
        rating: 2.1,
        time: '5 days ago',
        category: 'Beverage',
        calories: 160,
        color: '#ef4444'
      }
    ]
  },
  {
    title: 'Earlier',
    data: [
      {
        id: '10',
        name: 'Homemade Soup',
        rating: 8.0,
        time: '1 week ago',
        category: 'Lunch',
        calories: 200,
        color: '#10b981'
      },
      {
        id: '11',
        name: 'Chocolate Cake',
        rating: 3.5,
        time: '1 week ago',
        category: 'Dessert',
        calories: 450,
        color: '#ef4444'
      }
    ]
  }
];

const filterOptions = [
  { id: 'all', label: 'All Foods', color: theme.colors.light.textSecondary },
  { id: 'excellent', label: 'Excellent (8.0+)', color: '#10b981' },
  { id: 'good', label: 'Good (6.0-8.0)', color: '#3b82f6' },
  { id: 'average', label: 'Average (4.0-6.0)', color: '#f59e0b' },
  { id: 'poor', label: 'Poor (<4.0)', color: '#ef4444' },
];

export const HistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  const filterFoodsByRating = (foods: any[]) => {
    return foods.filter(food => {
      switch (selectedFilter) {
        case 'excellent':
          return food.rating >= 8.0;
        case 'good':
          return food.rating >= 6.0 && food.rating < 8.0;
        case 'average':
          return food.rating >= 4.0 && food.rating < 6.0;
        case 'poor':
          return food.rating < 4.0;
        default:
          return true;
      }
    });
  };

  const filterFoodsBySearch = (foods: any[]) => {
    if (!searchQuery.trim()) return foods;
    return foods.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredData = () => {
    return mockHistoryData.map(section => ({
      ...section,
      data: filterFoodsBySearch(filterFoodsByRating(section.data))
    })).filter(section => section.data.length > 0);
  };

  const getTotalCount = () => {
    return getFilteredData().reduce((total, section) => total + section.data.length, 0);
  };

  const handleFoodPress = (food: any) => {
    // Navigate to FoodDetailsScreen with the food data
    navigation.navigate('FoodDetails', { foodId: food.id });
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 8.0) return 'Excellent';
    if (rating >= 6.0) return 'Good';
    if (rating >= 4.0) return 'Average';
    return 'Poor';
  };

  const renderFoodItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.foodItem} onPress={() => handleFoodPress(item)}>
      <View style={styles.foodImage}>
        <Ionicons name="restaurant" size={20} color={theme.colors.light.textSecondary} />
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <View style={styles.foodMeta}>
          <Text style={styles.foodCategory}>{item.category}</Text>
          <Text style={styles.foodCalories}>{item.calories} cal</Text>
        </View>
        <Text style={styles.foodTime}>{item.time}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={[styles.foodRating, { color: item.color }]}>
          {item.rating}
        </Text>
        <Text style={styles.ratingLabel}>{getRatingLabel(item.rating)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} items</Text>
    </View>
  );

  const filteredData = getFilteredData();
  const totalCount = getTotalCount();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Food History</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color={theme.colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color={theme.colors.light.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search foods..."
            placeholderTextColor={theme.colors.light.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.colors.light.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.filterChip,
                  selectedFilter === option.id && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(option.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === option.id && styles.filterChipTextActive,
                  { color: selectedFilter === option.id ? 'white' : option.color }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {totalCount} {totalCount === 1 ? 'food' : 'foods'} found
          {selectedFilter !== 'all' && ` • ${filterOptions.find(f => f.id === selectedFilter)?.label}`}
        </Text>
      </View>

      {/* History List */}
      {filteredData.length > 0 ? (
        <SectionList
          sections={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderFoodItem}
          renderSectionHeader={renderSectionHeader}
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="restaurant-outline" size={48} color={theme.colors.light.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No foods found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery.trim() || selectedFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start scanning foods to build your history'
            }
          </Text>
          {(searchQuery.trim() || selectedFilter !== 'all') && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
            >
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          )}
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.light.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.light.textPrimary,
  },
  filtersContainer: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.light.bgPrimary,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: theme.colors.light.accentDark,
    borderColor: theme.colors.light.accentDark,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.medium,
  },
  filterChipTextActive: {
    color: 'white',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.light.bgSecondary,
  },
  summaryText: {
    fontSize: 13,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  historyList: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.light.bgSecondary,
    marginHorizontal: 20,
    marginBottom: 8,
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
    marginBottom: 4,
  },
  foodMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  foodCategory: {
    fontSize: 12,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  foodCalories: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
  },
  foodTime: {
    fontSize: 11,
    color: theme.colors.light.textMuted,
  },
  ratingContainer: {
    alignItems: 'center',
    minWidth: 60,
  },
  foodRating: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    marginBottom: 2,
  },
  ratingLabel: {
    fontSize: 10,
    color: theme.colors.light.textMuted,
    fontWeight: theme.typography.weights.medium,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.light.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: theme.colors.light.accentDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
  },
});
