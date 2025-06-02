import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainTabParamList, RootStackParamList } from '../../types/navigation';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Favorites'>,
  StackNavigationProp<RootStackParamList>
>;

interface FavoriteFood {
  id: string;
  name: string;
  category: string;
  rating: number;
  calories: number;
  savedAt: string;
  date?: string;
  [key: string]: any;
}

export const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<FavoriteFood[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteFood[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const route = useRoute();

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (favoritesJson) {
        const favoritesData = JSON.parse(favoritesJson);
        // Sort by savedAt timestamp (newest first)
        const sortedFavorites = favoritesData.sort((a: FavoriteFood, b: FavoriteFood) => 
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        );
        setFavorites(sortedFavorites);
        setFilteredFavorites(sortedFavorites);
      } else {
        setFavorites([]);
        setFilteredFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFavorites();
    setIsRefreshing(false);
  };

  const filterFavorites = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredFavorites(favorites);
    } else {
      const filtered = favorites.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
  };

  const removeFavorite = async (foodId: string) => {
    try {
      const updatedFavorites = favorites.filter(food => food.id !== foodId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setFilteredFavorites(updatedFavorites.filter(food =>
        !searchQuery.trim() || 
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove from favorites. Please try again.');
    }
  };

  const handleRemoveFavorite = (food: FavoriteFood) => {
    Alert.alert(
      'Remove from Favorites',
      `Are you sure you want to remove "${food.name}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavorite(food.id),
        },
      ]
    );
  };

  const handleFoodPress = (food: FavoriteFood) => {
    navigation.navigate('FoodDetails', { food });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Check if we came from Settings screen
  const params = route.params as { from?: string } | undefined;
  const showBackButton = params?.from === 'Settings';



  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return '#10b981'; // Green
    if (rating >= 6.0) return '#3b82f6'; // Blue
    if (rating >= 4.0) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 8.0) return 'Excellent';
    if (rating >= 6.0) return 'Good';
    if (rating >= 4.0) return 'Average';
    return 'Poor';
  };

  const formatSavedDate = (savedAt: string) => {
    const savedDate = new Date(savedAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - savedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return savedDate.toLocaleDateString();
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteFood }) => (
    <TouchableOpacity style={styles.favoriteItem} onPress={() => handleFoodPress(item)}>
      <View style={styles.foodImage}>
        <Ionicons name="restaurant" size={20} color={theme.colors.light.textSecondary} />
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <View style={styles.foodMeta}>
          <Text style={styles.foodCategory}>{item.category}</Text>
          <Text style={styles.foodCalories}>{item.calories} cal</Text>
        </View>
        <Text style={styles.savedTime}>Saved {formatSavedDate(item.savedAt)}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={[styles.foodRating, { color: getRatingColor(item.rating) }]}>
          {item.rating}
        </Text>
        <Text style={styles.ratingLabel}>{getRatingLabel(item.rating)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item)}
      >
        <Ionicons name="heart" size={16} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={48} color={theme.colors.light.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery.trim() 
          ? 'No favorites match your search. Try a different term.'
          : 'Start saving foods you love by tapping the heart icon in food details.'
        }
      </Text>
      {searchQuery.trim() ? (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => {
            setSearchQuery('');
            setFilteredFavorites(favorites);
          }}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.exploreButtonText}>Start Scanning Foods</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {showBackButton ? (
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.light.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Favorites</Text>
          </View>
        ) : (
          <Text style={styles.headerTitle}>Favorites</Text>
        )}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={20} color={theme.colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color={theme.colors.light.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={filterFavorites}
            placeholder="Search favorites..."
            placeholderTextColor={theme.colors.light.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => filterFavorites('')}>
              <Ionicons name="close-circle" size={16} color={theme.colors.light.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {filteredFavorites.length} {filteredFavorites.length === 1 ? 'favorite' : 'favorites'}
          {searchQuery.trim() && ` found for "${searchQuery}"`}
        </Text>
      </View>

      {/* Favorites List */}
      {isLoading ? (
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          style={styles.favoritesList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={filteredFavorites.length === 0 ? styles.emptyListContainer : undefined}
        />
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
  refreshButton: {
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
  favoritesList: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  favoriteItem: {
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
  savedTime: {
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
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  emptyListContainer: {
    flexGrow: 1,
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
  clearSearchButton: {
    backgroundColor: theme.colors.light.accentDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearSearchText: {
    color: 'white',
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
  },
  exploreButton: {
    backgroundColor: theme.colors.light.accentDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
  },
});
