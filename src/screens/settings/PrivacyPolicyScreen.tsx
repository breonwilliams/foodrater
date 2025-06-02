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

type PrivacyPolicyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;

export const PrivacyPolicyScreen = () => {
    const navigation = useNavigation<PrivacyPolicyScreenNavigationProp>();

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
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Last Updated */}
                <View style={styles.section}>
                    <Text style={styles.lastUpdated}>Last Updated: June 1, 2025</Text>
                </View>

                {/* Introduction */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Introduction</Text>
                    <Text style={styles.bodyText}>
                        Food Rater ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application.
                    </Text>
                    <Text style={styles.bodyText}>
                        We believe in transparency and want you to understand exactly what data we collect and how we use it to provide you with the best possible food analysis and health tracking experience.
                    </Text>
                </View>

                {/* Information We Collect */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Information We Collect</Text>
                    <Text style={styles.bodyText}>
                        We collect information you provide directly to us, including:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Profile information (name, email, phone number)</Text>
                        <Text style={styles.bulletPoint}>• Food photos and scan data</Text>
                        <Text style={styles.bulletPoint}>• Health goals and dietary preferences</Text>
                        <Text style={styles.bulletPoint}>• Nutrition tracking and progress data</Text>
                        <Text style={styles.bulletPoint}>• App usage and interaction data</Text>
                        <Text style={styles.bulletPoint}>• Device information (model, operating system, unique identifiers)</Text>
                        <Text style={styles.bulletPoint}>• Location data (only when you choose to share it)</Text>
                    </View>
                </View>

                {/* How We Use Your Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How We Use Your Information</Text>
                    <Text style={styles.bodyText}>
                        We use the information we collect to:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Provide accurate food analysis and health ratings</Text>
                        <Text style={styles.bulletPoint}>• Track your nutrition goals and progress over time</Text>
                        <Text style={styles.bulletPoint}>• Personalize your app experience and recommendations</Text>
                        <Text style={styles.bulletPoint}>• Improve our app's functionality and features</Text>
                        <Text style={styles.bulletPoint}>• Provide customer support and respond to inquiries</Text>
                        <Text style={styles.bulletPoint}>• Send you important updates about the app</Text>
                        <Text style={styles.bulletPoint}>• Ensure the security and integrity of our services</Text>
                    </View>
                </View>

                {/* Data Storage and Security */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Storage and Security</Text>
                    <Text style={styles.bodyText}>
                        Your data security is our top priority. We implement industry-standard security measures to protect your information:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Data is primarily stored locally on your device using secure storage</Text>
                        <Text style={styles.bulletPoint}>• All data transmission is encrypted using SSL/TLS protocols</Text>
                        <Text style={styles.bulletPoint}>• We use encryption to protect sensitive information</Text>
                        <Text style={styles.bulletPoint}>• Regular security audits and updates</Text>
                        <Text style={styles.bulletPoint}>• Limited access to personal data by authorized personnel only</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        We do not sell, rent, or share your personal data with third parties for marketing purposes.
                    </Text>
                </View>

                {/* Your Rights */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Rights</Text>
                    <Text style={styles.bodyText}>
                        You have the following rights regarding your personal data:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Access: Request a copy of the personal data we hold about you</Text>
                        <Text style={styles.bulletPoint}>• Correction: Request correction of inaccurate or incomplete data</Text>
                        <Text style={styles.bulletPoint}>• Deletion: Request deletion of your account and associated data</Text>
                        <Text style={styles.bulletPoint}>• Data Portability: Request your data in a portable format</Text>
                        <Text style={styles.bulletPoint}>• Withdraw Consent: Opt out of data collection at any time</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        To exercise any of these rights, please contact us using the information provided below.
                    </Text>
                </View>

                {/* Third-Party Services */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Third-Party Services</Text>
                    <Text style={styles.bodyText}>
                        Our app may integrate with third-party services to enhance functionality:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Camera and photo library access for food scanning</Text>
                        <Text style={styles.bulletPoint}>• Analytics services to improve app performance (anonymized data only)</Text>
                        <Text style={styles.bulletPoint}>• Cloud storage services for data backup (encrypted)</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        We do not share your personal information with advertisers or marketing companies.
                    </Text>
                </View>

                {/* Children's Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Children's Privacy</Text>
                    <Text style={styles.bodyText}>
                        Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                    </Text>
                    <Text style={styles.bodyText}>
                        For users between 13-18 years old, we recommend parental guidance when using health and nutrition tracking features.
                    </Text>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <Text style={styles.bodyText}>
                        If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </Text>
                    
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactText}>Email: privacy@foodrater.com</Text>
                        <Text style={styles.contactText}>Support: support@foodrater.com</Text>
                        <Text style={styles.contactText}>Response Time: Within 48 hours</Text>
                    </View>
                </View>

                {/* Changes to Policy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Changes to This Policy</Text>
                    <Text style={styles.bodyText}>
                        We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.
                    </Text>
                    <Text style={styles.bodyText}>
                        When we make changes, we will:
                    </Text>
                    
                    <View style={styles.bulletSection}>
                        <Text style={styles.bulletPoint}>• Update the "Last Updated" date at the top of this policy</Text>
                        <Text style={styles.bulletPoint}>• Notify you through the app or via email for significant changes</Text>
                        <Text style={styles.bulletPoint}>• Give you the opportunity to review the updated policy</Text>
                    </View>
                    
                    <Text style={styles.bodyText}>
                        Your continued use of the app after any changes indicates your acceptance of the updated Privacy Policy.
                    </Text>
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

export default PrivacyPolicyScreen;
