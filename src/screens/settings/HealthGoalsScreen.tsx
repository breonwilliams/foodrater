import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type HealthGoalsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HealthGoals'>;

interface GoalCardProps {
    icon: string;
    title: string;
    description: string;
    currentProgress: string;
    targetProgress: string;
    progressPercentage: number;
}

const GoalCard: React.FC<GoalCardProps> = ({
    icon,
    title,
    description,
    currentProgress,
    targetProgress,
    progressPercentage,
}) => {
    return (
        <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
                <View style={styles.goalIconContainer}>
                    <Text style={styles.goalIcon}>{icon}</Text>
                </View>
                <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>{title}</Text>
                    <Text style={styles.goalDescription}>{description}</Text>
                </View>
            </View>
            
            <View style={styles.progressSection}>
                <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>{currentProgress}</Text>
                    <Text style={styles.targetText}>Target: {targetProgress}</Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <View 
                            style={[
                                styles.progressBarFill, 
                                { width: `${Math.min(progressPercentage, 100)}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressPercentage}>
                        {Math.round(progressPercentage)}%
                    </Text>
                </View>
            </View>
        </View>
    );
};

export const HealthGoalsScreen = () => {
    const navigation = useNavigation<HealthGoalsScreenNavigationProp>();

    const goals = [
        {
            icon: '🥗',
            title: 'Healthy Meals',
            description: 'Eat meals rated 7.0+ per week',
            currentProgress: '4/5 meals',
            targetProgress: '5 meals',
            progressPercentage: 80,
        },
        {
            icon: '📅',
            title: 'Daily Tracking',
            description: 'Track meals consistently',
            currentProgress: '5/7 days',
            targetProgress: '7 days',
            progressPercentage: 71,
        },
        {
            icon: '⭐',
            title: 'Quality Average',
            description: 'Maintain weekly average above target',
            currentProgress: '7.3/7.0',
            targetProgress: '7.0 average',
            progressPercentage: 104,
        },
    ];

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
                <Text style={styles.headerTitle}>Health Goals</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Introduction */}
                <View style={styles.introSection}>
                    <Text style={styles.introTitle}>Track Your Progress</Text>
                    <Text style={styles.introDescription}>
                        Monitor your nutrition goals and build healthy eating habits. 
                        Your progress is updated automatically as you rate your meals.
                    </Text>
                </View>

                {/* Goals */}
                <View style={styles.goalsSection}>
                    <Text style={styles.sectionTitle}>Your Goals</Text>
                    {goals.map((goal, index) => (
                        <GoalCard
                            key={index}
                            icon={goal.icon}
                            title={goal.title}
                            description={goal.description}
                            currentProgress={goal.currentProgress}
                            targetProgress={goal.targetProgress}
                            progressPercentage={goal.progressPercentage}
                        />
                    ))}
                </View>

                {/* Tips Section */}
                <View style={styles.tipsSection}>
                    <Text style={styles.sectionTitle}>Tips for Success</Text>
                    <View style={styles.tipCard}>
                        <View style={styles.tipIconContainer}>
                            <Ionicons name="bulb" size={20} color={theme.colors.light.accentDark} />
                        </View>
                        <View style={styles.tipContent}>
                            <Text style={styles.tipTitle}>Rate consistently</Text>
                            <Text style={styles.tipDescription}>
                                Rate your meals right after eating for the most accurate tracking
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.tipCard}>
                        <View style={styles.tipIconContainer}>
                            <Ionicons name="trending-up" size={20} color={theme.colors.light.accentDark} />
                        </View>
                        <View style={styles.tipContent}>
                            <Text style={styles.tipTitle}>Focus on progress</Text>
                            <Text style={styles.tipDescription}>
                                Small improvements over time lead to lasting healthy habits
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Padding */}
                <View style={styles.bottomPadding} />
            </ScrollView>
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
    headerPlaceholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    introSection: {
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
    },
    introDescription: {
        fontSize: 16,
        color: theme.colors.light.textSecondary,
        lineHeight: 22,
    },
    goalsSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        marginBottom: 16,
    },
    goalCard: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    goalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    goalIcon: {
        fontSize: 24,
    },
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 4,
    },
    goalDescription: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
    },
    progressSection: {
        gap: 12,
    },
    progressTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
    },
    targetText: {
        fontSize: 14,
        color: theme.colors.light.textMuted,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressBarBackground: {
        flex: 1,
        height: 8,
        backgroundColor: theme.colors.light.borderLight,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textSecondary,
        minWidth: 35,
        textAlign: 'right',
    },
    tipsSection: {
        marginBottom: 32,
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    tipIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: theme.colors.light.accentYellow,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 4,
    },
    tipDescription: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        lineHeight: 20,
    },
    bottomPadding: {
        height: 40,
    },
});

export default HealthGoalsScreen;
