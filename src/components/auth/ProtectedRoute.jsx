import { Navigate, Outlet } from 'react-router-dom'
import { storage } from '../../utils/storage'
import Layout from '../layout/Layout'

const ProtectedRoute = () => {
  const token = storage.getToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default ProtectedRoute
