import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type ClearCacheScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ClearCache'>;

interface StorageInfo {
    appData: string;
    imageCache: string;
    total: string;
}

export const ClearCacheScreen = () => {
    const navigation = useNavigation<ClearCacheScreenNavigationProp>();
    const [isClearing, setIsClearing] = useState<string | null>(null);

    // Mock storage data - in a real app, this would be calculated
    const storageInfo: StorageInfo = {
        appData: '12.3 MB',
        imageCache: '8.7 MB',
        total: '21.0 MB'
    };

    const clearImageCache = async () => {
        Alert.alert(
            'Clear Image Cache',
            'This will remove all cached food photos. Your saved favorites and history will not be affected.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Cache',
                    style: 'destructive',
                    onPress: async () => {
                        setIsClearing('imageCache');
                        try {
                            // Simulate clearing image cache
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            
                            Alert.alert(
                                'Cache Cleared',
                                'Image cache has been successfully cleared. You\'ve freed up approximately 8.7 MB of storage.',
                                [{ text: 'OK' }]
                            );
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear image cache. Please try again.');
                        } finally {
                            setIsClearing(null);
                        }
                    }
                }
            ]
        );
    };

    const clearTempData = async () => {
        Alert.alert(
            'Clear Temporary Data',
            'This will remove temporary files, logs, and cached data. Your personal data will not be affected.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Data',
                    style: 'destructive',
                    onPress: async () => {
                        setIsClearing('tempData');
                        try {
                            // Simulate clearing temporary data
                            await new Promise(resolve => setTimeout(resolve, 1200));
                            
                            Alert.alert(
                                'Data Cleared',
                                'Temporary data has been successfully cleared. You\'ve freed up approximately 3.6 MB of storage.',
                                [{ text: 'OK' }]
                            );
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear temporary data. Please try again.');
                        } finally {
                            setIsClearing(null);
                        }
                    }
                }
            ]
        );
    };

    const renderProgressBar = (percentage: number) => (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
    );

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
                <Text style={styles.headerTitle}>Clear Cache</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Storage Usage Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Storage Usage</Text>
                    
                    <View style={styles.storageCard}>
                        <View style={styles.storageItem}>
                            <View style={styles.storageInfo}>
                                <Text style={styles.storageLabel}>App Data</Text>
                                <Text style={styles.storageValue}>{storageInfo.appData}</Text>
                            </View>
                            {renderProgressBar(60)}
                        </View>

                        <View style={styles.storageItem}>
                            <View style={styles.storageInfo}>
                                <Text style={styles.storageLabel}>Image Cache</Text>
                                <Text style={styles.storageValue}>{storageInfo.imageCache}</Text>
                            </View>
                            {renderProgressBar(40)}
                        </View>

                        <View style={[styles.storageItem, styles.storageItemLast]}>
                            <View style={styles.storageInfo}>
                                <Text style={[styles.storageLabel, styles.storageTotalLabel]}>Total Used</Text>
                                <Text style={[styles.storageValue, styles.storageTotalValue]}>{storageInfo.total}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Cache Options Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cache Options</Text>
                    
                    <TouchableOpacity
                        style={[styles.optionCard, isClearing === 'imageCache' && styles.optionCardDisabled]}
                        onPress={clearImageCache}
                        disabled={isClearing !== null}
                        activeOpacity={0.7}
                    >
                        <View style={styles.optionIcon}>
                            {isClearing === 'imageCache' ? (
                                <ActivityIndicator size="small" color={theme.colors.light.accentDark} />
                            ) : (
                                <Ionicons name="images" size={24} color={theme.colors.light.accentDark} />
                            )}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Clear Image Cache</Text>
                            <Text style={styles.optionSubtitle}>Remove cached food photos</Text>
                            <Text style={styles.optionSavings}>~8.7 MB will be freed</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.light.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionCard, isClearing === 'tempData' && styles.optionCardDisabled]}
                        onPress={clearTempData}
                        disabled={isClearing !== null}
                        activeOpacity={0.7}
                    >
                        <View style={styles.optionIcon}>
                            {isClearing === 'tempData' ? (
                                <ActivityIndicator size="small" color={theme.colors.light.accentDark} />
                            ) : (
                                <Ionicons name="folder" size={24} color={theme.colors.light.accentDark} />
                            )}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Clear Temporary Data</Text>
                            <Text style={styles.optionSubtitle}>Remove temporary files and cache</Text>
                            <Text style={styles.optionSavings}>~3.6 MB will be freed</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.light.textMuted} />
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
    storageCard: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    storageItem: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.light.borderLight,
    },
    storageItemLast: {
        marginBottom: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
    },
    storageInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    storageLabel: {
        fontSize: 16,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textPrimary,
    },
    storageTotalLabel: {
        fontWeight: theme.typography.weights.bold,
    },
    storageValue: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
    },
    storageTotalValue: {
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: theme.colors.light.borderLight,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: 2,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    optionCardDisabled: {
        opacity: 0.6,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 4,
    },
    optionSubtitle: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        marginBottom: 4,
    },
    optionSavings: {
        fontSize: 12,
        color: theme.colors.light.accentDark,
        fontWeight: theme.typography.weights.medium,
    },
    bottomPadding: {
        height: 40,
    },
});

export default ClearCacheScreen;
