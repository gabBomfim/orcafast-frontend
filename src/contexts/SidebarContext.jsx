import { createContext, useContext, useState, useEffect } from 'react'
import { useMediaQuery } from '@chakra-ui/react'

const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false)
    }
  }, [isMobile])

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)

  const value = {
    isCollapsed,
    toggleCollapse,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    isMobile,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
