export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  profilePhoto?: string | null;
  isPrivate: boolean;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  isFollowing?: boolean;
  isOwnProfile: boolean;
}

export interface FoodPost {
  id: string;
  userId: string;
  foodName: string;
  category: string;
  calories: number;
  image?: string | null;
  rating: number;
  caption?: string;
  isPublic: boolean;
  createdAt: string;
  foodData: any; // Complete food analysis data
}

export const mockUserProfile: UserProfile = {
  id: 'user_1',
  username: 'healthyeater',
  displayName: 'Sarah Johnson',
  bio: 'Food lover 🥗 Sharing my healthy journey ✨\nNutrition enthusiast & home cook',
  profilePhoto: null,
  isPrivate: false,
  stats: {
    postsCount: 23,
    followersCount: 156,
    followingCount: 89,
  },
  isOwnProfile: true,
};

export const mockFoodPosts: FoodPost[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    foodName: 'Quinoa Salad Bowl',
    category: 'Healthy Bowl',
    calories: 320,
    image: null,
    rating: 8.5,
    caption: 'Perfect post-workout meal! 💪',
    isPublic: true,
    createdAt: '2024-01-15T10:30:00Z',
    foodData: {
      name: 'Quinoa Salad Bowl',
      category: 'Healthy Bowl',
      rating: 8.5,
      calories: 320,
    }
  },
  {
    id: 'post_2',
    userId: 'user_1',
    foodName: 'Greek Yogurt Parfait',
    category: 'Breakfast',
    calories: 180,
    image: null,
    rating: 9.1,
    caption: 'Starting the day right! 🌅',
    isPublic: true,
    createdAt: '2024-01-14T08:15:00Z',
    foodData: {
      name: 'Greek Yogurt Parfait',
      category: 'Breakfast',
      rating: 9.1,
      calories: 180,
    }
  },
  {
    id: 'post_3',
    userId: 'user_1',
    foodName: 'Avocado Toast',
    category: 'Breakfast',
    calories: 250,
    image: null,
    rating: 7.8,
    caption: 'Classic and delicious 🥑',
    isPublic: true,
    createdAt: '2024-01-13T09:00:00Z',
    foodData: {
      name: 'Avocado Toast',
      category: 'Breakfast',
      rating: 7.8,
      calories: 250,
    }
  },
  {
    id: 'post_4',
    userId: 'user_1',
    foodName: 'Salmon & Vegetables',
    category: 'Dinner',
    calories: 420,
    image: null,
    rating: 9.2,
    caption: 'Omega-3 rich dinner 🐟',
    isPublic: true,
    createdAt: '2024-01-12T19:30:00Z',
    foodData: {
      name: 'Salmon & Vegetables',
      category: 'Dinner',
      rating: 9.2,
      calories: 420,
    }
  },
  {
    id: 'post_5',
    userId: 'user_1',
    foodName: 'Green Smoothie',
    category: 'Smoothie',
    calories: 160,
    image: null,
    rating: 8.7,
    caption: 'Green goodness! 🥬',
    isPublic: true,
    createdAt: '2024-01-11T07:45:00Z',
    foodData: {
      name: 'Green Smoothie',
      category: 'Smoothie',
      rating: 8.7,
      calories: 160,
    }
  },
  {
    id: 'post_6',
    userId: 'user_1',
    foodName: 'Chicken Stir Fry',
    category: 'Dinner',
    calories: 380,
    image: null,
    rating: 8.3,
    caption: 'Quick and healthy dinner 🍗',
    isPublic: true,
    createdAt: '2024-01-10T18:20:00Z',
    foodData: {
      name: 'Chicken Stir Fry',
      category: 'Dinner',
      rating: 8.3,
      calories: 380,
    }
  },
];

export const mockOtherUserProfile: UserProfile = {
  id: 'user_2',
  username: 'fitnessfoodie',
  displayName: 'Mike Chen',
  bio: 'Fitness enthusiast 💪 Meal prep master\nSharing healthy recipes daily',
  profilePhoto: null,
  isPrivate: false,
  stats: {
    postsCount: 45,
    followersCount: 892,
    followingCount: 234,
  },
  isFollowing: false,
  isOwnProfile: false,
};

// Social Post Interface
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
    criteria?: any[];
    recommendations?: string[];
  };
  image?: string;
  caption?: string;
  createdAt: string;
  timestamp: number;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

