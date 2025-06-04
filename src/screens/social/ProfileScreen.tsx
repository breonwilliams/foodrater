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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types/navigation';
import { 
  mockUserProfile, 
  mockFoodPosts, 
  STORAGE_KEYS,
  type UserProfile, 
  type FoodPost 
} from '../../data/mockSocialData';
import { FoodDetailsBottomSheet } from '../../components/social/FoodDetailsBottomSheet';
import { socialStorageService } from '../../services/socialStorage';
import type { SocialPost } from '../../components/social/PostCard';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  route?: ProfileScreenRouteProp;
}

// Filter options (same as HistoryScreen)
const filterOptions = [
  { id: 'all', label: 'All Posts', color: theme.colors.light.textSecondary },
  { id: 'excellent', label: 'Excellent (8.0+)', color: '#10b981' },
  { id: 'good', label: 'Good (6.0-8.0)', color: '#3b82f6' },
  { id: 'average', label: 'Average (4.0-6.0)', color: '#f59e0b' },
  { id: 'poor', label: 'Poor (<4.0)', color: '#ef4444' },
];

export const ProfileScreen = ({ route }: ProfileScreenProps) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  
  // Extract userId from route params
  const { userId, username } = route?.params || {};
  const [isOwnProfile, setIsOwnProfile] = useState(!userId); // If no userId, it's own profile
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [posts, setPosts] = useState<FoodPost[]>(mockFoodPosts);
  const [isLoading, setIsLoading] = useState(true);
  
  // Three-dots menu state
  const [showOptionsBottomSheet, setShowOptionsBottomSheet] = useState(false);
  
  // Search & Filter State (from HistoryScreen)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Bottom Sheet State
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUserProfile);
  
  // Loading states for interactions
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

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
      setIsLoading(true);
      
      if (isOwnProfile) {
        // Load current user's profile (existing logic)
        const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (profileJson) {
          const savedProfile = JSON.parse(profileJson);
          setProfile(savedProfile);
        } else {
          // Save default profile if none exists
          await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockUserProfile));
        }
        
        // Load own posts
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
      } else {
        // Load other user's profile
        const otherUserProfile = await loadOtherUserProfile(userId!);
        const otherUserPosts = await loadOtherUserPosts(userId!);
        
        setProfile(otherUserProfile);
        setPosts(otherUserPosts);
      }
      
      // Load social interaction data for posts
      await loadSocialInteractionData();
      
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOtherUserProfile = async (userId: string): Promise<UserProfile> => {
    // TODO: Replace with actual API call
    // For now, return mock data based on userId
    const mockOtherUsers: { [key: string]: UserProfile } = {
      'user_2': {
        id: 'user_2',
        username: 'sarah_healthy',
        displayName: 'Sarah Johnson',
        bio: 'Nutritionist 🥗 Sharing healthy recipes and tips ✨',
        profilePhoto: null,
        isPrivate: false,
        stats: {
          postsCount: 45,
          followersCount: 1200,
          followingCount: 340,
        },
        isOwnProfile: false,
        isFollowing: false, // Check if current user follows this user
      },
      'user_3': {
        id: 'user_3',
        username: 'mike_fitness',
        displayName: 'Mike Chen',
        bio: 'Fitness coach 💪 Plant-based athlete 🌱',
        profilePhoto: null,
        isPrivate: false,
        stats: {
          postsCount: 67,
          followersCount: 890,
          followingCount: 156,
        },
        isOwnProfile: false,
        isFollowing: true,
      },
      'user_4': {
        id: 'user_4',
        username: 'healthy_guru',
        displayName: 'Alex Rodriguez',
        bio: 'Wellness coach & recipe creator 🌟 Living my best healthy life!',
        profilePhoto: null,
        isPrivate: false,
        stats: {
          postsCount: 89,
          followersCount: 2100,
          followingCount: 245,
        },
        isOwnProfile: false,
        isFollowing: false,
      },
      // Add more mock users as needed
    };
    
    return mockOtherUsers[userId] || mockOtherUsers['user_2'];
  };

  const loadOtherUserPosts = async (userId: string): Promise<FoodPost[]> => {
    // TODO: Replace with actual API call
    // For now, return mock posts for other users
    const mockOtherUserPosts: FoodPost[] = [
      {
        id: 'other_post_1',
        userId: userId,
        foodName: 'Kale Caesar Salad',
        category: 'Salad',
        rating: 8.7,
        calories: 280,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        caption: 'Homemade caesar dressing makes all the difference! 🥬',
        image: null,
        isPublic: true,
        foodData: {
          name: 'Kale Caesar Salad',
          category: 'Salad',
          rating: 8.7,
          calories: 280,
        },
        likesCount: 24,
        commentsCount: 8,
        isLiked: false,
        isSaved: false,
      },
      {
        id: 'other_post_2',
        userId: userId,
        foodName: 'Protein Smoothie Bowl',
        category: 'Breakfast',
        rating: 9.2,
        calories: 340,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        caption: 'Perfect post-workout fuel 💪',
        image: null,
        isPublic: true,
        foodData: {
          name: 'Protein Smoothie Bowl',
          category: 'Breakfast',
          rating: 9.2,
          calories: 340,
        },
        likesCount: 31,
        commentsCount: 12,
        isLiked: true,
        isSaved: false,
      },
      {
        id: 'other_post_3',
        userId: userId,
        foodName: 'Mediterranean Bowl',
        category: 'Lunch',
        rating: 8.9,
        calories: 420,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        caption: 'Fresh ingredients from the farmers market 🌿',
        image: null,
        isPublic: true,
        foodData: {
          name: 'Mediterranean Bowl',
          category: 'Lunch',
          rating: 8.9,
          calories: 420,
        },
        likesCount: 18,
        commentsCount: 5,
        isLiked: false,
        isSaved: true,
      },
      // Add more mock posts
    ];
    
    return mockOtherUserPosts;
  };

  const loadSocialInteractionData = async () => {
    // Load current user data for interactions
    try {
      const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (profileJson) {
        const savedProfile = JSON.parse(profileJson);
        setCurrentUser(savedProfile);
      }
    } catch (error) {
      console.error('Error loading current user data:', error);
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
    // Convert FoodPost to SocialPost format for bottom sheet
    const socialPost: SocialPost = {
      id: post.id,
      user: {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        profilePhoto: profile.profilePhoto || undefined,
      },
      foodData: {
        name: post.foodName,
        category: post.category || 'Food',
        rating: post.rating,
        calories: post.calories || 0,
      },
      image: post.image || undefined,
      caption: post.caption,
      createdAt: post.createdAt,
      timestamp: new Date(post.createdAt).getTime(),
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
      isLiked: post.isLiked || false,
      isSaved: post.isSaved || false,
    };

    setSelectedPost(socialPost);
    setShowBottomSheet(true);
  };

  const handleStatsPress = (statType: 'posts' | 'followers' | 'following') => {
    Alert.alert('Stats', `${statType} list coming soon!`);
  };

  // Social interaction handlers
  const handleLike = async (postId: string) => {
    if (isLiking || !selectedPost) return;
    setIsLiking(true);

    try {
      const newLikeStatus = await socialStorageService.toggleLike(postId, currentUser.id);
      
      if (newLikeStatus !== null) {
        // Update the selected post for bottom sheet
        setSelectedPost(prev => prev ? {
          ...prev,
          isLiked: newLikeStatus,
          likesCount: newLikeStatus ? prev.likesCount + 1 : prev.likesCount - 1
        } : null);

        // Update the post in the posts array
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { 
                  ...post, 
                  isLiked: newLikeStatus,
                  likesCount: newLikeStatus ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1)
                }
              : post
          )
        );

        // Generate notification if liking someone else's post
        if (newLikeStatus && !profile.isOwnProfile) {
          await generateLikeNotification(postId, currentUser, profile);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async (postId: string) => {
    if (isSaving || !selectedPost) return;
    setIsSaving(true);

    try {
      const newSaveStatus = await socialStorageService.toggleSave(postId, currentUser.id);
      
      if (newSaveStatus !== null) {
        setSelectedPost(prev => prev ? {
          ...prev,
          isSaved: newSaveStatus
        } : null);

        // Update posts array
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, isSaved: newSaveStatus }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'Failed to update save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    if (isCommenting || !selectedPost || !commentText.trim()) return;
    setIsCommenting(true);

    try {
      const newComment = {
        id: `comment_${Date.now()}`,
        postId,
        user: {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName,
          profilePhoto: currentUser.profilePhoto || undefined,
        },
        text: commentText.trim(),
        createdAt: 'Just now',
        timestamp: Date.now(),
      };

      const success = await socialStorageService.addComment(newComment);
      
      if (success) {
        // Update comment count
        setSelectedPost(prev => prev ? {
          ...prev,
          commentsCount: prev.commentsCount + 1
        } : null);

        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
              : post
          )
        );

        // Generate notification if commenting on someone else's post
        if (!profile.isOwnProfile) {
          await generateCommentNotification(postId, newComment, currentUser, profile);
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsCommenting(false);
    }
  };

  // Notification generation functions
  const generateLikeNotification = async (
    postId: string, 
    liker: UserProfile, 
    postOwner: UserProfile
  ) => {
    try {
      const notificationsJson = await AsyncStorage.getItem('notifications');
      const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
      
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newNotification = {
        id: `like_${postId}_${Date.now()}`,
        type: 'social_like',
        title: 'New like on your post!',
        description: `${liker.displayName} liked your ${post.foodName} post! ❤️`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionType: 'navigate_to_post',
        icon: 'heart',
        iconColor: '#ef4444',
        relatedData: { postId, userId: liker.id }
      };

      notifications.unshift(newNotification);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error generating like notification:', error);
    }
  };

  const generateCommentNotification = async (
    postId: string,
    comment: any,
    commenter: UserProfile,
    postOwner: UserProfile
  ) => {
    try {
      const notificationsJson = await AsyncStorage.getItem('notifications');
      const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
      
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newNotification = {
        id: `comment_${postId}_${Date.now()}`,
        type: 'social_comment',
        title: 'New comment on your post!',
        description: `${commenter.displayName} commented: "${comment.text.substring(0, 50)}${comment.text.length > 50 ? '...' : ''}" 💬`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionType: 'navigate_to_post',
        icon: 'chatbubble',
        iconColor: '#3b82f6',
        relatedData: { postId, commentId: comment.id, userId: commenter.id }
      };

      notifications.unshift(newNotification);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error generating comment notification:', error);
    }
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
      {/* Header with Dynamic Actions */}
      <View style={styles.header}>
        {!isOwnProfile && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
        )}
        
        <Text style={styles.headerTitle}>
          {isOwnProfile ? 'Profile' : `@${profile.username}`}
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color={theme.colors.light.textPrimary} />
          </TouchableOpacity>
          
          {isOwnProfile ? (
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={20} color={theme.colors.light.textPrimary} />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                style={[
                  styles.followButtonHeader,
                  profile.isFollowing && styles.followingButtonHeader
                ]}
                onPress={handleFollow}
              >
                <Text style={[
                  styles.followButtonHeaderText,
                  profile.isFollowing && styles.followingButtonHeaderText
                ]}>
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionsButton}
                onPress={() => setShowOptionsBottomSheet(true)}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.light.textPrimary} />
              </TouchableOpacity>
            </>
          )}
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
        {!isOwnProfile && (
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
      
      {/* Food Details Bottom Sheet */}
      {selectedPost && (
        <FoodDetailsBottomSheet
          post={selectedPost}
          isVisible={showBottomSheet}
          onClose={() => {
            setShowBottomSheet(false);
            setSelectedPost(null);
          }}
          currentUser={currentUser}
          onLike={handleLike}
          onSave={handleSave}
          onComment={handleComment}
        />
      )}

      {/* Profile Options Bottom Sheet */}
      <ProfileOptionsBottomSheet
        isVisible={showOptionsBottomSheet}
        onClose={() => setShowOptionsBottomSheet(false)}
        profile={profile}
      />
    </SafeAreaView>
  );
};

// Profile Options Bottom Sheet Component
const ProfileOptionsBottomSheet = ({ 
  isVisible, 
  onClose, 
  profile 
}: { 
  isVisible: boolean; 
  onClose: () => void; 
  profile: UserProfile;
}) => {
  const handleBlock = () => {
    onClose();
    Alert.alert(
      'Block User',
      `Are you sure you want to block @${profile.username}? They won't be able to see your posts or follow you.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement block functionality
            Alert.alert('Blocked', `You have blocked @${profile.username}`);
          }
        }
      ]
    );
  };

  const handleReport = () => {
    onClose();
    Alert.alert(
      'Report User',
      'What would you like to report about this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Spam', onPress: () => handleReportSubmit('spam') },
        { text: 'Inappropriate Content', onPress: () => handleReportSubmit('inappropriate') },
        { text: 'Harassment', onPress: () => handleReportSubmit('harassment') },
      ]
    );
  };

  const handleReportSubmit = (reason: string) => {
    // TODO: Implement report functionality
    Alert.alert('Report Submitted', 'Thank you for your report. We\'ll review it shortly.');
  };

  const handleCopyLink = async () => {
    onClose();
    // TODO: Implement actual profile link generation
    const profileLink = `https://foodrater.app/profile/${profile.username}`;
    
    // For now, just show alert
    Alert.alert('Link Copied', `Profile link copied to clipboard`);
  };

  const handleShare = async () => {
    onClose();
    try {
      // TODO: Implement actual sharing
      Alert.alert('Share Profile', `Sharing @${profile.username}'s profile`);
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={bottomSheetStyles.bottomSheetOverlay}>
        <TouchableOpacity 
          style={bottomSheetStyles.bottomSheetBackdrop} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View style={bottomSheetStyles.optionsBottomSheet}>
          <View style={bottomSheetStyles.bottomSheetHandle} />
          
          <Text style={bottomSheetStyles.bottomSheetTitle}>@{profile.username}</Text>
          
          <TouchableOpacity style={bottomSheetStyles.bottomSheetOption} onPress={handleCopyLink}>
            <Ionicons name="link" size={20} color={theme.colors.light.textSecondary} />
            <Text style={bottomSheetStyles.bottomSheetOptionText}>Copy Link</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={bottomSheetStyles.bottomSheetOption} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={theme.colors.light.textSecondary} />
            <Text style={bottomSheetStyles.bottomSheetOptionText}>Share Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={bottomSheetStyles.bottomSheetOption} onPress={handleReport}>
            <Ionicons name="flag-outline" size={20} color="#f59e0b" />
            <Text style={[bottomSheetStyles.bottomSheetOptionText, { color: '#f59e0b' }]}>Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={bottomSheetStyles.bottomSheetOption} onPress={handleBlock}>
            <Ionicons name="ban" size={20} color="#ef4444" />
            <Text style={[bottomSheetStyles.bottomSheetOptionText, { color: '#ef4444' }]}>Block</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={bottomSheetStyles.bottomSheetCancel} onPress={onClose}>
            <Text style={bottomSheetStyles.bottomSheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Bottom Sheet Styles
const bottomSheetStyles = StyleSheet.create({
  bottomSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionsBottomSheet: {
    backgroundColor: theme.colors.light.bgSecondary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.light.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  bottomSheetOptionText: {
    fontSize: 16,
    color: theme.colors.light.textPrimary,
  },
  bottomSheetCancel: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.light.bgTertiary,
    borderRadius: 8,
  },
  bottomSheetCancelText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
});

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonHeader: {
    backgroundColor: theme.colors.light.accentDark,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  followingButtonHeader: {
    backgroundColor: theme.colors.light.bgTertiary,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  followButtonHeaderText: {
    fontSize: 12,
    fontWeight: theme.typography.weights.semibold,
    color: 'white',
  },
  followingButtonHeaderText: {
    color: theme.colors.light.textPrimary,
  },
  optionsButton: {
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
    paddingBottom: 100, // Extra padding for bottom tab navigation
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
