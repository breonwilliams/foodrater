import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

export interface SocialPost {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    profilePhoto?: string;
  };
  foodData: {
    name: string;
    category: string;
    rating: number;
    calories: number;
    // Full food analysis data for bottom sheet
    criteria?: any[];
    recommendations?: string[];
  };
  image?: string;
  caption?: string;
  createdAt: string; // "2 hours ago" format
  timestamp: number; // For sorting
  likesCount: number;
  commentsCount: number;
  isLiked: boolean; // Current user's like status
  isSaved: boolean; // Current user's save status
}

interface PostCardProps {
  post: SocialPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onSave: (postId: string) => void;
  onViewDetails: (post: SocialPost) => void;
  onUserPress: (userId: string) => void;
}

export const PostCard = ({ post, onLike, onComment, onSave, onViewDetails, onUserPress }: PostCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return '#10b981'; // Excellent - Green
    if (rating >= 6.0) return '#3b82f6'; // Good - Blue  
    if (rating >= 4.0) return '#f59e0b'; // Average - Yellow
    return '#ef4444'; // Poor - Red
  };

  const handleMenuPress = () => {
    Alert.alert('Post Options', 'Post menu functionality coming soon!');
  };

  return (
    <View style={styles.postCard}>
      {/* User Header */}
      <View style={styles.userHeader}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => onUserPress(post.user.id)}
          activeOpacity={0.7}
        >
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={16} color={theme.colors.light.textSecondary} />
          </View>
          <Text style={styles.username}>@{post.user.username}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.light.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Food Image */}
      <View style={styles.imageContainer}>
        {post.image ? (
          // TODO: Real image implementation
          <View style={styles.mockImage}>
            <Ionicons name="restaurant" size={48} color={theme.colors.light.textSecondary} />
            <Text style={styles.mockImageText}>Food Image</Text>
          </View>
        ) : (
          <View style={styles.mockImage}>
            <Ionicons name="restaurant" size={48} color={theme.colors.light.textSecondary} />
            <Text style={styles.mockImageText}>{post.foodData.name}</Text>
          </View>
        )}
      </View>

      {/* Actions Row */}
      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onLike(post.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={post.isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={post.isLiked ? "#ef4444" : theme.colors.light.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onComment(post.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={22} color={theme.colors.light.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onSave(post.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={post.isSaved ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={post.isSaved ? theme.colors.light.accentDark : theme.colors.light.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={getRatingColor(post.foodData.rating)} />
          <Text style={[styles.ratingText, { color: getRatingColor(post.foodData.rating) }]}>
            {post.foodData.rating}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.foodName}>{post.foodData.name}</Text>
        <Text style={styles.foodMeta}>
          {post.foodData.category} • {post.foodData.calories} cal
        </Text>
        
        {post.caption && (
          <Text style={styles.caption} numberOfLines={3}>
            {post.caption}
          </Text>
        )}
        
        <Text style={styles.timestamp}>{post.createdAt}</Text>
        
        {/* View Details Button */}
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => onViewDetails(post)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewDetailsText}>View Full Analysis</Text>
          <Ionicons name="chevron-up" size={16} color={theme.colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: theme.colors.light.bgSecondary,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.light.borderLight,
    overflow: 'hidden',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  username: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16/10, // Wider than square for better food visibility
    backgroundColor: theme.colors.light.bgTertiary,
  },
  mockImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mockImageText: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  foodName: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
    marginBottom: 4,
  },
  foodMeta: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.light.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
    marginBottom: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: theme.colors.light.borderLight,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 6,
    marginHorizontal: -16,
    marginBottom: -16,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
});
