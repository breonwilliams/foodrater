import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
    const [cameraAutoFocus, setCameraAutoFocus] = useState(true);
    const [saveHighQuality, setSaveHighQuality] = useState(false);
    const navigation = useNavigation<SettingsScreenNavigationProp>();

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out? You can sign back in anytime.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => {
                        // Handle sign out logic
                        console.log('User signed out');
                        navigation.navigate('Login');
                    }
                }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action cannot be undone. All your data will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Account',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Account Deleted', 'Your account has been deleted.');
                    }
                }
            ]
        );
    };

    const handleExportData = () => {
        Alert.alert(
            'Export Data',
            'Your food analysis history will be exported as a CSV file.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Export', onPress: () => console.log('Exporting data...') }
            ]
        );
    };

    const openPrivacyPolicy = () => {
        // Would open privacy policy URL or navigate to privacy screen
        console.log('Opening privacy policy');
    };

    const openTermsOfService = () => {
        // Would open terms URL or navigate to terms screen
        console.log('Opening terms of service');
    };

    const contactSupport = () => {
        Alert.alert(
            'Contact Support',
            'How would you like to contact us?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Email Support', onPress: () => console.log('Opening email...') },
                { text: 'Report Bug', onPress: () => console.log('Opening bug report...') }
            ]
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
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="person" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Profile Information</Text>
                            <Text style={styles.settingSubtitle}>Manage your account details</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="fitness" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Health Goals</Text>
                            <Text style={styles.settingSubtitle}>Set your nutrition targets</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="card" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Subscription</Text>
                            <Text style={styles.settingSubtitle}>Manage your premium plan</Text>
                        </View>
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumText}>Pro</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* App Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Preferences</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="notifications" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Push Notifications</Text>
                            <Text style={styles.settingSubtitle}>Get reminders and updates</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: theme.colors.light.borderLight, true: theme.colors.light.accentDark }}
                            thumbColor="white"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="camera" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Auto-Focus Camera</Text>
                            <Text style={styles.settingSubtitle}>Automatically focus on food</Text>
                        </View>
                        <Switch
                            value={cameraAutoFocus}
                            onValueChange={setCameraAutoFocus}
                            trackColor={{ false: theme.colors.light.borderLight, true: theme.colors.light.accentDark }}
                            thumbColor="white"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="image" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>High Quality Photos</Text>
                            <Text style={styles.settingSubtitle}>Better analysis, larger file size</Text>
                        </View>
                        <Switch
                            value={saveHighQuality}
                            onValueChange={setSaveHighQuality}
                            trackColor={{ false: theme.colors.light.borderLight, true: theme.colors.light.accentDark }}
                            thumbColor="white"
                        />
                    </View>

                    <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="language" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Language</Text>
                            <Text style={styles.settingSubtitle}>English (US)</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Privacy & Data */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Data</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="analytics" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Usage Analytics</Text>
                            <Text style={styles.settingSubtitle}>Help improve the app</Text>
                        </View>
                        <Switch
                            value={analyticsEnabled}
                            onValueChange={setAnalyticsEnabled}
                            trackColor={{ false: theme.colors.light.borderLight, true: theme.colors.light.accentDark }}
                            thumbColor="white"
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="download" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Export Data</Text>
                            <Text style={styles.settingSubtitle}>Download your food history</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="trash" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Clear Cache</Text>
                            <Text style={styles.settingSubtitle}>Free up storage space</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Support & About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support & About</Text>

                    <TouchableOpacity style={styles.settingItem} onPress={contactSupport}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="help-circle" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Help & Support</Text>
                            <Text style={styles.settingSubtitle}>Get help or report issues</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="star" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Rate Food Rater</Text>
                            <Text style={styles.settingSubtitle}>Leave a review on the App Store</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} onPress={openPrivacyPolicy}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="shield-checkmark" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Privacy Policy</Text>
                            <Text style={styles.settingSubtitle}>How we protect your data</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} onPress={openTermsOfService}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="document-text" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>Terms of Service</Text>
                            <Text style={styles.settingSubtitle}>App usage terms and conditions</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <View style={[styles.settingItem, styles.settingItemLast]}>
                        <View style={styles.settingIcon}>
                            <Ionicons name="information-circle" size={20} color={theme.colors.light.textSecondary} />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={styles.settingTitle}>App Version</Text>
                            <Text style={styles.settingSubtitle}>1.0.0 (Build 1)</Text>
                        </View>
                    </View>
                </View>

                {/* Account Actions */}
                <View style={styles.section}>
                    <TouchableOpacity style={[styles.settingItem, styles.signOutItem]} onPress={handleSignOut}>
                        <View style={[styles.settingIcon, styles.signOutIcon]}>
                            <Ionicons name="log-out" size={20} color="#ef4444" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, styles.signOutText]}>Sign Out</Text>
                            <Text style={styles.settingSubtitle}>Sign out of your account</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingItem, styles.deleteItem]} onPress={handleDeleteAccount}>
                        <View style={[styles.settingIcon, styles.deleteIcon]}>
                            <Ionicons name="warning" size={20} color="#ef4444" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, styles.deleteText]}>Delete Account</Text>
                            <Text style={styles.settingSubtitle}>Permanently delete your account</Text>
                        </View>
                    </TouchableOpacity>
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
    section: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 16,
        padding: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.light.borderLight,
    },
    settingItemLast: {
        borderBottomWidth: 0,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: theme.colors.light.textSecondary,
    },
    premiumBadge: {
        backgroundColor: theme.colors.light.accentYellow,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    premiumText: {
        fontSize: 12,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.accentDark,
    },
    signOutItem: {
        borderBottomWidth: 0,
    },
    signOutIcon: {
        backgroundColor: '#fef2f2',
    },
    signOutText: {
        color: '#ef4444',
    },
    deleteItem: {
        borderBottomWidth: 0,
    },
    deleteIcon: {
        backgroundColor: '#fef2f2',
    },
    deleteText: {
        color: '#ef4444',
    },
    bottomPadding: {
        height: 40,
    },
});

export default SettingsScreen;