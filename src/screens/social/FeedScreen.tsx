import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { PostCard, type SocialPost } from '../../components/social/PostCard';
import { 
  mockFollowingPosts, 
  mockForYouPosts,
  mockUserProfile,
  type UserProfile,
  STORAGE_KEYS 
} from '../../data/mockSocialData';

type FeedScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Feed'>,
  StackNavigationProp<RootStackParamList>
>;

type FeedTab = 'following' | 'forYou';

export const FeedScreen = () => {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUserProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    loadFeedData();
  }, [activeTab, followingUsers]);

  // Reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
      loadFeedData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      // Load current user profile
      const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (profileJson) {
        const savedProfile = JSON.parse(profileJson);
        setCurrentUser(savedProfile);
      }

      // Load following users list
      const followingJson = await AsyncStorage.getItem(STORAGE_KEYS.FOLLOWING_USERS);
      if (followingJson) {
        const savedFollowing = JSON.parse(followingJson);
        setFollowingUsers(savedFollowing);
      } else {
        // Default following list for demo
        const defaultFollowing = ['user_2', 'user_3', 'user_4'];
        setFollowingUsers(defaultFollowing);
        await AsyncStorage.setItem(STORAGE_KEYS.FOLLOWING_USERS, JSON.stringify(defaultFollowing));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadFeedData = async () => {
    setIsLoading(true);
    try {
      let feedPosts: SocialPost[] = [];
      
      if (activeTab === 'following') {
        // Show posts from followed users only
        feedPosts = mockFollowingPosts.filter(post => 
          followingUsers.includes(post.user.id)
        );
      } else {
        // Show popular posts from all users (For You)
        feedPosts = [...mockForYouPosts].sort((a, b) => b.timestamp - a.timestamp);
      }
      
      setPosts(feedPosts);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeedData();
    setRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
            }
          : post
      )
    );
    
    // TODO: Sync with backend
    console.log('Like toggled for post:', postId);
  };

  const handleComment = (postId: string) => {
    Alert.alert('Comments', 'Comments functionality coming soon!');
    // TODO: Navigate to PostDetailsScreen with comments focus
  };

  const handleSave = async (postId: string) => {
    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
    
    // TODO: Sync with backend
    console.log('Save toggled for post:', postId);
  };

  const handleViewDetails = (post: SocialPost) => {
    Alert.alert(
      'Food Details', 
      `Opening details for ${post.foodData.name}\nRating: ${post.foodData.rating}\nCalories: ${post.foodData.calories}`
    );
    // TODO: Open FoodDetailsBottomSheet
  };

  const handleUserPress = (userId: string) => {
    Alert.alert('User Profile', `Opening profile for user: ${userId}`);
    // TODO: Navigate to user's profile
    // navigation.navigate('UserProfile', { userId });
  };

  const handleTabChange = (tab: FeedTab) => {
    setActiveTab(tab);
  };

  const renderPost = ({ item }: { item: SocialPost }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onComment={handleComment}
      onSave={handleSave}
      onViewDetails={handleViewDetails}
      onUserPress={handleUserPress}
    />
  );

  const renderEmptyFollowing = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="people-outline" size={48} color={theme.colors.light.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptySubtitle}>
        Follow other users to see their food posts here
      </Text>
      <TouchableOpacity 
        style={styles.discoverButton}
        onPress={() => setActiveTab('forYou')}
      >
        <Text style={styles.discoverButtonText}>Discover Users</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyForYou = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="restaurant-outline" size={48} color={theme.colors.light.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No posts to show</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new food discoveries
      </Text>
    </View>
  );

  const renderEmpty = () => {
    return activeTab === 'following' ? renderEmptyFollowing() : renderEmptyForYou();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Feed Toggle */}
      <View style={styles.feedToggle}>
        <TouchableOpacity 
          style={[
            styles.toggleButton,
            activeTab === 'following' && styles.toggleButtonActive
          ]}
          onPress={() => handleTabChange('following')}
        >
          <Text style={[
            styles.toggleButtonText,
            activeTab === 'following' && styles.toggleButtonTextActive
          ]}>
            Following
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.toggleButton,
            activeTab === 'forYou' && styles.toggleButtonActive
          ]}
          onPress={() => handleTabChange('forYou')}
        >
          <Text style={[
            styles.toggleButtonText,
            activeTab === 'forYou' && styles.toggleButtonTextActive
          ]}>
            For You
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feed Content */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={theme.colors.light.accentDark}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.feedContent,
          posts.length === 0 && styles.feedContentEmpty
        ]}
        ListEmptyComponent={renderEmpty}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={3}
        contentInsetAdjustmentBehavior="never"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  feedToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.bgSecondary,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.light.accentDark,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textSecondary,
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  feedContent: {
    paddingTop: 8,
    paddingBottom: 0,
  },
  feedContentEmpty: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
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
  discoverButton: {
    backgroundColor: theme.colors.light.accentDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  discoverButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
  },
});