// Mock Following Posts (from users the current user follows)
export const mockFollowingPosts: SocialPost[] = [
  {
    id: 'post_f1',
    user: {
      id: 'user_2',
      username: 'fitnessfoodie',
      displayName: 'Mike Chen',
    },
    foodData: {
      name: 'Protein Power Bowl',
      category: 'Healthy Bowl',
      rating: 9.2,
      calories: 450,
    },
    caption: 'Perfect post-workout fuel! 💪 Quinoa, grilled chicken, and fresh veggies.',
    createdAt: '1 hour ago',
    timestamp: Date.now() - 3600000,
    likesCount: 24,
    commentsCount: 8,
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'post_f2',
    user: {
      id: 'user_3',
      username: 'healthyguru',
      displayName: 'Sarah Wilson',
    },
    foodData: {
      name: 'Green Goddess Smoothie',
      category: 'Smoothie',
      rating: 8.7,
      calories: 180,
    },
    caption: 'Starting my morning right with this nutrient-packed smoothie! 🥬✨',
    createdAt: '3 hours ago',
    timestamp: Date.now() - 10800000,
    likesCount: 18,
    commentsCount: 5,
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'post_f3',
    user: {
      id: 'user_4',
      username: 'mealprep_master',
      displayName: 'Alex Rodriguez',
    },
    foodData: {
      name: 'Mediterranean Salmon',
      category: 'Dinner',
      rating: 9.0,
      calories: 380,
    },
    caption: 'Omega-3 rich dinner with roasted vegetables. Meal prep Sunday success! 🐟',
    createdAt: '5 hours ago',
    timestamp: Date.now() - 18000000,
    likesCount: 31,
    commentsCount: 12,
    isLiked: false,
    isSaved: true,
  },
];

// Mock For You Posts (popular posts from all users)
export const mockForYouPosts: SocialPost[] = [
  {
    id: 'post_fy1',
    user: {
      id: 'user_5',
      username: 'plantbased_chef',
      displayName: 'Emma Thompson',
    },
    foodData: {
      name: 'Rainbow Buddha Bowl',
      category: 'Vegan Bowl',
      rating: 9.5,
      calories: 320,
    },
    caption: 'Eating the rainbow has never been more delicious! 🌈 This colorful bowl is packed with nutrients and flavor.',
    createdAt: '2 hours ago',
    timestamp: Date.now() - 7200000,
    likesCount: 89,
    commentsCount: 23,
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'post_fy2',
    user: {
      id: 'user_6',
      username: 'keto_king',
      displayName: 'David Park',
    },
    foodData: {
      name: 'Avocado Egg Boats',
      category: 'Keto Breakfast',
      rating: 8.8,
      calories: 280,
    },
    caption: 'Simple, satisfying, and perfectly keto! These avocado boats are my go-to breakfast. 🥑',
    createdAt: '4 hours ago',
    timestamp: Date.now() - 14400000,
    likesCount: 56,
    commentsCount: 15,
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'post_fy3',
    user: {
      id: 'user_7',
      username: 'dessert_detective',
      displayName: 'Lisa Chang',
    },
    foodData: {
      name: 'Chocolate Protein Muffin',
      category: 'Healthy Dessert',
      rating: 7.2,
      calories: 220,
    },
    caption: 'Who says healthy can\'t be indulgent? These protein muffins satisfy my sweet tooth guilt-free! 🧁',
    createdAt: '6 hours ago',
    timestamp: Date.now() - 21600000,
    likesCount: 42,
    commentsCount: 9,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_fy4',
    user: {
      id: 'user_2',
      username: 'fitnessfoodie',
      displayName: 'Mike Chen',
    },
    foodData: {
      name: 'Grilled Chicken Salad',
      category: 'Lunch',
      rating: 8.5,
      calories: 350,
    },
    caption: 'Clean eating doesn\'t have to be boring! This salad is packed with flavor and protein. 🥗',
    createdAt: '8 hours ago',
    timestamp: Date.now() - 28800000,
    likesCount: 67,
    commentsCount: 18,
    isLiked: true,
    isSaved: true,
  },
  {
    id: 'post_fy5',
    user: {
      id: 'user_8',
      username: 'smoothie_queen',
      displayName: 'Rachel Green',
    },
    foodData: {
      name: 'Tropical Paradise Smoothie',
      category: 'Smoothie',
      rating: 8.0,
      calories: 195,
    },
    caption: 'Transport yourself to the tropics with this mango-pineapple blend! 🏝️ Perfect for summer vibes.',
    createdAt: '10 hours ago',
    timestamp: Date.now() - 36000000,
    likesCount: 38,
    commentsCount: 7,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_fy6',
    user: {
      id: 'user_9',
      username: 'macro_tracker',
      displayName: 'James Wilson',
    },
    foodData: {
      name: 'Balanced Bento Box',
      category: 'Meal Prep',
      rating: 8.9,
      calories: 420,
    },
    caption: 'Perfectly balanced macros in a beautiful bento box! Meal prep game strong. 📦',
    createdAt: '12 hours ago',
    timestamp: Date.now() - 43200000,
    likesCount: 73,
    commentsCount: 21,
    isLiked: false,
    isSaved: true,
  },
];

// AsyncStorage keys for social features
export const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  FOOD_POSTS: 'foodPosts',
  FOLLOWING_USERS: 'followingUsers',
  PROFILE_SETTINGS: 'profileSettings',
} as const;
