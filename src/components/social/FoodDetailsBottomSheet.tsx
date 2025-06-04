import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { socialStorageService } from '../../services/socialStorage';
import type { SocialPost } from './PostCard';
import type { UserProfile } from '../../data/mockSocialData';

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

interface FoodDetailsBottomSheetProps {
  post: SocialPost;
  isVisible: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 'comment_1',
    postId: 'post_fy1',
    user: {
      id: 'user_2',
      username: 'sarah_healthy',
      displayName: 'Sarah Johnson',
    },
    text: 'This looks absolutely delicious! Could you share the recipe? 😍',
    createdAt: '2 minutes ago',
    timestamp: Date.now() - 120000,
  },
  {
    id: 'comment_2',
    postId: 'post_fy1',
    user: {
      id: 'user_3',
      username: 'mike_fitness',
      displayName: 'Mike Chen',
    },
    text: 'Love the protein content! Perfect post-workout meal 💪',
    createdAt: '5 minutes ago',
    timestamp: Date.now() - 300000,
  },
  {
    id: 'comment_3',
    postId: 'post_fy2',
    user: {
      id: 'user_4',
      username: 'healthy_guru',
      displayName: 'Alex Rodriguez',
    },
    text: 'Keto goals! This is exactly what I needed for breakfast inspiration 🥑',
    createdAt: '1 hour ago',
    timestamp: Date.now() - 3600000,
  },
];

