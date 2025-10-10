import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext()

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)
  const openSidebar = () => setIsOpen(true)

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isCollapsed,
        toggleSidebar,
        closeSidebar,
        openSidebar,
        toggleCollapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
