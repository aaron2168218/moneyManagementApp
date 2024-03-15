import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

async function getUsersFromStorage() {
    const usersString = await AsyncStorage.getItem('usersStore');
    return usersString ? JSON.parse(usersString) : [];
}

async function saveUsersToStorage(users) {
    await AsyncStorage.setItem('usersStore', JSON.stringify(users));
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            const loadedUsers = await getUsersFromStorage();
            if (loadedUsers.length) {
                console.log('Loaded users from storage:', loadedUsers);
                setUser(loadedUsers[0]);
            }
        };
        loadUsers();
    }, []);

    const addUser = async (newUser) => {
        const users = await getUsersFromStorage();
        newUser.id = Date.now().toString();
        newUser.expenditures = [];
        newUser.budgets = { Food: '', Transport: '', Utilities: '', Entertainment: '', Other: '' };
        users.push(newUser);
        await saveUsersToStorage(users);
        setUser(newUser); // Set the newly added user as current user
    };

    const updateBudget = async (userId, category, amount) => {
        const users = await getUsersFromStorage();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users[userIndex].budgets[category] = amount;
            await saveUsersToStorage(users);
            // Update the local user state if the updated user is the current user
            if (user?.id === userId) {
                setUser({ ...users[userIndex] });
            }
            console.log(`Budget for ${category} updated to ${amount} for user ${userId}`);
        } else {
            console.log(`User with ID ${userId} not found.`);
        }
    };

    const addExpenditureForUser = async (newExpenditure) => {
        if (!user) return;
        const users = await getUsersFromStorage();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].expenditures.push(newExpenditure);
            await saveUsersToStorage(users);
            setUser({ ...users[userIndex] }); // Update context with modified user
        }
    };

    const findUserByUsernameAndPassword = async (username, password) => {
        const users = await getUsersFromStorage();
        const foundUser = users.find(user => user.username === username && user.password === password);
        if (foundUser) {
            setUser(foundUser); // Set found user as current user
            return foundUser;
        }
    };

    const deleteExpenditureForUser = async (expenditureId) => {
        if (!user) return;
        const users = await getUsersFromStorage();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          // Filter out the expenditure to delete
          users[userIndex].expenditures = users[userIndex].expenditures.filter(expense => expense.id !== expenditureId);
          await saveUsersToStorage(users);
          setUser({ ...users[userIndex] }); // Update context with modified user
        }
      };
      

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            addUser,
            updateBudget,
            addExpenditureForUser,
            findUserByUsernameAndPassword,
            deleteExpenditureForUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};
