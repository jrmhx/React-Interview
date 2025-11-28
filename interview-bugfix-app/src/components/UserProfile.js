import React, { useState, useEffect } from 'react';
import { fetchUserData } from '../utils/userUtils';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  // BUG FIXED: Originally had fetchCount in dependency array [userId, fetchCount] of this useEffect hook
  // This caused infinite loop: useEffect runs → updates fetchCount(Dep) → triggers useEffect again → infinite loop
  
  // SOLUTION: Removed fetchCount from dependencies 
  // and used functional update setFetchCount(f => f + 1) to meet the lint rules
  // This allows updating fetchCount without including it as a dependency

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setFetchCount(f => {
          console.log('Fetching user data, count:', f);
          return f+1;
        });
        
        const userData = await fetchUserData(userId);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Posts: {user.posts?.length || 0}</p>
    </div>
  );
};

export default UserProfile;