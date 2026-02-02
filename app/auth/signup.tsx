import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAuthContext } from '@/contexts/AuthContext';

export default function SignUpScreen() {
  const { signUp, loading } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    number: /\d/.test(password),
    letter: /[a-zA-Z]/.test(password),
  };

  const isPasswordValid = passwordChecks.length && passwordChecks.number && passwordChecks.letter;

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Check size={48} color={theme.colors.status.success} />
          </View>
          <Text style={styles.successTitle}>Check your email!</Text>
          <Text style={styles.successText}>
            We've sent a confirmation link to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          <Text style={styles.successSubtext}>
            Click the link in the email to verify your account, then come back and sign in.
          </Text>
          <Pressable
            onPress={() => router.replace('/auth/login')}
            style={styles.backToLoginButton}
          >
            <Text style={styles.backToLoginText}>Back to Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.text.primary} />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the community</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Mail size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.text.muted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Lock size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.text.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.colors.text.muted} />
                ) : (
                  <Eye size={20} color={theme.colors.text.muted} />
                )}
              </Pressable>
            </View>

            {/* Password Requirements */}
            {password.length > 0 && (
              <View style={styles.requirements}>
                <PasswordCheck label="At least 8 characters" valid={passwordChecks.length} />
                <PasswordCheck label="Contains a number" valid={passwordChecks.number} />
                <PasswordCheck label="Contains a letter" valid={passwordChecks.letter} />
              </View>
            )}

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Lock size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.text.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
            </View>

            {/* Error Message */}
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            {/* Sign Up Button */}
            <Pressable
              onPress={handleSignUp}
              disabled={loading}
              style={styles.signUpButton}
            >
              <LinearGradient
                colors={[theme.colors.pillars.iron.primary, theme.colors.pillars.snap.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                    <ArrowRight size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Terms */}
          <Text style={styles.terms}>
            By signing up, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PasswordCheck = ({ label, valid }: { label: string; valid: boolean }) => (
  <View style={styles.checkRow}>
    <View style={[styles.checkIcon, valid && styles.checkIconValid]}>
      {valid && <Check size={12} color="#fff" />}
    </View>
    <Text style={[styles.checkLabel, valid && styles.checkLabelValid]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 24,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text.secondary,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  eyeButton: {
    padding: 4,
  },
  requirements: {
    gap: 8,
    paddingLeft: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconValid: {
    backgroundColor: theme.colors.status.success,
  },
  checkLabel: {
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  checkLabelValid: {
    color: theme.colors.status.success,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: 14,
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  terms: {
    marginTop: 24,
    textAlign: 'center',
    color: theme.colors.text.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: theme.colors.pillars.path.primary,
  },
  // Success state
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.status.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  successSubtext: {
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  backToLoginButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  backToLoginText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});
