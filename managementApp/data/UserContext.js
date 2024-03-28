// I used useCallBack hook and I got the idea of how to do it from this link:
//www.youtube.com/watch?v=4Cf86qVEIJY
// This is the youtube video I used to give me an idea of how to use Query in React native
//www.youtube.com/watch?v=8K1N3fE-cDs
//www.youtube.com/watch?v=XD0KYYQIlVA - This is in Hindi

import React, {
  useCallback,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

async function getUsersFromStorage() {
  const usersString = await AsyncStorage.getItem("usersStore");
  return usersString ? JSON.parse(usersString) : [];
}

async function saveUsersToStorage(users) {
  await AsyncStorage.setItem("usersStore", JSON.stringify(users));
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await getUsersFromStorage();
      if (loadedUsers.length) {
        console.log("Loaded users from storage:", loadedUsers);
        setUser(loadedUsers[0]);
      }
    };
    loadUsers();
  }, []);

  const updateUser = useCallback(async (updatedUser) => {
    setUser(updatedUser);
    const users = await getUsersFromStorage();
    const userIndex = users.findIndex((u) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser; // This updates the user details
      await saveUsersToStorage(users); // It then save the updated user array to storage
      console.log("User updated successfully:", updatedUser);
    } else {
      console.log("User not found.");
    }
  });

  const logout = () => {
    setUser(null);
    console.log("User logged out successfully");
  };

  const addUser = async (newUser) => {
    const users = await getUsersFromStorage();
    newUser.id = Date.now().toString();
    newUser.expenditures = [];
    newUser.budgets = {
      Food: "",
      Transport: "",
      Utilities: "",
      Entertainment: "",
      Other: "",
    };
    users.push(newUser);
    await saveUsersToStorage(users);
    setUser(newUser); // Set the newly added user as current user
  };

  const updateBudget = async (userId, category, amount) => {
    const users = await getUsersFromStorage();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].budgets[category] = amount;
      await saveUsersToStorage(users);
      // Update the local user state if the updated user is the current user
      if (user?.id === userId) {
        setUser({ ...users[userIndex] });
      }
      console.log(
        `Budget for ${category} updated to ${amount} for user ${userId}`
      );
    } else {
      console.log(`User with ID ${userId} not found.`);
    }
  };

  const addExpenditureForUser = async (newExpenditure) => {
    if (!user) return;
    const users = await getUsersFromStorage();
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].expenditures.push(newExpenditure);
      await saveUsersToStorage(users);
      setUser({ ...users[userIndex] }); // Update context with modified user
    }
  };

  const findUserByUsernameAndPassword = async (username, password) => {
    const users = await getUsersFromStorage();
    const foundUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (foundUser) {
      setUser(foundUser); // Set found user as current user
      return foundUser;
    }
  };

  const deleteExpenditureForUser = async (expenditureId) => {
    if (!user) return;
    const users = await getUsersFromStorage();
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      // Filter out the expenditure to delete
      users[userIndex].expenditures = users[userIndex].expenditures.filter(
        (expense) => expense.id !== expenditureId
      );
      await saveUsersToStorage(users);
      setUser({ ...users[userIndex] }); // Update context with modified user
    }
  };

  const updateExpenditureForUser = async (userId, updatedExpenditure) => {
    const users = await getUsersFromStorage();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      const expenditureIndex = users[userIndex].expenditures.findIndex(
        (ex) => ex.id === updatedExpenditure.id
      );
      if (expenditureIndex !== -1) {
        users[userIndex].expenditures[expenditureIndex] = updatedExpenditure;
        await saveUsersToStorage(users);
        // Update the local user state if the updated expenditure is for the current user
        if (user?.id === userId) {
          setUser({ ...users[userIndex] });
        }
        console.log("Expenditure updated successfully:", updatedExpenditure);
      } else {
        console.log("Expenditure not found.");
      }
    } else {
      console.log("User not found.");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
        addUser,
        updateBudget,
        addExpenditureForUser,
        findUserByUsernameAndPassword,
        deleteExpenditureForUser,
        updateExpenditureForUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
