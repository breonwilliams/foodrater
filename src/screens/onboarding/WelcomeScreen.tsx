import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

const onboardingData = [
    {
        id: 1,
        title: "AI-Powered Analysis",
        subtitle: "Take a photo of any food and get instant health insights powered by advanced AI technology",
        icon: "scan",
        color: "#10b981"
    },
    {
        id: 2,
        title: "Health Ratings",
        subtitle: "Get clear ratings from 1-10 based on 6 key health criteria including nutrients and processing levels",
        icon: "star",
        color: "#3b82f6"
    },
    {
        id: 3,
        title: "Track Progress",
        subtitle: "Monitor your eating habits over time and see your health journey with detailed progress tracking",
        icon: "trending-up",
        color: "#f59e0b"
    }
];

export const WelcomeScreen = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    const handleNext = () => {
        if (currentStep < onboardingData.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigation.navigate('MainTabs');
        }
    };

    const handleSkip = () => {
        navigation.navigate('MainTabs');
    };

    const handleGetStarted = () => {
        navigation.navigate('MainTabs');
    };

    const currentData = onboardingData[currentStep];

    return (
        <SafeAreaView style={styles.container}>
            {/* Skip Button */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.content}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.logoContainer}>
                        <View style={styles.appIcon}>
                            <Ionicons name="star" size={32} color="white" />
                        </View>
                        <Text style={styles.appName}>Food Rater</Text>
                    </View>

                    {/* Feature Icon */}
                    <View style={[styles.featureIcon, { backgroundColor: currentData.color }]}>
                        <Ionicons name={currentData.icon as any} size={48} color="white" />
                    </View>

                    {/* Content */}
                    <View style={styles.textContent}>
                        <Text style={styles.title}>{currentData.title}</Text>
                        <Text style={styles.subtitle}>{currentData.subtitle}</Text>
                    </View>
                </View>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentStep && styles.activeDot
                            ]}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomSection}>
                {currentStep < onboardingData.length - 1 ? (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next</Text>
                        <Ionicons name="arrow-forward" size={16} color="white" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                        <Text style={styles.getStartedButtonText}>Get Started</Text>
                    </TouchableOpacity>
                )}

                {/* Feature Highlights */}
                <View style={styles.featuresRow}>
                    <View style={styles.featureHighlight}>
                        <Ionicons name="camera" size={16} color={theme.colors.light.textSecondary} />
                        <Text style={styles.featureText}>Easy Scanning</Text>
                    </View>
                    <View style={styles.featureHighlight}>
                        <Ionicons name="flash" size={16} color={theme.colors.light.textSecondary} />
                        <Text style={styles.featureText}>Instant Results</Text>
                    </View>
                    <View style={styles.featureHighlight}>
                        <Ionicons name="shield-checkmark" size={16} color={theme.colors.light.textSecondary} />
                        <Text style={styles.featureText}>Privacy First</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.light.bgPrimary,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    appIcon: {
        width: 64,
        height: 64,
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: theme.colors.light.accentDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    appName: {
        fontSize: 28,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
    },
    featureIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    textContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.light.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 40,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.light.borderLight,
    },
    activeDot: {
        backgroundColor: theme.colors.light.accentDark,
        width: 24,
    },
    bottomSection: {
        padding: 20,
        paddingBottom: 40,
    },
    nextButton: {
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
    },
    getStartedButton: {
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    getStartedButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
    },
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    featureHighlight: {
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 12,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
});
