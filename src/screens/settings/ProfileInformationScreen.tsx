import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type ProfileInformationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileInformation'>;

interface UserProfile {
    fullName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    profilePhoto?: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
}

export const ProfileInformationScreen = () => {
    const navigation = useNavigation<ProfileInformationScreenNavigationProp>();
    
    // Form state
    const [profile, setProfile] = useState<UserProfile>({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        profilePhoto: '',
    });
    
    const [originalProfile, setOriginalProfile] = useState<UserProfile>({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        profilePhoto: '',
    });
    
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Load profile data on mount
    useEffect(() => {
        loadProfile();
    }, []);

    // Check for changes whenever profile updates
    useEffect(() => {
        const profileChanged = JSON.stringify(profile) !== JSON.stringify(originalProfile);
        setHasChanges(profileChanged);
    }, [profile, originalProfile]);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const savedProfile = await AsyncStorage.getItem('userProfile');
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                setProfile(parsedProfile);
                setOriginalProfile(parsedProfile);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile information');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate full name
        if (!profile.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        // Validate email
        if (!profile.email.trim()) {
            newErrors.email = 'Email address is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profile.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Validate phone (if provided)
        if (profile.phone && profile.phone.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(profile.phone.replace(/[\s\-\(\)]/g, ''))) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveProfile = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsSaving(true);
            await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
            setOriginalProfile({ ...profile });
            setHasChanges(false);
            
            Alert.alert(
                'Success',
                'Your profile has been saved successfully!',
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoPress = () => {
        Alert.alert(
            'Change Profile Photo',
            'Choose an option',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Take Photo', onPress: () => console.log('Take photo') },
                { text: 'Choose from Gallery', onPress: () => console.log('Choose from gallery') },
            ]
        );
    };

    const formatDateOfBirth = (text: string) => {
        // Remove all non-numeric characters
        const cleaned = text.replace(/\D/g, '');
        
        // Apply MM/DD/YYYY formatting
        if (cleaned.length <= 2) {
            return cleaned;
        } else if (cleaned.length <= 4) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        } else {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        }
    };

    const updateProfile = (field: keyof UserProfile, value: string) => {
        let formattedValue = value;
        
        // Apply date formatting for date of birth
        if (field === 'dateOfBirth') {
            formattedValue = formatDateOfBirth(value);
        }
        
        setProfile(prev => ({ ...prev, [field]: formattedValue }));
        
        // Clear error for this field when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.light.accentDark} />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                <Text style={styles.headerTitle}>Profile Information</Text>
                <TouchableOpacity
                    style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
                    onPress={saveProfile}
                    disabled={!hasChanges || isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
                            Save
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView 
                    style={styles.content} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Profile Photo Section */}
                    <View style={styles.photoSection}>
                        <TouchableOpacity style={styles.photoContainer} onPress={handlePhotoPress}>
                            <View style={styles.photoPlaceholder}>
                                <Ionicons 
                                    name="person" 
                                    size={40} 
                                    color={theme.colors.light.textMuted} 
                                />
                            </View>
                            <View style={styles.cameraOverlay}>
                                <Ionicons 
                                    name="camera" 
                                    size={16} 
                                    color="#FFFFFF" 
                                />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.photoLabel}>Tap to change photo</Text>
                    </View>

                    {/* Personal Information Form */}
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>

                        {/* Full Name */}
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.formInput, profile.fullName && styles.formInputFilled, errors.fullName && styles.formInputError]}
                                value={profile.fullName}
                                onChangeText={(text) => updateProfile('fullName', text)}
                                placeholder=" "
                                autoCapitalize="words"
                                returnKeyType="next"
                            />
                            <Text style={[styles.floatingLabel, profile.fullName && styles.floatingLabelActive]}>
                                Full Name
                            </Text>
                            {errors.fullName && (
                                <Text style={styles.errorText}>{errors.fullName}</Text>
                            )}
                        </View>

                        {/* Email Address */}
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.formInput, profile.email && styles.formInputFilled, errors.email && styles.formInputError]}
                                value={profile.email}
                                onChangeText={(text) => updateProfile('email', text)}
                                placeholder=" "
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                            />
                            <Text style={[styles.floatingLabel, profile.email && styles.floatingLabelActive]}>
                                Email Address
                            </Text>
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            )}
                        </View>

                        {/* Phone Number */}
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.formInput, profile.phone && styles.formInputFilled, errors.phone && styles.formInputError]}
                                value={profile.phone}
                                onChangeText={(text) => updateProfile('phone', text)}
                                placeholder=" "
                                keyboardType="phone-pad"
                                returnKeyType="next"
                            />
                            <Text style={[styles.floatingLabel, profile.phone && styles.floatingLabelActive]}>
                                Phone Number <Text style={styles.optionalText}>(Optional)</Text>
                            </Text>
                            {errors.phone && (
                                <Text style={styles.errorText}>{errors.phone}</Text>
                            )}
                        </View>

                        {/* Date of Birth */}
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.formInput, profile.dateOfBirth && styles.formInputFilled, errors.dateOfBirth && styles.formInputError]}
                                value={profile.dateOfBirth}
                                onChangeText={(text) => updateProfile('dateOfBirth', text)}
                                placeholder=" "
                                keyboardType="numeric"
                                returnKeyType="done"
                                maxLength={10}
                            />
                            <Text style={[styles.floatingLabel, profile.dateOfBirth && styles.floatingLabelActive]}>
                                Date of Birth <Text style={styles.optionalText}>(Optional)</Text>
                            </Text>
                            <Text style={styles.dateHint}>MM/DD/YYYY</Text>
                            {errors.dateOfBirth && (
                                <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                            )}
                        </View>
                    </View>

                    {/* Bottom Padding */}
                    <View style={styles.bottomPadding} />
                </ScrollView>
            </KeyboardAvoidingView>
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
    saveButton: {
        backgroundColor: theme.colors.light.accentDark,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: theme.colors.light.borderLight,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: theme.typography.weights.semibold,
    },
    saveButtonTextDisabled: {
        color: theme.colors.light.textMuted,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: theme.colors.light.textSecondary,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 32,
        paddingVertical: 20,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.light.bgSecondary,
        borderWidth: 2,
        borderColor: theme.colors.light.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.light.accentDark,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.light.bgPrimary,
    },
    photoLabel: {
        fontSize: 14,
        color: theme.colors.light.textSecondary,
        textAlign: 'center',
    },
    formSection: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.light.textPrimary,
        marginBottom: 20,
    },
    inputGroup: {
        position: 'relative',
        marginBottom: theme.spacing.lg,
    },
    formInput: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.light.bgSecondary,
        color: theme.colors.light.textPrimary,
        fontSize: theme.typography.sizes.md,
    },
    formInputFilled: {
        borderColor: theme.colors.light.bgTertiary,
    },
    formInputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    floatingLabel: {
        position: 'absolute',
        left: theme.spacing.md,
        top: 12,
        color: theme.colors.light.textMuted,
        fontSize: theme.typography.sizes.md,
        backgroundColor: theme.colors.light.bgSecondary,
        paddingHorizontal: 4,
    },
    floatingLabelActive: {
        top: -8,
        left: 12,
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.light.accentDark,
        fontWeight: theme.typography.weights.medium,
    },
    optionalText: {
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.normal,
        color: theme.colors.light.textMuted,
    },
    dateHint: {
        position: 'absolute',
        right: theme.spacing.md,
        top: 12,
        color: theme.colors.light.textMuted,
        fontSize: theme.typography.sizes.sm,
        backgroundColor: theme.colors.light.bgSecondary,
        paddingHorizontal: 4,
    },
    errorText: {
        fontSize: 14,
        color: '#ef4444',
        marginTop: 6,
        marginLeft: 4,
    },
    bottomPadding: {
        height: 40,
    },
});

export default ProfileInformationScreen;
