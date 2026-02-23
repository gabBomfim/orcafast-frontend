import { useMemo } from 'react'
import { storage } from '../utils/storage'

/**
 * useSubscription
 *
 * Reads plan features from the authenticated user object stored in localStorage
 * after login. The `user.company.plan.features` object is the single source of
 * truth — the backend already validates limits server-side; this hook is purely
 * for UI gating (show/hide, lock overlays, etc.).
 */
export const useSubscription = () => {
    const user = storage.getUser()

    // Memoize so referential equality is stable across re-renders
    const plan = useMemo(() => user?.company?.plan ?? null, [user?.company?.plan?.id])
    const features = useMemo(() => plan?.features ?? {}, [plan?.id])

    const isFree = plan?.slug === 'free'
    const isPro = plan?.slug === 'pro'
    const isBusiness = plan?.slug === 'business'

    /**
     * Returns true when the user's plan allows unlimited proposals or when
     * the backend hasn't set a cap (max_proposals === -1).
     * For capped plans the backend enforces the real limit; here we just
     * prevent the UI from even offering the action when max is -1 is NOT set.
     */
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

        // Capacity flags (UI only — backend is the real enforcer)
        canCreateProposal,
        canAddClient,

        // Feature flags derived directly from plan.features
        canCustomizeBranding: !!features.custom_branding,
        canSetFinancialGoals: !!features.financial_goals,
        canAccessAdvancedReports: !!features.advanced_reports,
    }
}
