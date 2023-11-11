'use client';
import React, { useEffect, useState } from 'react';
import AuthContext from '../../service/context';
import jwt_decode from 'jwt-decode';
import Storage from '../../service/storage';
import Home from './Home';

export default function Index() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getuser = async () => {
    try {
      setIsLoading(true);
      const user = await Storage.getUser();

      if (!user) {
        setIsLoading(false);
        console.log('getuser no user:');

        return;
      }

      setUser(user);
      setIsLoading(false);
    } catch (error) {
      console.log('getuser error:', error);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          setUser,
          isLoading,
          setIsLoading,
        }}
      >
        <Home />
      </AuthContext.Provider>
    </>
  );
}
