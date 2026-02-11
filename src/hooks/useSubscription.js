import { storage } from '../utils/storage'

export const useSubscription = () => {
    const user = storage.getUser()
    const plan = user?.company?.plan
    const features = plan?.features || {}

    const isFree = plan?.slug === 'free'
    const isPro = plan?.slug === 'pro'
    const isBusiness = plan?.slug === 'business'

    const getUsage = () => {
        if (!user) return { proposals: 0, clients: 0, users: 0 }

        // Calculate total proposals across all clients
        const totalProposals = user.clients?.reduce((acc, client) => {
            return acc + (client.proposals?.length || 0)
        }, 0) || 0

        return {
            proposals: totalProposals,
            clients: user.clients?.length || 0,
            // Assuming users count comes from somewhere else or just 1 for now if not populated
            users: 1
        }
    }

    const usage = getUsage()

    const canCreateProposal = () => {
        if (features.max_proposals === -1) return true
        return usage.proposals < features.max_proposals
    }

    const canAddClient = () => {
        if (features.max_clients === -1) return true
        return usage.clients < features.max_clients
    }

    const canAddUser = () => {
        if (features.max_users === -1) return true
        // TODO: Implement user counting logic when available
        return true
    }

    return {
        plan,
        features,
        isFree,
        isPro,
        isBusiness,
        usage,
        canCreateProposal,
        canAddClient,
        canAddUser,
        canCustomizeBranding: features.custom_branding,
        canSetFinancialGoals: features.financial_goals,
        canAccessAdvancedReports: features.advanced_reports
    }
}
