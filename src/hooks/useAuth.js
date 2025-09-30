import { useDispatch, useSelector } from 'react-redux';
import {
  isAuthenticated as selectIsAuthenticated,
  permissions as selectPermissions,
  profile as selectProfile
} from '../store/ducks/auth';

const useAuth = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);
  const permissions = useSelector(selectPermissions);

  const syncProfile = (profile) => {
    dispatch({ type: 'auth/SYNC_PROFILE', payload: profile });
  };

  return {
    isAuthenticated,
    profile,
    permissions,
    syncProfile
  };
};

export default useAuth;
