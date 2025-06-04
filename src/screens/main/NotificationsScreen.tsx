import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type NotificationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Notifications'>;

interface Notification {
    id: string;
    type: 'goal_progress' | 'achievement' | 'tip' | 'summary' | 
          'social_like' | 'social_comment' | 'social_follow' | 'social_mention';
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    actionType?: 'navigate_to_progress' | 'navigate_to_goals' | 'navigate_to_profile' | 
                  'navigate_to_feed' | 'navigate_to_post' | 'navigate_to_user_profile';
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    // Social-specific data
    postId?: string;
    postName?: string; // Food name for context
    fromUser?: {
        id: string;
        username: string;
        displayName: string;
    };
    commentText?: string; // For comment notifications
    likeCount?: number; // For multiple likes notifications
}

const STORAGE_KEY = 'notifications';

// Sample notifications data with comprehensive social media integration
const sampleNotifications: Notification[] = [
    // === TODAY (Recent social activity) ===
    {
        id: 'social_1',
        type: 'social_like',
        title: 'New Like!',
        description: '@sarah_healthy liked your Quinoa Salad Bowl post ❤️',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        isRead: false,
        actionType: 'navigate_to_post',
        icon: 'heart',
        iconColor: '#ef4444',
        postId: 'post_fy1',
        postName: 'Quinoa Salad Bowl',
        fromUser: {
            id: 'user_2',
            username: 'sarah_healthy',
            displayName: 'Sarah Johnson'
        }
    },
    {
        id: 'social_2',
        type: 'social_comment',
        title: 'New Comment!',
        description: '@mike_fitness: "Love the protein content! Perfect post-workout meal 💪"',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        isRead: false,
        actionType: 'navigate_to_post',
        icon: 'chatbubble',
        iconColor: '#3b82f6',
        postId: 'post_fy1',
        postName: 'Quinoa Salad Bowl',
        fromUser: {
            id: 'user_3',
            username: 'mike_fitness',
            displayName: 'Mike Chen'
        },
        commentText: 'Love the protein content! Perfect post-workout meal 💪'
    },
    {
        id: 'social_3',
        type: 'social_follow',
        title: 'New Follower!',
        description: '@healthy_guru started following you! 👋',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        isRead: false,
        actionType: 'navigate_to_user_profile',
        icon: 'person-add',
        iconColor: '#10b981',
        fromUser: {
            id: 'user_4',
            username: 'healthy_guru',
            displayName: 'Alex Rodriguez'
        }
    },
    {
        id: 'social_4',
        type: 'social_like',
        title: 'Multiple Likes!',
        description: '@emma_eats and 3 others liked your Avocado Toast post ❤️',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        isRead: false,
        actionType: 'navigate_to_post',
        icon: 'heart',
        iconColor: '#ef4444',
        postId: 'post_fy3',
        postName: 'Avocado Toast',
        fromUser: {
            id: 'user_5',
            username: 'emma_eats',
            displayName: 'Emma Wilson'
        },
        likeCount: 4
    },
    {
        id: '1',
        type: 'goal_progress',
        title: 'Almost There!',
        description: "You're 2/5 healthy meals away from this week's goal! Almost there! 🎯",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
        actionType: 'navigate_to_goals',
        icon: 'flag-outline',
        iconColor: '#3b82f6',
    },
    {
        id: 'social_5',
        type: 'social_comment',
        title: 'New Comment!',
        description: '@nutrition_ninja: "Recipe please? This looks incredible! 🤤"',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        isRead: false,
        actionType: 'navigate_to_post',
        icon: 'chatbubble',
        iconColor: '#3b82f6',
        postId: 'post_fy2',
        postName: 'Greek Yogurt Bowl',
        fromUser: {
            id: 'user_6',
            username: 'nutrition_ninja',
            displayName: 'David Kim'
        },
        commentText: 'Recipe please? This looks incredible! 🤤'
    },

    // === THIS WEEK ===
    {
        id: '2',
        type: 'achievement',
        title: 'Goal Smashed!',
        description: 'You hit 5/5 healthy meals this week! 🎉',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        isRead: false,
        actionType: 'navigate_to_progress',
        icon: 'trophy-outline',
        iconColor: '#f59e0b',
    },
    {
        id: 'social_6',
        type: 'social_like',
        title: 'Post Trending!',
        description: 'Your Salmon & Veggies post has 12 likes! 🔥',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        isRead: true,
        actionType: 'navigate_to_post',
        icon: 'trending-up',
        iconColor: '#f59e0b',
        postId: 'post_fy5',
        postName: 'Salmon & Vegetables',
        likeCount: 12
    },
    {
        id: 'social_7',
        type: 'social_follow',
        title: 'New Follower!',
        description: '@clean_eating_coach started following you! 👋',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        isRead: true,
        actionType: 'navigate_to_user_profile',
        icon: 'person-add',
        iconColor: '#10b981',
        fromUser: {
            id: 'user_7',
            username: 'clean_eating_coach',
            displayName: 'Lisa Thompson'
        }
    },
    {
        id: 'social_8',
        type: 'social_comment',
        title: 'New Comment!',
        description: '@fit_foodie: "Your posts always inspire my meal prep! 🙌"',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        isRead: true,
        actionType: 'navigate_to_post',
        icon: 'chatbubble',
        iconColor: '#3b82f6',
        postId: 'post_fy4',
        postName: 'Green Smoothie Bowl',
        fromUser: {
            id: 'user_8',
            username: 'fit_foodie',
            displayName: 'Ryan Adams'
        },
        commentText: 'Your posts always inspire my meal prep! 🙌'
    },
    {
        id: '3',
        type: 'tip',
        title: 'Keep Your Streak!',
        description: "Haven't scanned food today - keep your amazing streak going! 📱",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        isRead: true,
        icon: 'bulb-outline',
        iconColor: '#8b5cf6',
    },

    // === EARLIER ===
    {
        id: 'social_9',
        type: 'social_like',
        title: 'Weekly Highlight!',
        description: 'Your Quinoa Buddha Bowl was liked by 8 people this week! ⭐',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        isRead: true,
        actionType: 'navigate_to_post',
        icon: 'star',
        iconColor: '#f59e0b',
        postId: 'post_fy6',
        postName: 'Quinoa Buddha Bowl',
        likeCount: 8
    },
    {
        id: 'social_10',
        type: 'social_follow',
        title: 'Growing Community!',
        description: 'You gained 3 new followers this week! 🎉',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        isRead: true,
        actionType: 'navigate_to_profile',
        icon: 'people',
        iconColor: '#10b981',
        likeCount: 3
    },
    {
        id: '4',
        type: 'goal_progress',
        title: 'Streak Alert!',
        description: "4 days of consistent tracking - you're on fire! 🔥",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        isRead: true,
        actionType: 'navigate_to_progress',
        icon: 'flag-outline',
        iconColor: '#3b82f6',
    },
    {
        id: '5',
        type: 'achievement',
        title: 'New Personal Best!',
        description: '8.9 average health rating! You\'re crushing it! 🏆',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        isRead: true,
        actionType: 'navigate_to_progress',
        icon: 'trophy-outline',
        iconColor: '#f59e0b',
    },
    {
        id: '6',
        type: 'summary',
        title: 'Weekly Wrap-up',
        description: 'You analyzed 12 foods with an average rating of 7.4! 📊',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        isRead: true,
        actionType: 'navigate_to_progress',
        icon: 'bar-chart-outline',
        iconColor: '#10b981',
    },
];

