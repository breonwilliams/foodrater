import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Linking,
    Alert,
    Animated,
    LayoutAnimation,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type HelpSupportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelpSupport'>;

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: '1',
        question: 'How does food rating work?',
        answer: 'Our AI analyzes your food photos using advanced computer vision and nutritional databases. It evaluates factors like ingredients, preparation methods, portion sizes, and nutritional content to provide an overall health rating from 1-10.'
    },
    {
        id: '2',
        question: 'Why is my food rated low/high?',
        answer: 'Ratings are based on nutritional density, ingredient quality, processing level, and how well the food aligns with general health guidelines. Whole foods typically score higher, while highly processed foods score lower. The rating considers calories, nutrients, additives, and preparation methods.'
    },
    {
        id: '3',
        question: 'How do I delete a scan?',
        answer: 'Go to your History screen, find the scan you want to delete, and swipe left on the item. Tap the delete button that appears, or tap on the scan and look for the delete option in the details view.'
    },
    {
        id: '4',
        question: 'Can I change my goal targets?',
        answer: 'Yes! Go to Settings → Health Goals to customize your daily targets for calories, protein, carbs, fat, and other nutritional goals. You can adjust these based on your personal health objectives and dietary preferences.'
    },
    {
        id: '5',
        question: 'How do I save foods to favorites?',
        answer: 'When viewing a food\'s details after scanning, tap the heart icon to add it to your favorites. You can access all your favorite foods from the Favorites tab in the main navigation.'
    },
    {
        id: '6',
        question: 'What does each health criteria mean?',
        answer: 'Our rating system evaluates: Nutritional Density (vitamins/minerals), Ingredient Quality (natural vs processed), Caloric Balance (appropriate portions), Macronutrient Balance (protein/carbs/fat ratio), and Processing Level (whole foods vs ultra-processed).'
    },
    {
        id: '7',
        question: 'How accurate are the ratings?',
        answer: 'Our AI has been trained on extensive nutritional databases and achieves 85-90% accuracy in food identification. However, ratings are general guidelines and may not account for individual dietary needs, allergies, or specific health conditions. Always consult healthcare providers for personalized advice.'
    }
];

export const HelpSupportScreen = () => {
    const navigation = useNavigation<HelpSupportScreenNavigationProp>();
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    const handleContactSupport = () => {
        const email = 'support@foodrater.com';
        const subject = 'Food Rater Support Request';
        const body = `Hi Food Rater Support Team,

I need help with:

[Please describe your issue here]

Device Information:
- Platform: ${Platform.OS}
- App Version: 1.0.0

Thank you!`;

        const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        Linking.canOpenURL(mailto).then(supported => {
            if (supported) {
                Linking.openURL(mailto);
            } else {
                Alert.alert(
                    'Email Not Available',
                    'Please send an email to support@foodrater.com',
                    [
                        { text: 'Copy Email', onPress: () => {
                            // In a real app, you'd use Clipboard API here
                            Alert.alert('Email Copied', 'support@foodrater.com has been copied to clipboard');
                        }},
                        { text: 'OK' }
                    ]
                );
            }
        });
    };

    const handleReportBug = () => {
        const email = 'support@foodrater.com';
        const subject = 'Food Rater Bug Report';
        const body = `Hi Food Rater Team,

I found a bug in the app:

Bug Description:
[Please describe what happened]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [What happened]

Expected Behavior:
[What should have happened]

Device Information:
- Platform: ${Platform.OS}
- App Version: 1.0.0

Screenshots: [If applicable]

Thank you for helping us improve the app!`;

        const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        Linking.canOpenURL(mailto).then(supported => {
            if (supported) {
                Linking.openURL(mailto);
            } else {
                Alert.alert(
                    'Email Not Available',
                    'Please send a bug report to support@foodrater.com',
                    [
                        { text: 'Copy Email', onPress: () => {
                            Alert.alert('Email Copied', 'support@foodrater.com has been copied to clipboard');
                        }},
                        { text: 'OK' }
                    ]
                );
            }
        });
    };

    const handleCheckUpdates = () => {
        Alert.alert(
            'Check for Updates',
            'You have the latest version of Food Rater!',
            [{ text: 'OK' }]
        );
    };

    const toggleFAQ = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const renderFAQItem = (item: FAQItem) => {
        const isExpanded = expandedFAQ === item.id;
        
        return (
            <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleFAQ(item.id)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.faqQuestionText}>{item.question}</Text>
                    <Ionicons
                        name="chevron-down"
                        size={20}
                        color={theme.colors.light.textSecondary}
                        style={[
                            styles.faqChevron,
                            isExpanded && styles.faqChevronExpanded
                        ]}
                    />
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.faqAnswer}>
                        <Text style={styles.faqAnswerText}>{item.answer}</Text>
                    </View>
                )}
            </View>
        );
    };

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
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Quick Actions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={handleContactSupport}
                        activeOpacity={0.7}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="mail" size={24} color={theme.colors.light.accentDark} />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Contact Support</Text>
                            <Text style={styles.actionSubtitle}>Get help from our team</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={handleReportBug}
                        activeOpacity={0.7}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="bug" size={24} color={theme.colors.light.accentDark} />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Report a Bug</Text>
                            <Text style={styles.actionSubtitle}>Found an issue? Let us know</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    <View style={styles.faqContainer}>
                        {FAQ_DATA.map(renderFAQItem)}
                    </View>
                </View>

                {/* App Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Information</Text>
                    
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>App Version</Text>
                            <Text style={styles.infoValue}>1.0.0 (Build 1)</Text>
                        </View>
                        
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={handleCheckUpdates}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.infoLabel}>Check for Updates</Text>
                            <View style={styles.infoAction}>
                                <Text style={styles.infoActionText}>Check Now</Text>
                                <Ionicons name="chevron-forward" size={16} color={theme.colors.light.accentDark} />
                            </View>
                        </TouchableOpacity>
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
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        marginBottom: 16,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
    },
    faqContainer: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        overflow: 'hidden',
    },
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.light.borderLight,
    },
    faqQuestion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    faqQuestionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textPrimary,
        marginRight: 12,
    },
    faqChevron: {
        transform: [{ rotate: '0deg' }],
    },
    faqChevronExpanded: {
        transform: [{ rotate: '180deg' }],
    },
    faqAnswer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    faqAnswerText: {
        fontSize: 14,
        lineHeight: 20,
        color: theme.colors.light.textSecondary,
    },
    infoCard: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.light.borderLight,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textPrimary,
    },
    infoValue: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
    },
    infoAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoActionText: {
        fontSize: 14,
        color: theme.colors.light.accentDark,
        fontWeight: theme.typography.weights.medium,
        marginRight: 4,
    },
    bottomPadding: {
        height: 40,
    },
});

export default HelpSupportScreen;
