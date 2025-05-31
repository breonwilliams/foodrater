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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login successful!');
    }, 1500);
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
          <View style={styles.loginCard}>

            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.appIcon}>
                <Ionicons name="star" size={24} color="white" />
              </View>
              <Text style={styles.appTitle}>Food Rater</Text>
              <Text style={styles.appSubtitle}>AI-powered food health analysis</Text>
              <View style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>Instant health ratings</Text>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formStack}>
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
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.primaryButtonLoading]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.primaryButtonText}>Signing In...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <View style={styles.forgotLink}>
              <TouchableOpacity>
                <Text style={styles.forgotLinkText}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
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

            {/* Sign Up Link */}
            <View style={styles.signupPrompt}>
              <View style={styles.signupPromptRow}>
                <Text style={styles.signupPromptText}>New to Food Rater?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signupLink}>Create account</Text>
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
  loginCard: {
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
    marginBottom: 40,
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
    marginBottom: theme.spacing.lg,
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
  primaryButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  forgotLink: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  forgotLinkText: {
    color: theme.colors.light.textSecondary,
    fontSize: 13,
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
  signupPrompt: {
    alignItems: 'center',
  },
  signupPromptText: {
    color: theme.colors.light.textSecondary,
    fontSize: 13,
  },
  signupLink: {
    color: theme.colors.light.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  signupPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});