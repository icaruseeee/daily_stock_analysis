import type React from 'react';
import { useState, useEffect } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button, Input } from '../components/common';
import { UiLanguageToggle } from '../components/i18n/UiLanguageToggle';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ParsedApiError } from '../api/error';
import { isParsedApiError } from '../api/error';
import { useAuth } from '../hooks';
import { useUiLanguage } from '../contexts/UiLanguageContext';
import { SettingsAlert } from '../components/settings';

const LoginPage: React.FC = () => {
  const { login, passwordSet, setupState } = useAuth();
  const { t } = useUiLanguage();
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = t('login.pageTitle');
  }, [t]);
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect') ?? '';
  const redirect =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | ParsedApiError | null>(null);

  const isFirstTime = setupState === 'no_password' || !passwordSet;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isFirstTime && password !== passwordConfirm) {
      setError(t('login.passwordMismatch'));
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await login(password, isFirstTime ? passwordConfirm : undefined);
      if (result.success) {
        navigate(redirect, { replace: true });
      } else {
        setError(result.error ?? t('login.loginFailed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-surface-2 py-12 sm:px-6 lg:px-8">
      {/* Language toggle */}
      <div className="absolute right-4 top-4 z-30">
        <UiLanguageToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-display-md font-semibold leading-[1.47] tracking-[-0.374px]">
            Daily Stock
          </h2>
          <h3 className="mt-1 text-tagline font-semibold leading-[1.19] text-ink-muted">
            Analysis Engine
          </h3>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-divider bg-surface px-3 py-1 text-fine-print font-medium text-ink-muted">
            V3.X QUANTITATIVE SYSTEM
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-lg border border-divider bg-surface p-8">
          <div className="mb-8">
            <h1 className="flex items-center gap-2 text-tagline font-semibold">
              {isFirstTime ? (
                <>
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <span>{t('login.setupTitle')}</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 text-accent" />
                  <span>{t('login.adminLogin')}</span>
                </>
              )}
            </h1>
            <p className="mt-2 text-body-sm text-ink-muted">
              {isFirstTime
                ? t('login.setupDescription')
                : t('login.loginDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                id="password"
                type="password"
                allowTogglePassword
                iconType="password"
                label={isFirstTime ? t('login.adminPassword') : t('login.loginPassword')}
                placeholder={isFirstTime ? t('login.setupPasswordPlaceholder') : t('login.loginPasswordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoFocus
                autoComplete={isFirstTime ? 'new-password' : 'current-password'}
              />

              {isFirstTime && (
                <Input
                  id="passwordConfirm"
                  type="password"
                  allowTogglePassword
                  iconType="password"
                  label={t('login.confirmPassword')}
                  placeholder={t('login.confirmPasswordPlaceholder')}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
              )}
            </div>

            {error && (
              <SettingsAlert
                title={isFirstTime ? t('login.setupFailed') : t('login.validationFailed')}
                message={isParsedApiError(error) ? error.message : error}
                variant="error"
              />
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingText={isFirstTime ? t('login.setupSubmitting') : t('login.loginSubmitting')}
            >
              {isFirstTime ? t('login.setupSubmit') : t('login.loginSubmit')}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-caption text-ink-muted">
          Secure Connection &middot; DSA V3
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
