import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/navigation';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const navigation = useNavigation<SignUpScreenNavigationProp>();

    const handleSignUp = () => {
        setIsLoading(true);
        // Simulate sign up process
        setTimeout(() => {
            setIsLoading(false);
            console.log('Sign up successful!');
        }, 1500);
    };

    const navigateToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Background Wave Effect */}
                    <View style={styles.backgroundWave} />

                    {/* Main Card */}
                    <View style={styles.signUpCard}>

                        {/* Logo Section */}
                        <View style={styles.logoSection}>
                            <View style={styles.appIcon}>
                                <Ionicons name="star" size={24} color="white" />
                            </View>
                            <Text style={styles.appTitle}>Join Food Rater</Text>
                            <Text style={styles.appSubtitle}>Start your healthy eating journey</Text>
                            <View style={styles.featureBadge}>
                                <Text style={styles.featureBadgeText}>Free to start</Text>
                            </View>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formStack}>
                            {/* Full Name Input */}
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={[styles.formInput, fullName && styles.formInputFilled]}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder=" "
                                    autoCapitalize="words"
                                />
                                <Text style={[styles.floatingLabel, fullName && styles.floatingLabelActive]}>
                                    Full Name
                                </Text>
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={[styles.formInput, email && styles.formInputFilled]}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder=" "
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <Text style={[styles.floatingLabel, email && styles.floatingLabelActive]}>
                                    Email address
                                </Text>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={[styles.formInput, password && styles.formInputFilled]}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder=" "
                                    secureTextEntry={!showPassword}
                                />
                                <Text style={[styles.floatingLabel, password && styles.floatingLabelActive]}>
                                    Password
                                </Text>
                                <TouchableOpacity
                                    style={styles.inputIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={16}
                                        color={theme.colors.light.textTertiary}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password Input */}
                            <View style={styles.inputGroup}>
                                <TextInput
                                    style={[styles.formInput, confirmPassword && styles.formInputFilled]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder=" "
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <Text style={[styles.floatingLabel, confirmPassword && styles.floatingLabelActive]}>
                                    Confirm Password
                                </Text>
                                <TouchableOpacity
                                    style={styles.inputIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off" : "eye"}
                                        size={16}
                                        color={theme.colors.light.textTertiary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Terms Agreement */}
                        <TouchableOpacity
                            style={styles.termsRow}
                            onPress={() => setAgreeToTerms(!agreeToTerms)}
                        >
                            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                                {agreeToTerms && (
                                    <Ionicons name="checkmark" size={12} color="white" />
                                )}
                            </View>
                            <Text style={styles.termsText}>
                                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                                <Text style={styles.termsLink}>Privacy Policy</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                isLoading && styles.primaryButtonLoading,
                                !agreeToTerms && styles.primaryButtonDisabled
                            ]}
                            onPress={handleSignUp}
                            disabled={isLoading || !agreeToTerms}
                        >
                            {isLoading ? (
                                <Text style={styles.primaryButtonText}>Creating Account...</Text>
                            ) : (
                                <Text style={styles.primaryButtonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or sign up with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Buttons */}
                        <View style={styles.socialGrid}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialButtonText}>Facebook</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Link */}
                        <View style={styles.loginPrompt}>
                            <View style={styles.loginPromptRow}>
                                <Text style={styles.loginPromptText}>Already have an account?</Text>
                                <TouchableOpacity onPress={navigateToLogin}>
                                    <Text style={styles.loginLink}>Sign in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
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
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: theme.spacing.md,
    },
    backgroundWave: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: theme.colors.light.bgTertiary,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        transform: [{ scaleX: 1.1 }],
    },
    signUpCard: {
        backgroundColor: theme.colors.light.bgSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        marginHorizontal: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 25,
        elevation: 5,
        zIndex: 1,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    appIcon: {
        width: 48,
        height: 48,
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.light.accentDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 3,
    },
    appTitle: {
        fontSize: theme.typography.sizes.xxxl,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.light.textPrimary,
        marginBottom: 4,
    },
    appSubtitle: {
        fontSize: theme.typography.sizes.md,
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.normal,
    },
    featureBadge: {
        backgroundColor: theme.colors.light.accentYellow,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 4,
    },
    featureBadgeText: {
        fontSize: 11,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.light.accentDark,
    },
    formStack: {
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    inputGroup: {
        position: 'relative',
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
    inputIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
        padding: 4,
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.lg,
        gap: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: theme.colors.light.borderLight,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: theme.colors.light.accentDark,
        borderColor: theme.colors.light.accentDark,
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        color: theme.colors.light.textSecondary,
        lineHeight: 18,
    },
    termsLink: {
        color: theme.colors.light.accentDark,
        fontWeight: theme.typography.weights.medium,
    },
    primaryButton: {
        backgroundColor: theme.colors.light.accentDark,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: 12,
        paddingHorizontal: theme.spacing.md,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    primaryButtonLoading: {
        opacity: 0.7,
    },
    primaryButtonDisabled: {
        backgroundColor: theme.colors.light.textMuted,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.medium,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.light.borderLight,
    },
    dividerText: {
        paddingHorizontal: theme.spacing.md,
        color: theme.colors.light.textMuted,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
        backgroundColor: theme.colors.light.bgSecondary,
    },
    socialGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: theme.spacing.lg,
    },
    socialButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.light.borderLight,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.light.bgSecondary,
        alignItems: 'center',
    },
    socialButtonText: {
        color: theme.colors.light.textSecondary,
        fontSize: 13,
        fontWeight: theme.typography.weights.medium,
    },
    loginPrompt: {
        alignItems: 'center',
    },
    loginPromptText: {
        color: theme.colors.light.textSecondary,
        fontSize: 13,
    },
    loginLink: {
        color: theme.colors.light.textSecondary,
        fontWeight: theme.typography.weights.medium,
    },
    loginPromptRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});