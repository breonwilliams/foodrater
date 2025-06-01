import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainTabParamList, RootStackParamList } from '../../types/navigation';

type CameraScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Camera'>,
  StackNavigationProp<RootStackParamList>
>;

export const CameraScreen = () => {
    const [hasImage, setHasImage] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [foodDetails, setFoodDetails] = useState('');
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
    const [showFloatingTip, setShowFloatingTip] = useState(false);
    const navigation = useNavigation<CameraScreenNavigationProp>();

    // Request permissions and check if first time user
    useEffect(() => {
        (async () => {
            // Request camera permission
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            // Request gallery permission
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');

            // Check if user has seen the tip before
            try {
                const hasSeenTip = await AsyncStorage.getItem('hasSeenCameraTip');
                if (!hasSeenTip) {
                    setShowFloatingTip(true);
                }
            } catch (error) {
                console.log('Error checking tip status:', error);
                setShowFloatingTip(true); // Show tip if we can't check
            }
        })();
    }, []);

    // Hide tip when user navigates away
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if (showFloatingTip) {
                hideTipPermanently();
            }
        });

        return unsubscribe;
    }, [navigation, showFloatingTip]);

    const hideTipPermanently = async () => {
        try {
            await AsyncStorage.setItem('hasSeenCameraTip', 'true');
            setShowFloatingTip(false);
        } catch (error) {
            console.log('Error saving tip status:', error);
            setShowFloatingTip(false); // Hide anyway
        }
    };

    const handleScroll = () => {
        if (showFloatingTip) {
            setShowFloatingTip(false);
        }
    };

    const handleTakePhoto = async () => {
        if (hasCameraPermission === null) {
            Alert.alert('Permission', 'Requesting camera permission...');
            return;
        }

        if (hasCameraPermission === false) {
            Alert.alert(
                'Camera Permission Required',
                'Please enable camera access in your device settings to take photos.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Settings', onPress: () => {
                            // On iOS, this would open settings. For now, just inform user.
                            Alert.alert('Settings', 'Please go to Settings > Privacy > Camera and enable access for Food Rater');
                        }
                    }
                ]
            );
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setImageUri(result.assets[0].uri);
                setHasImage(true);
                // Hide tip permanently when user takes a photo
                if (showFloatingTip) {
                    hideTipPermanently();
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo. Please try again.');
            console.error('Camera error:', error);
        }
    };

    const handleSelectFromGallery = async () => {
        if (hasGalleryPermission === null) {
            Alert.alert('Permission', 'Requesting gallery permission...');
            return;
        }

        if (hasGalleryPermission === false) {
            Alert.alert(
                'Gallery Permission Required',
                'Please enable photo library access in your device settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Settings', onPress: () => {
                            Alert.alert('Settings', 'Please go to Settings > Privacy > Photos and enable access for Food Rater');
                        }
                    }
                ]
            );
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setImageUri(result.assets[0].uri);
                setHasImage(true);
                // Hide tip permanently when user selects from gallery
                if (showFloatingTip) {
                    hideTipPermanently();
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to select photo. Please try again.');
            console.error('Gallery error:', error);
        }
    };

    const handleAnalyze = () => {
        navigation.navigate('Loading');
    };

    const handleAddDetails = () => {
        setShowDetailsModal(true);
    };

    const handleAnalyzeWithDetails = () => {
        setShowDetailsModal(false);
        // Include the foodDetails in the analysis
        console.log('Analyzing with details:', foodDetails);
        navigation.navigate('Loading');
    };

    const handleSkipDetails = () => {
        setShowDetailsModal(false);
        navigation.navigate('Loading');
    };

    const handleRetakePhoto = () => {
        setHasImage(false);
        setImageUri(null);
        setFoodDetails('');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.appIconSmall}>
                        <Ionicons name="star" size={16} color="white" />
                    </View>
                    <Text style={styles.appName}>Food Rater</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="person" size={16} color={theme.colors.light.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                style={styles.mainContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Ready to rate your food?</Text>
                    <Text style={styles.welcomeSubtitle}>Take a photo and get instant AI-powered health insights</Text>
                </View>

                {/* Camera Section */}
                <View style={styles.cameraSection}>
                    <View style={styles.cameraPreview}>
                        {!hasImage ? (
                            <View style={styles.cameraPlaceholder}>
                                <Ionicons
                                    name="camera"
                                    size={48}
                                    color={theme.colors.light.textTertiary}
                                    style={{ opacity: 0.6 }}
                                />
                                <Text style={styles.placeholderText}>Tap to capture</Text>
                                <Text style={styles.placeholderSubtext}>or select from gallery</Text>
                            </View>
                        ) : (
                            <View style={styles.imagePreview}>
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={styles.capturedImage} />
                                ) : (
                                    <View style={styles.mockImage}>
                                        <Ionicons name="image" size={48} color={theme.colors.light.textSecondary} />
                                    </View>
                                )}
                                <TouchableOpacity style={styles.analyzeOverlay} onPress={handleAnalyze}>
                                    <Text style={styles.analyzeText}>Tap to analyze this food</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.btnSecondary} onPress={handleSelectFromGallery}>
                            <Ionicons name="images" size={20} color={theme.colors.light.textTertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnCamera} onPress={handleTakePhoto}>
                            <Ionicons name="camera" size={32} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('History')}>
                            <Ionicons name="time" size={20} color={theme.colors.light.textTertiary} />
                        </TouchableOpacity>
                    </View>

                    {/* Image Actions - Only show when image is captured */}
                    {hasImage && (
                        <View style={styles.imageActions}>
                            <TouchableOpacity style={styles.addDetailsButton} onPress={handleAddDetails}>
                                <Ionicons name="add-circle-outline" size={16} color={theme.colors.light.textSecondary} />
                                <Text style={styles.addDetailsText}>Add details for better accuracy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto}>
                                <Ionicons name="refresh" size={16} color={theme.colors.light.textSecondary} />
                                <Text style={styles.retakeText}>Retake Photo</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Progress Stats */}
                <View style={styles.quickStats}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsTitle}>Your Progress</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
                            <Text style={styles.viewAllBtn}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>23</Text>
                            <Text style={styles.statLabel}>Foods Rated</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, styles.statNumberPositive]}>7.2</Text>
                            <Text style={styles.statLabel}>Avg Rating</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>This Week</Text>
                        </View>
                    </View>
                </View>

                {/* Recent Scans */}
                <View style={styles.recentSection}>
                    <Text style={styles.sectionTitle}>Recent Scans</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentGrid}>
                        {[8.5, 6.2, 9.1].map((rating, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.recentItem}
                                onPress={() => navigation.navigate('FoodDetails')}
                            >
                                <View style={styles.recentImage}>
                                    <Ionicons name="star" size={24} color={theme.colors.light.textSecondary} />
                                </View>
                                <View style={styles.recentInfo}>
                                    <Text style={styles.recentRating}>{rating}</Text>
                                    <Text style={styles.recentDate}>{index === 0 ? '2 hours ago' : index === 1 ? '1 day ago' : '2 days ago'}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Floating Tip */}
            {!hasImage && showFloatingTip && (
                <View style={styles.floatingTip}>
                    <TouchableOpacity 
                        style={styles.floatingTipContainer}
                        onPress={hideTipPermanently}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.floatingTipText}>Tap the camera to get started!</Text>
                        <Ionicons name="close" size={14} color={theme.colors.light.accentDark} style={styles.floatingTipClose} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Food Details Modal */}
            <Modal
                visible={showDetailsModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowDetailsModal(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContent}
                    >
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Add Food Details</Text>
                            <TouchableOpacity onPress={handleSkipDetails}>
                                <Text style={styles.modalSkip}>Skip</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Modal Content */}
                        <ScrollView style={styles.modalBody}>
                            <View style={styles.helpSection}>
                                <Ionicons name="information-circle" size={20} color={theme.colors.light.textSecondary} />
                                <Text style={styles.helpText}>
                                    Add details about ingredients, cooking methods, or anything that might not be visible in the photo for more accurate analysis.
                                </Text>
                            </View>

                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Food Details</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={foodDetails}
                                    onChangeText={setFoodDetails}
                                    placeholder="e.g., Brown rice, black beans, grilled chicken, cheese, lettuce, salsa, no sour cream..."
                                    placeholderTextColor={theme.colors.light.textMuted}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Quick Examples */}
                            <View style={styles.examplesSection}>
                                <Text style={styles.examplesTitle}>Quick Examples:</Text>
                                <TouchableOpacity
                                    style={styles.exampleItem}
                                    onPress={() => setFoodDetails('Brown rice bowl with grilled chicken, black beans, corn, cheese, lettuce, tomatoes, mild salsa')}
                                >
                                    <Text style={styles.exampleText}>Chipotle Bowl</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.exampleItem}
                                    onPress={() => setFoodDetails('Mixed green salad with quinoa, roasted vegetables, feta cheese, olive oil dressing')}
                                >
                                    <Text style={styles.exampleText}>Mixed Salad</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.exampleItem}
                                    onPress={() => setFoodDetails('Homemade smoothie with banana, spinach, protein powder, almond milk, chia seeds')}
                                >
                                    <Text style={styles.exampleText}>Green Smoothie</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        {/* Modal Footer */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[
                                    styles.analyzeButton,
                                    !foodDetails.trim() && styles.analyzeButtonDisabled
                                ]}
                                onPress={handleAnalyzeWithDetails}
                                disabled={!foodDetails.trim()}
                            >
                                <Text style={styles.analyzeButtonText}>Analyze with Details</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    appIconSmall: {
        width: 32,
        height: 32,
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        fontSize: 18,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContent: {
        flex: 1,
    },
    welcomeSection: {
        padding: 24,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        textAlign: 'center',
    },
    cameraSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    cameraPreview: {
        width: 280,
        height: 280,
        borderRadius: 20,
        backgroundColor: theme.colors.light.bgSecondary,
        borderWidth: 2,
        borderColor: theme.colors.light.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 32,
        elevation: 5,
        overflow: 'hidden',
    },
    cameraPlaceholder: {
        alignItems: 'center',
        gap: 16,
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.textTertiary,
    },
    placeholderSubtext: {
        fontSize: 14,
        color: theme.colors.light.textMuted,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    capturedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
    },
    mockImage: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: theme.typography.weights.medium,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 16,
    },
    btnCamera: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.light.accentDark,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.colors.light.accentDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 5,
    },
    btnSecondary: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.light.bgSecondary,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageActions: {
        alignItems: 'center',
        gap: 12,
    },
    addDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    addDetailsText: {
        fontSize: 13,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.light.bgTertiary,
        borderRadius: 20,
    },
    retakeText: {
        fontSize: 13,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
    quickStats: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 12,
        elevation: 2,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
    },
    viewAllBtn: {
        fontSize: 13,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
    },
    statNumberPositive: {
        color: '#10b981',
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.light.textSecondary,
        marginTop: 4,
        fontWeight: theme.typography.weights.medium,
    },
    recentSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 16,
    },
    recentGrid: {
        flexDirection: 'row',
    },
    recentItem: {
        width: 120,
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    recentImage: {
        width: 120,
        height: 120,
        backgroundColor: theme.colors.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentInfo: {
        padding: 12,
    },
    recentRating: {
        fontSize: 16,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
    },
    recentDate: {
        fontSize: 11,
        color: theme.colors.light.textMuted,
        marginTop: 4,
    },
    floatingTip: {
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: [{ translateX: -110 }],
        shadowColor: 'rgba(255, 218, 128, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 5,
    },
    floatingTipContainer: {
        backgroundColor: theme.colors.light.accentYellow,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    floatingTipText: {
        fontSize: 12,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.accentDark,
    },
    floatingTipClose: {
        opacity: 0.7,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.light.bgPrimary,
    },
    modalContent: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.light.borderLight,
        backgroundColor: theme.colors.light.bgSecondary,
    },
    modalCancel: {
        fontSize: 16,
        color: theme.colors.light.textSecondary,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
    },
    modalSkip: {
        fontSize: 16,
        color: theme.colors.light.textSecondary,
    },
    modalBody: {
        flex: 1,
        padding: 20,
    },
    helpSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: theme.colors.light.bgSecondary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    helpText: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        lineHeight: 20,
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: theme.colors.light.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        height: 100,
    },
    examplesSection: {
        marginBottom: 24,
    },
    examplesTitle: {
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 12,
    },
    exampleItem: {
        backgroundColor: theme.colors.light.bgTertiary,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    exampleText: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.colors.light.borderLight,
        backgroundColor: theme.colors.light.bgSecondary,
    },
    analyzeButton: {
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    analyzeButtonDisabled: {
        backgroundColor: theme.colors.light.textMuted,
    },
    analyzeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: theme.typography.weights.semibold,
    },
});
