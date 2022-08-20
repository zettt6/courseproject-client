const { Navigate, Outlet } = require('react-router-dom')

export const ProtectedRoute = ({ isAllowed, redirectPath, children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}
