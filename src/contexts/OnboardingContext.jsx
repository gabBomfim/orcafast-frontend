import React, { createContext, useContext, useState, useCallback } from 'react'

const OnboardingContext = createContext()

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

export const OnboardingProvider = ({ children }) => {
  const [guestData, setGuestData] = useState({
    client: null,
    proposal: null
  })

  const updateClientData = useCallback((clientData) => {
    setGuestData(prev => ({
      ...prev,
      client: clientData
    }))
  }, [])

  const updateProposalData = useCallback((proposalData) => {
    setGuestData(prev => ({
      ...prev,
      proposal: proposalData
    }))
  }, [])

  const clearGuestData = useCallback(() => {
    setGuestData({
      client: null,
      proposal: null
    })
  }, [])

  const getGuestDataForAPI = useCallback(() => {
    return {
      guest_data: {
        ...(guestData.client && { client: guestData.client }),
        ...(guestData.proposal && { proposal: guestData.proposal })
      }
    }
  }, [guestData])

  const value = {
    guestData,
    updateClientData,
    updateProposalData,
    clearGuestData,
    getGuestDataForAPI
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}
