import { useMemo } from 'react'
import { storage } from '../utils/storage'

/**
 * useSubscription
 *
 * Source of truth priority:
 *   1. `storage.getSubscription()` — written by SettingsSubscription after calling /api/subscription
 *   2. `user.company.plan`         — written at login time (may be absent / stale)
 *
 * The backend is the real enforcer; this hook is purely for UI gating.
 */
export const useSubscription = () => {
    const user = storage.getUser()

    // Live subscription data wins over login-time snapshot
    const savedSubscription = storage.getSubscription()

    const plan = useMemo(() => {
        if (savedSubscription?.plan) return savedSubscription.plan
        return user?.plan ?? user?.company?.plan ?? null
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedSubscription?.plan?.id, user?.plan?.id, user?.company?.plan?.id])

    const features = useMemo(() => plan?.features ?? {}, [plan?.id])

    // Extract new subscription flags based on Trial com Cartão changes
    // Fallback order: API explicit -> Root User Payload -> Nested Company Payload
    const subscribed = savedSubscription?.subscribed ?? user?.subscribed ?? user?.company?.subscribed ?? false
    const onTrial = savedSubscription?.on_trial ?? user?.on_trial ?? user?.company?.on_trial ?? false
    const trialEndsAt = savedSubscription?.trial_ends_at ?? user?.trial_ends_at ?? user?.company?.trial_ends_at ?? null
    const cancelled = savedSubscription?.cancelled ?? user?.cancelled ?? user?.company?.cancelled ?? false
    const trialDaysRemaining = savedSubscription?.trial_days_remaining ?? null
    const hasActiveAccess = savedSubscription?.has_active_access ?? (subscribed || onTrial)

    // When plan is null/undefined, treat as free (no active subscription)
    const isFree = !plan || plan?.slug === 'free'
    const isPro = plan?.slug === 'pro'
    const isBusiness = plan?.slug === 'business'
    const isPaid = isPro || isBusiness

    const canCreateProposal = features.max_proposals === -1 || features.max_proposals == null
    const canAddClient = features.max_clients === -1 || features.max_clients == null

    return {
        // Plan metadata
        plan,
        planName: plan?.name ?? 'Gratuito',
        planSlug: plan?.slug ?? 'free',
        isFree,
        isPro,
        isBusiness,
        isPaid,

        // Status flags for Trial com Cartão
        subscribed,
        onTrial,
        trialEndsAt,
        trialDaysRemaining,
        hasActiveAccess,
        cancelled,

        // Capacity flags (UI only — backend is the real enforcer)
        canCreateProposal,
        canAddClient,

        // Feature flags derived directly from plan.features
        canCustomizeBranding: !!features.custom_branding,
        canSetFinancialGoals: !!features.financial_goals,
        canAccessAdvancedReports: !!features.advanced_reports,
    }
}
