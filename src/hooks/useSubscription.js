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
        return user?.company?.plan ?? null
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedSubscription?.plan?.id, user?.company?.plan?.id])

    const features = useMemo(() => plan?.features ?? {}, [plan?.id])

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

        // Capacity flags (UI only — backend is the real enforcer)
        canCreateProposal,
        canAddClient,

        // Feature flags derived directly from plan.features
        canCustomizeBranding: !!features.custom_branding,
        canSetFinancialGoals: !!features.financial_goals,
        canAccessAdvancedReports: !!features.advanced_reports,
    }
}
