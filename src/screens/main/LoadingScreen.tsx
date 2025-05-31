import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

const { width } = Dimensions.get('window');

const analysisSteps = [
    {
        id: 1,
        title: "Identifying Food",
        subtitle: "Recognizing ingredients and food items",
        icon: "search",
        duration: 2000,
    },
    {
        id: 2,
        title: "Analyzing Nutrients",
        subtitle: "Evaluating nutritional content",
        icon: "nutrition",
        duration: 2500,
    },
    {
        id: 3,
        title: "Processing Assessment",
        subtitle: "Checking processing levels",
        icon: "cog",
        duration: 2000,
    },
    {
        id: 4,
        title: "Health Rating",
        subtitle: "Calculating final health score",
        icon: "star",
        duration: 1500,
    },
];

export const LoadingScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress] = useState(new Animated.Value(0));
    const [pulseAnim] = useState(new Animated.Value(1));
    const navigation = useNavigation<LoadingScreenNavigationProp>();

    useEffect(() => {
        // Start the analysis process
        startAnalysis();

        // Start pulse animation
        startPulseAnimation();
    }, []);

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const startAnalysis = () => {
        let stepIndex = 0;
        const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);
        let elapsed = 0;

        const processStep = () => {
            if (stepIndex < analysisSteps.length) {
                setCurrentStep(stepIndex);

                // Update progress bar
                const stepProgress = (elapsed + analysisSteps[stepIndex].duration) / totalDuration;
                Animated.timing(progress, {
                    toValue: stepProgress,
                    duration: analysisSteps[stepIndex].duration,
                    useNativeDriver: false,
                }).start();

                elapsed += analysisSteps[stepIndex].duration;
                stepIndex++;

                setTimeout(processStep, analysisSteps[stepIndex - 1].duration);
            } else {
                // Analysis complete - navigate to results
                setTimeout(() => {
                    navigation.navigate('Results');
                }, 500);
            }
        };

        processStep();
    };

    const currentStepData = analysisSteps[currentStep];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Analyzing Your Food</Text>
                    <Text style={styles.headerSubtitle}>This usually takes just a few seconds</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>

                {/* Food Image Preview */}
                <View style={styles.imagePreview}>
                    <View style={styles.mockImage}>
                        <Animated.View style={[styles.imageContainer, { transform: [{ scale: pulseAnim }] }]}>
                            <Ionicons name="image" size={64} color={theme.colors.light.textSecondary} />
                        </Animated.View>
                    </View>
                    <View style={styles.scanningOverlay}>
                        <View style={styles.scanLine} />
                    </View>
                </View>

                {/* Current Step */}
                <View style={styles.stepSection}>
                    <View style={styles.stepIcon}>
                        <Ionicons
                            name={currentStepData.icon as any}
                            size={32}
                            color={theme.colors.light.accentDark}
                        />
                    </View>
                    <Text style={styles.stepTitle}>{currentStepData.title}</Text>
                    <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressContainer}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>
                        Step {currentStep + 1} of {analysisSteps.length}
                    </Text>
                </View>

                {/* Analysis Steps List */}
                <View style={styles.stepsList}>
                    {analysisSteps.map((step, index) => (
                        <View key={step.id} style={styles.stepItem}>
                            <View style={[
                                styles.stepIndicator,
                                index < currentStep && styles.stepCompleted,
                                index === currentStep && styles.stepActive,
                            ]}>
                                {index < currentStep ? (
                                    <Ionicons name="checkmark" size={12} color="white" />
                                ) : index === currentStep ? (
                                    <View style={styles.activeIndicator} />
                                ) : (
                                    <Text style={styles.stepNumber}>{index + 1}</Text>
                                )}
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={[
                                    styles.stepItemTitle,
                                    index <= currentStep && styles.stepItemTitleActive
                                ]}>
                                    {step.title}
                                </Text>
                                <Text style={styles.stepItemSubtitle}>{step.subtitle}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Fun Facts */}
            <View style={styles.funFact}>
                <Ionicons name="bulb" size={16} color={theme.colors.light.accentYellow.replace('#', '#')} />
                <Text style={styles.funFactText}>
                    Our AI analyzes over 50 nutritional factors in seconds!
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.light.bgPrimary,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        textAlign: 'center',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 20,
        backgroundColor: theme.colors.light.bgSecondary,
        borderWidth: 2,
        borderColor: theme.colors.light.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        overflow: 'hidden',
        position: 'relative',
    },
    mockImage: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanningOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(204, 228, 228, 0.1)',
    },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: theme.colors.light.accentDark,
        position: 'absolute',
        top: '50%',
        opacity: 0.8,
    },
    stepSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    stepIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    stepSubtitle: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        textAlign: 'center',
    },
    progressSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
    },
    progressContainer: {
        width: '100%',
        height: 4,
        backgroundColor: theme.colors.light.borderLight,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
    stepsList: {
        width: '100%',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    stepIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.light.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepCompleted: {
        backgroundColor: '#10b981',
    },
    stepActive: {
        backgroundColor: theme.colors.light.accentDark,
    },
    activeIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    stepNumber: {
        fontSize: 10,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textMuted,
    },
    stepContent: {
        flex: 1,
    },
    stepItemTitle: {
        fontSize: 14,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textMuted,
        marginBottom: 2,
    },
    stepItemTitleActive: {
        color: theme.colors.light.textPrimary,
    },
    stepItemSubtitle: {
        fontSize: 12,
        color: theme.colors.light.textMuted,
    },
    funFact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: theme.colors.light.bgSecondary,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        gap: 8,
    },
    funFactText: {
        fontSize: 13,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
        textAlign: 'center',
        flex: 1,
    },
});