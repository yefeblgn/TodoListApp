import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAPI } from '../utils/process';

export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  total_tasks: number;
}

interface UserContextProps {
  user: User | null;
  loadUser: () => Promise<void>;
  updateUser: (username?: string, oldPassword?: string, newPassword?: string, profile_picture?: string) => Promise<void>;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  loadUser: async () => {},
  updateUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        console.log('Kullanıcı bilgisi bulunamadı.');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const response = await UserAPI.getUserData(parsedUser.id);

      if (response.success) {
        setUser(response.user);
      } else {
        console.error('Kullanıcı yükleme hatası:', response.error);
      }
    } catch (error) {
      console.error('Kullanıcı verisi yüklenirken hata oluştu:', error);
    }
  };

  const updateUser = async (username?: string, oldPassword?: string, newPassword?: string, profile_picture?: string) => {
    if (!user) return;

    try {
      let updateResponse;

      if (username) {
        updateResponse = await UserAPI.updateUsername(user.id, user.email, username);
        if (updateResponse.success) {
          setUser((prevUser) => prevUser ? { ...prevUser, username } : null);
        } else {
          console.error('Kullanıcı adı güncelleme hatası:', updateResponse.error);
        }
      }

      if (oldPassword && newPassword) {
        updateResponse = await UserAPI.updatePassword(user.id, user.email, oldPassword, newPassword);
        if (!updateResponse.success) {
          console.error('Şifre güncelleme hatası:', updateResponse.error);
        }
      }

      if (profile_picture) {
        updateResponse = await UserAPI.updateProfile(user.id, username || user.username, undefined, profile_picture);
        if (updateResponse.success) {
          setUser((prevUser) => prevUser ? { ...prevUser, profile_picture } : null);
        } else {
          console.error('Profil resmi güncelleme hatası:', updateResponse.error);
        }
      }

      if (updateResponse?.success) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loadUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
