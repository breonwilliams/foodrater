import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification interface for social interactions
interface SocialNotification {
  id: string;
  type: 'social_like' | 'social_comment';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionType: 'navigate_to_profile' | 'navigate_to_feed';
  icon: string;
  iconColor: string;
  postId: string;
  fromUser: {
    id: string;
    username: string;
    displayName: string;
  };
}

// Storage keys for social features
const SOCIAL_STORAGE_KEYS = {
  LIKED_POSTS: 'likedPosts',
  SAVED_POSTS: 'savedPosts',
  COMMENTS: 'comments',
  FOLLOWING: 'following',
};

interface LikeData {
  postId: string;
  userId: string;
  timestamp: number;
}

interface SaveData {
  postId: string;
  userId: string;
  timestamp: number;
}

interface Comment {
  id: string;
  postId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    profilePhoto?: string;
  };
  text: string;
  createdAt: string;
  timestamp: number;
}

export const socialStorageService = {
  // Like/unlike posts
  toggleLike: async (postId: string, userId: string): Promise<boolean | null> => {
    try {
      const likedPostsJson = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.LIKED_POSTS);
      const likedPosts: LikeData[] = likedPostsJson ? JSON.parse(likedPostsJson) : [];
      
      const existingLikeIndex = likedPosts.findIndex(
        (like) => like.postId === postId && like.userId === userId
      );
      
      if (existingLikeIndex !== -1) {
        // Remove like
        likedPosts.splice(existingLikeIndex, 1);
        await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.LIKED_POSTS, JSON.stringify(likedPosts));
        return false;
      } else {
        // Add like
        const newLike: LikeData = { postId, userId, timestamp: Date.now() };
        likedPosts.push(newLike);
        await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.LIKED_POSTS, JSON.stringify(likedPosts));
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return null;
    }
  },

  // Save/unsave posts
  toggleSave: async (postId: string, userId: string): Promise<boolean | null> => {
    try {
      const savedPostsJson = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.SAVED_POSTS);
      const savedPosts: SaveData[] = savedPostsJson ? JSON.parse(savedPostsJson) : [];
      
      const existingSaveIndex = savedPosts.findIndex(
        (save) => save.postId === postId && save.userId === userId
      );
      
      if (existingSaveIndex !== -1) {
        // Remove save
        savedPosts.splice(existingSaveIndex, 1);
        await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.SAVED_POSTS, JSON.stringify(savedPosts));
        return false;
      } else {
        // Add save
        const newSave: SaveData = { postId, userId, timestamp: Date.now() };
        savedPosts.push(newSave);
        await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.SAVED_POSTS, JSON.stringify(savedPosts));
        return true;
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      return null;
    }
  },

  // Add comment
  addComment: async (comment: Comment): Promise<boolean> => {
    try {
      const commentsJson = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.COMMENTS);
      const comments: Comment[] = commentsJson ? JSON.parse(commentsJson) : [];
      comments.push(comment);
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  },

  // Get likes for a post
  getPostLikes: async (postId: string): Promise<LikeData[]> => {
    try {
      const likedPostsJson = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.LIKED_POSTS);
      const likedPosts: LikeData[] = likedPostsJson ? JSON.parse(likedPostsJson) : [];
      return likedPosts.filter(like => like.postId === postId);
    } catch (error) {
      console.error('Error getting post likes:', error);
      return [];
    }
  },

  // Get comments for a post
  getPostComments: async (postId: string): Promise<Comment[]> => {
    try {
      const commentsJson = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.COMMENTS);
      const comments: Comment[] = commentsJson ? JSON.parse(commentsJson) : [];
      return comments.filter(comment => comment.postId === postId);
    } catch (error) {
      console.error('Error getting post comments:', error);
      return [];
    }
  },

  // Check if user liked a post
  isPostLiked: async (postId: string, userId: string): Promise<boolean> => {
    try {
      const likedPostsJson = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.LIKED_POSTS);
      const likedPosts: LikeData[] = likedPostsJson ? JSON.parse(likedPostsJson) : [];
      return likedPosts.some(like => like.postId === postId && like.userId === userId);
    } catch (error) {
      console.error('Error checking if post is liked:', error);
      return false;
    }
  },

  // Check if user saved a post
  isPostSaved: async (postId: string, userId: string): Promise<boolean> => {
    try {
      const savedPostsJson = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.SAVED_POSTS);
      const savedPosts: SaveData[] = savedPostsJson ? JSON.parse(savedPostsJson) : [];
      return savedPosts.some(save => save.postId === postId && save.userId === userId);
    } catch (error) {
      console.error('Error checking if post is saved:', error);
      return false;
    }
  },

  // Create notification for social interactions
  createSocialNotification: async (
    type: 'social_like' | 'social_comment',
    postId: string,
    fromUser: { id: string; username: string; displayName: string },
    postTitle: string,
    commentText?: string
  ): Promise<void> => {
    try {
      // Don't create notifications for your own posts
      const currentUserId = 'user_1'; // This would come from auth context in real app
      if (fromUser.id === currentUserId) {
        return;
      }

      const notification: SocialNotification = {
        id: `social_${type}_${Date.now()}`,
        type,
        title: type === 'social_like' ? 'New Like!' : 'New Comment!',
        description: type === 'social_like' 
          ? `@${fromUser.username} liked your ${postTitle} post ❤️`
          : `@${fromUser.username} commented: "${commentText?.substring(0, 50)}${commentText && commentText.length > 50 ? '...' : ''}"`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionType: 'navigate_to_profile',
        icon: type === 'social_like' ? 'heart' : 'chatbubble',
        iconColor: type === 'social_like' ? '#ef4444' : '#3b82f6',
        postId,
        fromUser
      };

      // Get existing notifications
      const notificationsJson = await AsyncStorage.getItem('notifications');
      const notifications = notificationsJson ? JSON.parse(notificationsJson) : [];
      
      // Add new notification to the beginning
      notifications.unshift(notification);
      
      // Keep only the last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50);
      }
      
      // Save updated notifications
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      
      console.log(`Created ${type} notification:`, notification);
    } catch (error) {
      console.error('Error creating social notification:', error);
    }
  },
};