export const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NotificationsScreenNavigationProp>();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setNotifications(JSON.parse(stored));
            } else {
                // First time - populate with sample data
                setNotifications(sampleNotifications);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotifications));
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            // Fallback to sample data
            setNotifications(sampleNotifications);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const updatedNotifications = notifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            );
            setNotifications(updatedNotifications);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const clearAllNotifications = () => {
        Alert.alert(
            'Clear All Notifications',
            'Are you sure you want to clear all notifications? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setNotifications([]);
                            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
                        } catch (error) {
                            console.error('Error clearing notifications:', error);
                        }
                    },
                },
            ]
        );
    };

    const resetNotifications = async () => {
        try {
            setNotifications(sampleNotifications);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotifications));
        } catch (error) {
            console.error('Error resetting notifications:', error);
        }
    };

    // Enhanced navigation handling for social interactions
    const handleNotificationPress = (notification: Notification) => {
        // Mark as read
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Navigate based on action type
        switch (notification.actionType) {
            case 'navigate_to_progress':
                navigation.navigate('MainTabs', { screen: 'Progress' });
                break;
                
            case 'navigate_to_goals':
                navigation.navigate('HealthGoals');
                break;
                
            case 'navigate_to_profile':
                navigation.navigate('MainTabs', { screen: 'Profile' });
                break;
                
            case 'navigate_to_feed':
                navigation.navigate('MainTabs', { 
                    screen: 'Feed'
                });
                break;
                
            case 'navigate_to_post':
                // Navigate to feed and potentially open specific post
                navigation.navigate('MainTabs', { 
                    screen: 'Feed'
                });
                break;
                
            case 'navigate_to_user_profile':
                // Navigate to specific user's profile - for now just go to main profile
                navigation.navigate('MainTabs', { screen: 'Profile' });
                break;
                
            default:
                // Default behavior for notifications without specific actions
                console.log('Notification tapped:', notification.title);
        }
    };

    // Social-specific helper functions
    const getSocialIcon = (notification: Notification) => {
        switch (notification.type) {
            case 'social_like':
                return notification.likeCount && notification.likeCount > 1 
                    ? 'heart-circle' // Multiple likes
                    : 'heart'; // Single like
            case 'social_comment':
                return 'chatbubble';
            case 'social_follow':
                return 'person-add';
            case 'social_mention':
                return 'at';
            default:
                return notification.icon;
        }
    };

    const getSocialContext = (notification: Notification) => {
        if (notification.postName) {
            return (
                <Text style={styles.postContext}>
                    on "{notification.postName}"
                </Text>
            );
        }
        return null;
    };

    const getRelativeTime = (timestamp: string) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
    };

    const groupNotificationsByTime = (notifications: Notification[]) => {
        const now = new Date();
        const today: Notification[] = [];
        const thisWeek: Notification[] = [];
        const earlier: Notification[] = [];

        notifications.forEach(notification => {
            const notificationTime = new Date(notification.timestamp);
            const diffInHours = (now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                today.push(notification);
            } else if (diffInHours < 168) { // 7 days
                thisWeek.push(notification);
            } else {
                earlier.push(notification);
            }
        });

        return { today, thisWeek, earlier };
    };

    const renderNotification = (notification: Notification, isLast: boolean) => (
        <TouchableOpacity
            key={notification.id}
            style={[
                styles.notificationItem,
                notification.isRead && styles.notificationItemRead,
            ]}
            onPress={() => handleNotificationPress(notification)}
            activeOpacity={0.7}
        >
            <View style={styles.timelineContainer}>
                <View style={[
                    styles.iconCircle, 
                    { backgroundColor: notification.iconColor },
                    !notification.isRead && styles.iconCircleUnread
                ]}>
                    <Ionicons
                        name={getSocialIcon(notification)}
                        size={16}
                        color="white"
                    />
                </View>
                {!isLast && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.notificationContent}>
                <View style={styles.notificationCard}>
                    <View style={styles.notificationHeader}>
                        <View style={styles.titleContainer}>
                            <Text style={[
                                styles.notificationTitle,
                                notification.isRead && styles.notificationTitleRead
                            ]}>
                                {notification.title}
                            </Text>
                            {getSocialContext(notification)}
                        </View>
                        <Text style={styles.notificationTime}>
                            {getRelativeTime(notification.timestamp)}
                        </Text>
                    </View>
                    <Text style={[
                        styles.notificationDescription,
                        notification.isRead && styles.notificationDescriptionRead
                    ]}>
                        {notification.description}
                    </Text>
                    
                    {/* Social-specific additional info */}
                    {notification.fromUser && (
                        <View style={styles.socialInfo}>
                            <Text style={styles.socialUsername}>
                                @{notification.fromUser.username}
                            </Text>
                            {notification.likeCount && notification.likeCount > 1 && (
                                <Text style={styles.socialCount}>
                                    +{notification.likeCount - 1} others
                                </Text>
                            )}
                        </View>
                    )}
                    
                    {!notification.isRead && <View style={styles.unreadDot} />}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSection = (title: string, notifications: Notification[]) => {
        if (notifications.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {notifications.map((notification, index) =>
                    renderNotification(notification, index === notifications.length - 1)
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading notifications...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { today, thisWeek, earlier } = groupNotificationsByTime(notifications);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color={theme.colors.light.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearAllNotifications}
                    disabled={notifications.length === 0}
                >
                    <Text style={[
                        styles.clearButtonText,
                        notifications.length === 0 && styles.clearButtonTextDisabled
                    ]}>
                        Clear All
                    </Text>
                </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons
                        name="notifications-outline"
                        size={64}
                        color={theme.colors.light.textMuted}
                        style={styles.emptyIcon}
                    />
                    <Text style={styles.emptyTitle}>You're all caught up!</Text>
                    <Text style={styles.emptyDescription}>
                        Keep tracking to see updates on your progress! 🎉
                    </Text>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetNotifications}
                    >
                        <Text style={styles.resetButtonText}>Reset Notifications (For Testing)</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {renderSection('Today', today)}
                    {renderSection('This Week', thisWeek)}
                    {renderSection('Earlier', earlier)}
                    <View style={styles.bottomPadding} />
                </ScrollView>
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
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textSecondary,
    },
    clearButtonTextDisabled: {
        color: theme.colors.light.textMuted,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 16,
        marginLeft: 40, // Align with notification content
    },
    notificationItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    notificationItemRead: {
        opacity: 0.7,
    },
    timelineContainer: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: theme.colors.light.borderLight,
        marginTop: 8,
        minHeight: 40,
    },
    notificationContent: {
        flex: 1,
    },
    notificationCard: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
        position: 'relative',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    notificationTitleRead: {
        color: theme.colors.light.textSecondary,
    },
    notificationTime: {
        fontSize: 12,
        color: theme.colors.light.textMuted,
        fontWeight: theme.typography.weights.medium,
    },
    notificationDescription: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        lineHeight: 20,
    },
    notificationDescriptionRead: {
        color: theme.colors.light.textMuted,
    },
    unreadDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        marginBottom: 16,
        opacity: 0.6,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    resetButton: {
        backgroundColor: theme.colors.light.accentDark,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    resetButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: theme.typography.weights.medium,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: theme.colors.light.textSecondary,
    },
    bottomPadding: {
        height: 40,
    },
    // Enhanced social notification styles
    iconCircleUnread: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    titleContainer: {
        flex: 1,
        marginRight: 8,
    },
    postContext: {
        fontSize: 12,
        color: theme.colors.light.textMuted,
        fontStyle: 'italic',
        marginTop: 2,
    },
    socialInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: theme.colors.light.borderLight,
    },
    socialUsername: {
        fontSize: 12,
        color: theme.colors.light.accentDark,
        fontWeight: theme.typography.weights.medium,
    },
    socialCount: {
        fontSize: 11,
        color: theme.colors.light.textMuted,
        fontStyle: 'italic',
    },
});
