import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import type { FoodPost } from '../../data/mockSocialData';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 60) / 3; // Account for padding and gaps

interface FoodGridItemProps {
  post: FoodPost;
  onPress: (post: FoodPost) => void;
}

export const FoodGridItem: React.FC<FoodGridItemProps> = ({ post, onPress }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8.0) return '#10b981'; // Green
    if (rating >= 6.0) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(post)}
      activeOpacity={0.8}
    >
      {/* Food Image Placeholder */}
      <View style={styles.imageContainer}>
        {post.image ? (
          // TODO: Add actual image when available
          <View style={styles.mockImage}>
            <Ionicons name="restaurant" size={24} color={theme.colors.light.textSecondary} />
          </View>
        ) : (
          <View style={styles.mockImage}>
            <Ionicons name="restaurant" size={24} color={theme.colors.light.textSecondary} />
          </View>
        )}
        
        {/* Rating Overlay */}
        <View style={styles.ratingOverlay}>
          <Text style={styles.ratingText}>{post.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    marginBottom: 2,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mockImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.light.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.borderLight,
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
  },
});
