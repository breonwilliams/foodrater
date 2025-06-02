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

type TermsOfServiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TermsOfService'>;

export const TermsOfServiceScreen = () => {
    const navigation = useNavigation<TermsOfServiceScreenNavigationProp>();

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
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Effective Date */}
                <View style={styles.section}>
                    <Text style={styles.lastUpdated}>Effective Date: June 1, 2025</Text>
                </View>

                {/* Agreement to Terms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
                    <Text style={styles.bodyText}>
                        By downloading, installing, or using the Food Rater mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
                    </Text>
                    <Text style={styles.bodyText}>
                        These Terms constitute a legally binding agreement between you and Food Rater regarding your use of the App and its services.
                    </Text>
                </View>

                {/* Description of Service */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Description of Service</Text>
                    <Text style={styles.bodyText}>
                        Food Rater is a mobile application that provides AI-powered food analysis and health ratings based on photos taken by users. The App helps users make informed decisions about their food choices by analyzing nutritional content, ingredients, and health factors.
                    </Text>
                    <Text style={styles.bodyText}>
                        Our services include but are not limited to:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Food photo analysis and recognition</Text>
                        <Text style={styles.bulletPoint}>• Nutritional information and health ratings</Text>
                        <Text style={styles.bulletPoint}>• Personal nutrition tracking and goal setting</Text>
                        <Text style={styles.bulletPoint}>• Food history and favorites management</Text>
                        <Text style={styles.bulletPoint}>• Personalized recommendations and insights</Text>
                    </View>
                </View>

                {/* Acceptable Use */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Acceptable Use</Text>
                    <Text style={styles.bodyText}>
                        You may use the App for personal, non-commercial purposes in accordance with these Terms. You agree not to:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Use the App for any illegal or unauthorized purpose</Text>
                        <Text style={styles.bulletPoint}>• Attempt to reverse engineer, hack, or compromise the App's security</Text>
                        <Text style={styles.bulletPoint}>• Upload inappropriate, harmful, or offensive content</Text>
                        <Text style={styles.bulletPoint}>• Interfere with the App's functionality or other users' experience</Text>
                        <Text style={styles.bulletPoint}>• Use automated systems to access the App without permission</Text>
                        <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
                        <Text style={styles.bulletPoint}>• Impersonate others or provide false information</Text>
                    </View>
                </View>

                {/* User Accounts */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. User Accounts</Text>
                    <Text style={styles.bodyText}>
                        To access certain features of the App, you may need to create an account. You are responsible for:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Maintaining the confidentiality of your account credentials</Text>
                        <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
                        <Text style={styles.bulletPoint}>• Providing accurate and up-to-date information</Text>
                        <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        We reserve the right to suspend or terminate accounts that violate these Terms or engage in suspicious activity.
                    </Text>
                </View>

                {/* Intellectual Property */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
                    <Text style={styles.bodyText}>
                        The App and its original content, features, and functionality are owned by Food Rater and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                    </Text>
                    <Text style={styles.bodyText}>
                        You retain ownership of the photos and content you upload to the App. By using the App, you grant us a limited, non-exclusive license to use your content solely for providing our services to you.
                    </Text>
                    <Text style={styles.bodyText}>
                        You may not reproduce, distribute, modify, or create derivative works of the App without our express written permission.
                    </Text>
                </View>

                {/* App Availability */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. App Availability</Text>
                    <Text style={styles.bodyText}>
                        We strive to provide reliable service, but we cannot guarantee that the App will be available at all times. The App may be subject to:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Scheduled maintenance and updates</Text>
                        <Text style={styles.bulletPoint}>• Technical difficulties or server issues</Text>
                        <Text style={styles.bulletPoint}>• Modifications or discontinuation of features</Text>
                        <Text style={styles.bulletPoint}>• Interruptions due to circumstances beyond our control</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        We reserve the right to modify, suspend, or discontinue any part of the App at any time without prior notice.
                    </Text>
                </View>

                {/* Health Disclaimers */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Health Disclaimers</Text>
                    <Text style={styles.bodyText}>
                        <Text style={styles.boldText}>IMPORTANT:</Text> The food ratings, nutritional information, and health recommendations provided by the App are for informational purposes only and should not be considered medical advice.
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Always consult with healthcare professionals for medical decisions</Text>
                        <Text style={styles.bulletPoint}>• The App is not a substitute for professional medical advice</Text>
                        <Text style={styles.bulletPoint}>• Individual dietary needs and health conditions vary</Text>
                        <Text style={styles.bulletPoint}>• We do not guarantee the accuracy of nutritional information</Text>
                        <Text style={styles.bulletPoint}>• Users with allergies or medical conditions should exercise caution</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        You use the App's health and nutrition information at your own risk and discretion.
                    </Text>
                </View>

                {/* Disclaimers */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Disclaimers</Text>
                    <Text style={styles.bodyText}>
                        THE APP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Accuracy, reliability, or completeness of information</Text>
                        <Text style={styles.bulletPoint}>• Uninterrupted or error-free operation</Text>
                        <Text style={styles.bulletPoint}>• Fitness for a particular purpose</Text>
                        <Text style={styles.bulletPoint}>• Non-infringement of third-party rights</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        Your use of the App is at your sole risk. We disclaim all warranties to the fullest extent permitted by law.
                    </Text>
                </View>

                {/* Limitation of Liability */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
                    <Text style={styles.bodyText}>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, FOOD RATER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Loss of profits, data, or business opportunities</Text>
                        <Text style={styles.bulletPoint}>• Health issues or medical complications</Text>
                        <Text style={styles.bulletPoint}>• Decisions made based on App information</Text>
                        <Text style={styles.bulletPoint}>• Interruption of business or personal activities</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        Our total liability to you for any claims arising from your use of the App shall not exceed the amount you paid for the App in the twelve months preceding the claim.
                    </Text>
                </View>

                {/* Termination */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. Termination</Text>
                    <Text style={styles.bodyText}>
                        We may terminate or suspend your account and access to the App immediately, without prior notice, for any reason, including but not limited to:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Violation of these Terms</Text>
                        <Text style={styles.bulletPoint}>• Fraudulent or illegal activity</Text>
                        <Text style={styles.bulletPoint}>• Extended periods of inactivity</Text>
                        <Text style={styles.bulletPoint}>• Technical or security concerns</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        Upon termination, your right to use the App will cease immediately. Provisions that by their nature should survive termination will remain in effect.
                    </Text>
                </View>

                {/* Governing Law */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>11. Governing Law</Text>
                    <Text style={styles.bodyText}>
                        These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
                    </Text>
                    <Text style={styles.bodyText}>
                        Any disputes arising from these Terms or your use of the App shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                    </Text>
                </View>

                {/* Changes to Terms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
                    <Text style={styles.bodyText}>
                        We reserve the right to modify these Terms at any time. When we make changes, we will:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Update the "Effective Date" at the top of these Terms</Text>
                        <Text style={styles.bulletPoint}>• Notify you through the App or via email for significant changes</Text>
                        <Text style={styles.bulletPoint}>• Provide reasonable notice before changes take effect</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        Your continued use of the App after any changes indicates your acceptance of the updated Terms.
                    </Text>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>13. Contact Information</Text>
                    <Text style={styles.bodyText}>
                        If you have any questions about these Terms of Service, please contact us:
                    </Text>
                    
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactText}>Email: legal@foodrater.com</Text>
                        <Text style={styles.contactText}>Support: support@foodrater.com</Text>
                        <Text style={styles.contactText}>Address: Food Rater Legal Department</Text>
                        <Text style={styles.contactText}>Response Time: Within 5 business days</Text>
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
        marginBottom: 24,
    },
    lastUpdated: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.light.textPrimary,
        marginBottom: 12,
    },
    boldText: {
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
    },
    bulletSection: {
        marginLeft: 8,
        marginBottom: 12,
    },
    bulletPoint: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
    },
    contactInfo: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
    },
    contactText: {
        fontSize: 16,
        color: theme.colors.light.textPrimary,
        marginBottom: 4,
    },
    bottomPadding: {
        height: 40,
    },
});

export default TermsOfServiceScreen;