export const FoodDetailsBottomSheet = ({
  post,
  isVisible,
  onClose,
  currentUser,
  onLike,
  onSave,
  onComment,
}: FoodDetailsBottomSheetProps) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  useEffect(() => {
    if (isVisible && !commentsLoaded) {
      loadComments(post.id);
      setCommentsLoaded(true);
    }
  }, [isVisible, post.id, commentsLoaded]);

  const loadComments = async (postId: string) => {
    try {
      // Load comments from AsyncStorage or use mock data
      const commentsJson = await AsyncStorage.getItem('comments');
      let allComments = mockComments;
      
      if (commentsJson) {
        const storedComments = JSON.parse(commentsJson);
        allComments = [...mockComments, ...storedComments];
      }
      
      const postComments = allComments
        .filter(c => c.postId === postId)
        .sort((a, b) => b.timestamp - a.timestamp);
      
      setComments(postComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments(mockComments.filter(c => c.postId === postId));
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId: post.id,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
      },
      text: commentText.trim(),
      createdAt: 'Just now',
      timestamp: Date.now(),
    };

    // Optimistic update
    setComments(prev => [newComment, ...prev]);
    setCommentText('');

    // Save to AsyncStorage
    try {
      const commentsJson = await AsyncStorage.getItem('comments');
      const existingComments = commentsJson ? JSON.parse(commentsJson) : [];
      existingComments.push(newComment);
      await AsyncStorage.setItem('comments', JSON.stringify(existingComments));
    } catch (error) {
      console.error('Error saving comment:', error);
    }

    // Create notification for comment (only if it's not the user's own post)
    try {
      await socialStorageService.createSocialNotification(
        'social_comment',
        post.id,
        {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName
        },
        post.foodData.name,
        commentText.trim()
      );
    } catch (error) {
      console.error('Error creating comment notification:', error);
    }

    // Update post comment count
    onComment(post.id, commentText);

    console.log('New comment posted:', newComment);
  };

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

  // Mock detailed analysis data (would come from post.foodData in real app)
  const mockAnalysis = {
    summary: "This is a nutritious choice with excellent nutrient density and minimal processing. The combination of quinoa, fresh vegetables, and healthy fats provides a well-balanced meal that supports your health goals.",
    criteria: [
      { name: 'Nutrient Density', score: 9.2, description: 'Rich in vitamins, minerals, and antioxidants' },
      { name: 'Processing Level', score: 8.8, description: 'Minimally processed whole foods' },
      { name: 'Sugar Content', score: 9.0, description: 'Low in added sugars' },
      { name: 'Healthy Fats', score: 7.5, description: 'Good source of omega-3 fatty acids' },
      { name: 'Glycemic Impact', score: 8.2, description: 'Low glycemic index for stable blood sugar' },
      { name: 'Anti-inflammatory', score: 8.8, description: 'Contains anti-inflammatory compounds' },
    ],
    recommendations: [
      'Add nuts or seeds for extra protein and healthy fats',
      'Perfect portion size for a balanced meal',
      'Great choice for post-workout recovery',
      'Consider adding avocado for more healthy fats',
    ],
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.bottomSheet}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          enabled={true}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />
          
          {/* Header with Close */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Food Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.light.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
          {/* Food Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.foodImageContainer}>
              <View style={styles.mockFoodImage}>
                <Ionicons name="restaurant" size={48} color={theme.colors.light.textSecondary} />
                <Text style={styles.mockImageText}>{post.foodData.name}</Text>
              </View>
              <View style={styles.ratingOverlay}>
                <Ionicons name="star" size={16} color={getRatingColor(post.foodData.rating)} />
                <Text style={[styles.ratingText, { color: getRatingColor(post.foodData.rating) }]}>
                  {post.foodData.rating.toString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{post.foodData.name}</Text>
              <Text style={styles.foodMeta}>
                {post.foodData.category} • {post.foodData.calories.toString()} cal
              </Text>
              {post.caption && (
                <Text style={styles.caption}>{post.caption}</Text>
              )}
            </View>
          </View>

          {/* Social Actions Row */}
          <View style={styles.socialActions}>
            <TouchableOpacity 
              style={styles.socialAction}
              onPress={() => onLike(post.id)}
            >
              <Ionicons 
                name={post.isLiked ? "heart" : "heart-outline"} 
                size={24} 
                color={post.isLiked ? "#ef4444" : theme.colors.light.textSecondary} 
              />
              <Text style={styles.socialActionText}>{post.likesCount.toString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialAction}>
              <Ionicons name="chatbubble-outline" size={22} color={theme.colors.light.textSecondary} />
              <Text style={styles.socialActionText}>{comments.length.toString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialAction}
              onPress={() => onSave(post.id)}
            >
              <Ionicons 
                name={post.isSaved ? "bookmark" : "bookmark-outline"} 
                size={22} 
                color={post.isSaved ? theme.colors.light.accentDark : theme.colors.light.textSecondary} 
              />
              <Text style={styles.socialActionText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Health Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.summaryTitle}>Health Summary</Text>
            </View>
            <Text style={styles.summaryText}>{mockAnalysis.summary}</Text>
          </View>

          {/* Detailed Analysis */}
          <View style={styles.criteriaSection}>
            <Text style={styles.sectionTitle}>Detailed Analysis</Text>
            {mockAnalysis.criteria.map((criterion, index) => (
              <View key={index} style={styles.criterionItem}>
                <View style={styles.criterionHeader}>
                  <Text style={styles.criterionName}>{criterion.name}</Text>
                  <Text style={[styles.criterionScore, { color: getRatingColor(criterion.score) }]}>
                    {criterion.score}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${criterion.score * 10}%`,
                        backgroundColor: getRatingColor(criterion.score)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.criterionDescription}>{criterion.description}</Text>
              </View>
            ))}
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {mockAnalysis.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Ionicons name="bulb" size={16} color="#f59e0b" />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
            
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentAvatar}>
                  <Ionicons name="person" size={16} color={theme.colors.light.textSecondary} />
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentUsername}>@{comment.user.username}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTime}>{comment.createdAt}</Text>
                </View>
              </View>
            ))}

            {comments.length === 0 && (
              <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
            )}
          </View>
          </ScrollView>

          {/* Comment Input - Fixed at bottom */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor={theme.colors.light.textMuted}
              multiline
              maxLength={280}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                commentText.trim() && styles.sendButtonActive
              ]}
              onPress={handleSendComment}
              disabled={!commentText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={commentText.trim() ? theme.colors.light.accentDark : theme.colors.light.textMuted} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.light.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
    backgroundColor: theme.colors.light.bgSecondary,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetContent: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    backgroundColor: theme.colors.light.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
  },
  foodImageContainer: {
    width: '100%',
    aspectRatio: 16/10,
    borderRadius: 12,
    backgroundColor: theme.colors.light.bgTertiary,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  mockFoodImage: {
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
  ratingOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.bold,
    color: 'white',
  },
  foodInfo: {
    gap: 4,
  },
  foodName: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.light.textPrimary,
  },
  foodMeta: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.light.textPrimary,
    lineHeight: 20,
    marginTop: 8,
  },
  socialActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.light.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.borderLight,
    gap: 24,
  },
  socialAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialActionText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.light.textSecondary,
  },
  summaryCard: {
    backgroundColor: theme.colors.light.bgSecondary,
    margin: 20,
    padding: 20,
    borderRadius: 16,
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
  criteriaSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 16,
  },
  criterionItem: {
    backgroundColor: theme.colors.light.bgSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  criterionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  criterionName: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
  },
  criterionScore: {
    fontSize: 16,
    fontWeight: theme.typography.weights.bold,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.light.bgTertiary,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  criterionDescription: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
  },
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: theme.colors.light.bgSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    lineHeight: 20,
  },
  commentsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: theme.colors.light.bgSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.light.textPrimary,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: theme.colors.light.textMuted,
  },
  noComments: {
    fontSize: 14,
    color: theme.colors.light.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.light.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.light.borderLight,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.colors.light.bgPrimary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.light.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: theme.colors.light.bgPrimary,
    borderWidth: 1,
    borderColor: theme.colors.light.accentDark,
  },
});
