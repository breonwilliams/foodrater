import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SectionList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';
import { 
  mockUserProfile, 
  mockFoodPosts, 
  STORAGE_KEYS,
  type UserProfile, 
  type FoodPost 
} from '../../data/mockSocialData';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

// Filter options (same as HistoryScreen)
const filterOptions = [
  { id: 'all', label: 'All Posts', color: theme.colors.light.textSecondary },
  { id: 'excellent', label: 'Excellent (8.0+)', color: '#10b981' },
  { id: 'good', label: 'Good (6.0-8.0)', color: '#3b82f6' },
  { id: 'average', label: 'Average (4.0-6.0)', color: '#f59e0b' },
  { id: 'poor', label: 'Poor (<4.0)', color: '#ef4444' },
];

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [posts, setPosts] = useState<FoodPost[]>(mockFoodPosts);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter State (from HistoryScreen)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  // Reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadProfileData = async () => {
    try {
      // Load user profile
      const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (profileJson) {
        const savedProfile = JSON.parse(profileJson);
        setProfile(savedProfile);
      } else {
        // Save default profile if none exists
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockUserProfile));
      }

      // Load food posts
      const postsJson = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_POSTS);
      if (postsJson) {
        const savedPosts = JSON.parse(postsJson);
        setPosts(savedPosts);
        
        // Update profile stats based on actual posts
        const updatedProfile = {
          ...profile,
          stats: {
            ...profile.stats,
            postsCount: savedPosts.length,
          },
        };
        setProfile(updatedProfile);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
      } else {
        // Save default posts if none exist
        await AsyncStorage.setItem(STORAGE_KEYS.FOOD_POSTS, JSON.stringify(mockFoodPosts));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter functions (copied from HistoryScreen)
  const filterPostsByRating = (posts: FoodPost[]) => {
    return posts.filter(post => {
      switch (selectedFilter) {
        case 'excellent':
          return post.rating >= 8.0;
        case 'good':
          return post.rating >= 6.0 && post.rating < 8.0;
        case 'average':
          return post.rating >= 4.0 && post.rating < 6.0;
        case 'poor':
          return post.rating < 4.0;
        default:
          return true;
      }
    });
  };

  const filterPostsBySearch = (posts: FoodPost[]) => {
    if (!searchQuery.trim()) return posts;
    return posts.filter(post =>
      post.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.caption && post.caption.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Organize posts by date (adapted from HistoryScreen)
  const organizePostsByDate = (posts: FoodPost[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const sections = [
      { title: 'Today', data: [] as FoodPost[] },
      { title: 'Yesterday', data: [] as FoodPost[] },
      { title: 'This Week', data: [] as FoodPost[] },
      { title: 'Earlier', data: [] as FoodPost[] }
    ];

    posts.forEach(post => {
      const postDate = new Date(post.createdAt);
      const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());

      if (postDay.getTime() === today.getTime()) {
        sections[0].data.push(post);
      } else if (postDay.getTime() === yesterday.getTime()) {
        sections[1].data.push(post);
      } else if (postDay.getTime() > weekAgo.getTime()) {
        sections[2].data.push(post);
      } else {
        sections[3].data.push(post);
      }
    });

    return sections.filter(section => section.data.length > 0);
  };

  const getFilteredData = () => {
    const filteredPosts = filterPostsBySearch(filterPostsByRating(posts));
    return organizePostsByDate(filteredPosts);
  };

  const getTotalCount = () => {
    return getFilteredData().reduce((total, section) => total + section.data.length, 0);
  };

  // Helper functions
  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return '#10b981'; // Excellent - Green
    if (rating >= 6.0) return '#3b82f6'; // Good - Blue  
    if (rating >= 4.0) return '#f59e0b'; // Average - Yellow
    return '#ef4444'; // Poor - Red
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 8.0) return 'Excellent';
    if (rating >= 6.0) return 'Good';
    if (rating >= 4.0) return 'Average';
    return 'Poor';
  };

  const formatPostTime = (createdAt: string) => {
    const postDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return postDate.toLocaleDateString();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Event handlers
  const handleFollow = () => {
    Alert.alert('Follow', 'Follow functionality coming soon!');
  };

  const handleMessage = () => {
    Alert.alert('Message', 'Messaging functionality coming soon!');
  };

  const handlePostPress = (post: FoodPost) => {
    Alert.alert(
      'Post Details', 
      `Viewing ${post.foodName}\nRating: ${post.rating}\nCaption: ${post.caption || 'No caption'}`
    );
    // TODO: navigation.navigate('PostDetails', { post });
  };

  const handleStatsPress = (statType: 'posts' | 'followers' | 'following') => {
    Alert.alert('Stats', `${statType} list coming soon!`);
  };

  // Render functions (adapted from HistoryScreen)
  const renderPostItem = ({ item }: { item: FoodPost }) => (
    <TouchableOpacity 
      style={styles.foodItem} 
      onPress={() => handlePostPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.foodImage}>
        <Ionicons name="restaurant" size={20} color={theme.colors.light.textSecondary} />
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <View style={styles.foodMeta}>
          <Text style={styles.foodCategory}>{item.category}</Text>
          <Text style={styles.foodCalories}>{item.calories} cal</Text>
        </View>
        <Text style={styles.foodTime}>{formatPostTime(item.createdAt)}</Text>
        {item.caption && (
          <Text style={styles.foodCaption} numberOfLines={1}>"{item.caption}"</Text>
        )}
      </View>
      <View style={styles.ratingContainer}>
        <Text style={[styles.foodRating, { color: getRatingColor(item.rating) }]}>
          {item.rating}
        </Text>
        <Text style={styles.ratingLabel}>{getRatingLabel(item.rating)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} posts</Text>
    </View>
  );

  const filteredData = getFilteredData();
  const totalCount = getTotalCount();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Filter Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Top Row: Name/Username + Profile Photo */}
        <View style={styles.profileTopRow}>
          {/* Left Side: Name, Username, Bio, and Followers */}
          <View style={styles.profileInfoLeft}>
            {/* Display Name */}
            <Text style={styles.displayName}>{profile.displayName}</Text>
            {/* Username with @ symbol */}
            <Text style={styles.username}>@{profile.username}</Text>
            
            {/* Bio */}
            {profile.bio && (
              <Text style={styles.bio}>{profile.bio}</Text>
            )}

            {/* Followers Section */}
            <View style={styles.followersSection}>
              <View style={styles.followerAvatars}>
                {/* Mock follower avatars */}
                <View style={styles.followerAvatar}>
                  <Ionicons name="person" size={12} color={theme.colors.light.textSecondary} />
                </View>
                <View style={styles.followerAvatar}>
                  <Ionicons name="person" size={12} color={theme.colors.light.textSecondary} />
                </View>
                <View style={styles.followerAvatar}>
                  <Ionicons name="person" size={12} color={theme.colors.light.textSecondary} />
                </View>
              </View>
              <TouchableOpacity onPress={() => handleStatsPress('followers')}>
                <Text style={styles.followersText}>{formatNumber(profile.stats.followersCount)} followers</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Side: Profile Photo */}
          <View style={styles.profilePhotoContainer}>
            {profile.profilePhoto ? (
              // TODO: Add actual image when available
              <View style={styles.profilePhotoPlaceholder}>
                <Ionicons name="person" size={32} color={theme.colors.light.textSecondary} />
              </View>
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Ionicons name="person" size={32} color={theme.colors.light.textSecondary} />
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons - Only for other users */}
        {!profile.isOwnProfile && (
          <View style={styles.actionButtonsContainer}>
            <View style={styles.otherUserActions}>
              <TouchableOpacity 
                style={[
                  styles.followButton,
                  profile.isFollowing && styles.followingButton
                ]} 
                onPress={handleFollow}
              >
                <Text style={[
                  styles.followButtonText,
                  profile.isFollowing && styles.followingButtonText
                ]}>
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Search Bar & Filter Options - Only show when filters are toggled */}
      {showFilters && (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={16} color={theme.colors.light.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search posts..."
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
        </>
      )}

      {/* Results Summary (adapted from HistoryScreen) */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {totalCount} {totalCount === 1 ? 'post' : 'posts'} found
          {selectedFilter !== 'all' && ` • ${filterOptions.find(f => f.id === selectedFilter)?.label}`}
        </Text>
        {profile.isOwnProfile && (
          <Text style={styles.profileHint}>Your shared food posts</Text>
        )}
      </View>

      {/* Posts List (adapted from HistoryScreen) */}
      {filteredData.length > 0 ? (
        <SectionList
          sections={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          renderSectionHeader={renderSectionHeader}
          style={styles.postsList}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={styles.sectionListContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="restaurant-outline" size={48} color={theme.colors.light.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No posts found</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery.trim() || selectedFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : profile.isOwnProfile 
                ? 'Share your first food rating to get started!'
                : `${profile.displayName} hasn't shared any food posts yet.`
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
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Profile Section Styles
  profileSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.light.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  profilePhotoContainer: {
    marginLeft: 16,
  },
  profileInfoLeft: {
    flex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    marginBottom: 4,
  },
  profilePhotoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.light.borderLight,
  },
  username: {
    fontSize: 15,
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.light.textSecondary,
    marginBottom: 0,
  },
  bio: {
    fontSize: 15,
    color: theme.colors.light.textPrimary,
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 12,
  },
  followersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    gap: 8,
  },
  followerAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  followerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
    borderWidth: 1,
    borderColor: theme.colors.light.bgSecondary,
  },
  followersText: {
    fontSize: 15,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.normal,
  },
  actionButtonsContainer: {
    width: '100%',
  },

  otherUserActions: {
    flexDirection: 'row',
    gap: 12,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.light.accentDark,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  followingButton: {
    backgroundColor: theme.colors.light.bgTertiary,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: 'white',
  },
  followingButtonText: {
    color: theme.colors.light.textPrimary,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.light.bgTertiary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },

  // Search & Filter Styles (from HistoryScreen)
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
    paddingVertical: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.light.bgSecondary,
  },
  summaryText: {
    fontSize: 13,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  profileHint: {
    fontSize: 11,
    color: theme.colors.light.textMuted,
    fontStyle: 'italic',
  },

  // Posts List Styles (from HistoryScreen)
  postsList: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  sectionListContent: {
    paddingBottom: 0,
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
    marginBottom: 2,
  },
  foodCaption: {
    fontSize: 11,
    color: theme.colors.light.textSecondary,
    fontStyle: 'italic',
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

  // Empty State Styles (from HistoryScreen)
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.light.textSecondary,
  },
});
