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
            console.log('Loaded users from storage:', loadedUsers);
            // Optional: Automatically set a user based on your criteria (e.g., last logged-in user)
        };
        loadUsers();
    }, []);

    const addUser = async (newUser) => {
        newUser.id = Date.now().toString();
        newUser.expenditures = [];
        newUser.budgets = {
            Food: '',
            Transport: '',
            Utilities: '',
            Entertainment: '',
            Other: '',
        };
        const users = await getUsersFromStorage();
        users.push(newUser);
        await saveUsersToStorage(users);
        setUser(newUser); // Optionally set the newly added user as the current user
    };

    const updateBudget = async (category, amount) => {
        if (!user) return;

        const users = await getUsersFromStorage();
        const userIndex = users.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].budgets[category] = amount;
            await saveUsersToStorage(users);
            setUser(users[userIndex]); // Update the current user state
        }
    };

    const addExpenditureForUser = async (newExpenditure) => {
        if (!user) return;

        const users = await getUsersFromStorage();
        const userIndex = users.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].expenditures.push(newExpenditure);
            await saveUsersToStorage(users);
            setUser(users[userIndex]); // Update the current user state
        }
    };

    const findUserByUsernameAndPassword = async (username, password) => {
        const users = await getUsersFromStorage();
        const foundUser = users.find((user) => user.username === username && user.password === password);
        if (foundUser) setUser(foundUser); // Optionally set the found user as the current user
        return foundUser;
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            addUser,
            updateBudget,
            addExpenditureForUser,
            findUserByUsernameAndPassword,
        }}>
            {children}
        </UserContext.Provider>
    );
};
