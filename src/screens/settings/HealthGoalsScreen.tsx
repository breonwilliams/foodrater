import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { theme } from '../../styles/theme';


interface GoalData {
    id: 'healthyMeals' | 'consistency' | 'quality';
    iconName: string;
    title: string;
    subtitle: string;
    description: string;
    howItWorks: string;
    tips: string[];
    currentValue: number;
    targetValue: number;
    unit: string;
    minValue: number;
    maxValue: number;
    step: number;
    formatValue: (value: number) => string;
}

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    goal: GoalData | null;
    onSave: (goalId: string, newTarget: number) => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, goal, onSave }) => {
    const [tempValue, setTempValue] = useState(goal?.targetValue || 0);

    React.useEffect(() => {
        if (goal) {
            setTempValue(goal.targetValue);
        }
    }, [goal]);

    if (!goal) return null;

    const handleSave = () => {
        onSave(goal.id, tempValue);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.bottomSheetContainer}>
                {/* Header */}
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.bottomSheetTitle}>{goal.title}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme.colors.light.textPrimary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <Ionicons 
                                    name="information-circle" 
                                    size={20} 
                                    color={theme.colors.light.accentDark} 
                                />
                                <Text style={styles.infoHeaderText}>Goal Description</Text>
                            </View>
                            <Text style={styles.infoText}>{goal.description}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <Ionicons 
                                    name="cog" 
                                    size={20} 
                                    color={theme.colors.light.accentDark} 
                                />
                                <Text style={styles.infoHeaderText}>How It Works</Text>
                            </View>
                            <Text style={styles.infoText}>{goal.howItWorks}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <Ionicons 
                                    name="bulb" 
                                    size={20} 
                                    color={theme.colors.light.accentDark} 
                                />
                                <Text style={styles.infoHeaderText}>Tips for Success</Text>
                            </View>
                            {goal.tips.map((tip, index) => (
                                <View key={index} style={styles.tipItem}>
                                    <Text style={styles.tipBullet}>•</Text>
                                    <Text style={styles.tipText}>{tip}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Edit Target Section */}
                    <View style={styles.editSection}>
                        <Text style={styles.editSectionTitle}>Edit Target</Text>
                        
                        <View style={styles.currentValueContainer}>
                            <Text style={styles.currentValueLabel}>Current Target:</Text>
                            <Text style={styles.currentValueText}>
                                {goal.formatValue(goal.targetValue)}
                            </Text>
                        </View>

                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>{goal.formatValue(goal.minValue)}</Text>
                                <Text style={styles.sliderLabel}>{goal.formatValue(goal.maxValue)}</Text>
                            </View>
                            
                            <Slider
                                style={styles.slider}
                                minimumValue={goal.minValue}
                                maximumValue={goal.maxValue}
                                step={goal.step}
                                value={tempValue}
                                onValueChange={setTempValue}
                                minimumTrackTintColor={theme.colors.light.accentDark}
                                maximumTrackTintColor={theme.colors.light.borderLight}
                                thumbTintColor={theme.colors.light.accentDark}
                            />
                            
                            <View style={styles.newValueContainer}>
                                <Text style={styles.newValueLabel}>New Target:</Text>
                                <Text style={styles.newValueText}>
                                    {goal.formatValue(tempValue)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.bottomSheetFooter}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

interface GoalCardProps {
    goal: GoalData;
    onThreeDotsPress: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onThreeDotsPress }) => {
    // Calculate progress percentage
    const progressPercentage = (goal.currentValue / goal.targetValue) * 100;

    // Badge status calculation
    const getStatusBadge = (percentage: number, isQuality: boolean = false) => {
        if (percentage >= 100) {
            return isQuality 
                ? { text: 'Excellent', color: '#FFFFFF', bgColor: '#10B981' }
                : { text: 'Complete', color: '#FFFFFF', bgColor: '#10B981' };
        } else if (percentage >= 70) {
            return { text: 'Almost There', color: '#FFFFFF', bgColor: '#3B82F6' };
        } else if (percentage >= 50) {
            return { text: 'Halfway', color: '#000000', bgColor: '#F59E0B' };
        } else {
            return { text: 'Getting Started', color: '#FFFFFF', bgColor: '#6B7280' };
        }
    };

    const statusBadge = getStatusBadge(progressPercentage, goal.id === 'quality');

    return (
        <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
                <View style={styles.goalLeftSection}>
                    <View style={styles.goalIconContainer}>
                        <Ionicons 
                            name={goal.iconName as any} 
                            size={24} 
                            color={theme.colors.light.accentDark} 
                        />
                    </View>
                    <View style={styles.goalInfo}>
                        <Text style={styles.goalTitle}>{goal.title}</Text>
                        <Text style={styles.goalSubtitle}>{goal.subtitle}</Text>
                    </View>
                </View>
                
                <TouchableOpacity 
                    style={styles.threeDotsButton} 
                    onPress={onThreeDotsPress}
                >
                    <Ionicons 
                        name="ellipsis-horizontal" 
                        size={20} 
                        color={theme.colors.light.textSecondary} 
                    />
                </TouchableOpacity>
            </View>

            <View style={[
                styles.statusBadge,
                { backgroundColor: statusBadge.bgColor }
            ]}>
                <Text style={[
                    styles.statusBadgeText,
                    { color: statusBadge.color }
                ]}>
                    {statusBadge.text}
                </Text>
            </View>
            
            <View style={styles.progressSection}>
                <Text style={styles.statusText}>
                    {goal.id === 'quality' 
                        ? `Average: ${goal.currentValue}` 
                        : `${goal.currentValue} ${goal.id === 'healthyMeals' ? 'healthy foods eaten' : 'days tracked'}`
                    }
                </Text>
                
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <View 
                            style={[
                                styles.progressBarFill, 
                                { width: `${Math.min(progressPercentage, 100)}%` }
                            ]} 
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export const HealthGoalsScreen = () => {

    // State for goal targets
    const [healthyMealsTarget, setHealthyMealsTarget] = useState(5);
    const [trackingDaysTarget, setTrackingDaysTarget] = useState(5);
    const [qualityRatingTarget, setQualityRatingTarget] = useState(7.0);

    // State for bottom sheet
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<GoalData | null>(null);

    // Mock current progress data
    const currentHealthyMeals = 4;
    const currentTrackingDays = 5;
    const currentQualityRating = 7.3;

    // Goal data configuration
    const goals: GoalData[] = [
        {
            id: 'healthyMeals',
            iconName: 'leaf-outline',
            title: 'Healthy Eating',
            subtitle: 'Eat foods rated 7.0 or higher',
            description: 'Focus on consuming nutritious foods that receive high ratings from our analysis system.',
            howItWorks: 'When you scan food and it gets a rating of 7.0 or higher, it counts toward this goal. Higher rated foods have better nutritional profiles.',
            tips: [
                'Look for foods with high protein and fiber content',
                'Choose whole foods over processed alternatives',
                'Include plenty of fruits and vegetables in your meals',
                'Check ratings before eating to make informed choices'
            ],
            currentValue: currentHealthyMeals,
            targetValue: healthyMealsTarget,
            unit: 'meals',
            minValue: 3,
            maxValue: 10,
            step: 1,
            formatValue: (value: number) => `${value} meals`,
        },
        {
            id: 'consistency',
            iconName: 'calendar-outline',
            title: 'Stay Consistent',
            subtitle: 'Scan at least 1 food each day',
            description: 'Build a habit of tracking your food intake regularly to gain better insights into your eating patterns.',
            howItWorks: 'Taking a photo of any meal or snack counts toward your daily tracking goal. The more consistently you track, the better insights you\'ll receive.',
            tips: [
                'Set reminders to scan your meals',
                'Start with just one meal per day',
                'Track snacks and drinks too',
                'Use the app before eating to build the habit'
            ],
            currentValue: currentTrackingDays,
            targetValue: trackingDaysTarget,
            unit: 'days',
            minValue: 3,
            maxValue: 7,
            step: 1,
            formatValue: (value: number) => `${value} days`,
        },
        {
            id: 'quality',
            iconName: 'star-outline',
            title: 'Food Quality',
            subtitle: 'Keep your weekly average high',
            description: 'Maintain a high average rating across all your meals to ensure overall nutritional quality.',
            howItWorks: 'We calculate your average food rating by adding up all your food ratings and dividing by the number of meals. Higher quality foods improve your average.',
            tips: [
                'Aim for variety in your food choices',
                'Balance indulgent foods with healthier options',
                'Focus on gradual improvement over perfection',
                'Use ratings as guidance, not strict rules'
            ],
            currentValue: currentQualityRating,
            targetValue: qualityRatingTarget,
            unit: 'average',
            minValue: 5.0,
            maxValue: 9.0,
            step: 0.1,
            formatValue: (value: number) => `${value.toFixed(1)} average`,
        },
    ];

    const handleThreeDotsPress = (goal: GoalData) => {
        setSelectedGoal(goal);
        setBottomSheetVisible(true);
    };

    const handleSaveGoal = (goalId: string, newTarget: number) => {
        switch (goalId) {
            case 'healthyMeals':
                setHealthyMealsTarget(newTarget);
                break;
            case 'consistency':
                setTrackingDaysTarget(newTarget);
                break;
            case 'quality':
                setQualityRatingTarget(newTarget);
                break;
        }
    };

    const handleCloseBottomSheet = () => {
        setBottomSheetVisible(false);
        setSelectedGoal(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Health Goals</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Context Section */}
                <View style={styles.contextSection}>
                    <Text style={styles.contextText}>
                        Track your nutrition habits and stay motivated with personalized goals.
                    </Text>
                </View>

                {/* Goals */}
                <View style={styles.goalsSection}>
                    <Text style={styles.sectionTitle}>Your Goals</Text>
                    {goals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onThreeDotsPress={() => handleThreeDotsPress(goal)}
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
                                Rate your meals right before eating for the most accurate tracking
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

            {/* Bottom Sheet */}
            <BottomSheet
                visible={bottomSheetVisible}
                onClose={handleCloseBottomSheet}
                goal={selectedGoal}
                onSave={handleSaveGoal}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.light.bgPrimary,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
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
    contextSection: {
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    contextText: {
        fontSize: 16,
        color: theme.colors.light.textSecondary,
        lineHeight: 22,
        textAlign: 'center',
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
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    goalLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 4,
    },
    goalSubtitle: {
        fontSize: 14,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textSecondary,
    },
    threeDotsButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: theme.typography.weights.semibold,
    },
    statusText: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
    },
    progressSection: {
        gap: 12,
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
    // Bottom Sheet Styles
    bottomSheetContainer: {
        flex: 1,
        backgroundColor: theme.colors.light.bgPrimary,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: theme.colors.light.bgSecondary,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.light.borderLight,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.light.bgTertiary,
    },
    bottomSheetContent: {
        flex: 1,
        padding: 20,
    },
    infoSection: {
        marginBottom: 32,
    },
    infoCard: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    infoHeaderText: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
    },
    infoText: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        lineHeight: 20,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 8,
    },
    tipBullet: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        marginTop: 2,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        lineHeight: 20,
    },
    editSection: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    editSectionTitle: {
        fontSize: 18,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        marginBottom: 20,
    },
    currentValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    currentValueLabel: {
        fontSize: 16,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textSecondary,
    },
    currentValueText: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sliderLabel: {
        fontSize: 12,
        color: theme.colors.light.textMuted,
        fontWeight: theme.typography.weights.medium,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 16,
    },

    newValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: theme.colors.light.borderLight,
    },
    newValueLabel: {
        fontSize: 16,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textSecondary,
    },
    newValueText: {
        fontSize: 18,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.accentDark,
    },
    bottomSheetFooter: {
        padding: 20,
        backgroundColor: theme.colors.light.bgSecondary,
        borderTopWidth: 1,
        borderTopColor: theme.colors.light.borderLight,
    },
    saveButton: {
        backgroundColor: theme.colors.light.accentDark,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
    },
});

export default HealthGoalsScreen;
