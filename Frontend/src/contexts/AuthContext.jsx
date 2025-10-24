import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logoutUser, selectAuthUser, selectAuthLoading } from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    return result;
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    return result;
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
