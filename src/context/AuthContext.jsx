import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { getMockData } from "../services/mockDataService";

// Create the actual context, so if it's auth, say authContext
const AuthContext = createContext(null);

// Use State syntax: const [initialValue, ValueChanger] = useState()
export function AuthProvider({ children }) {
  // useState
  const [mockUsers, setMockUsers] = useState(
    () => getMockData().mock_auth_users,
  );

  const [currentUser, setCurrentUser] = useState(null); // currentuser = null

  // useMemo - signin
  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      // Signin
      signIn(email, password) {
        const matchingUser = mockUsers.find(
          (user) =>
            user.email.toLowerCase() === email.trim().toLowerCase() &&
            user.password === password,
        );
        // if not the user entered then validate
        if (!matchingUser) {
          return {
            success: false,
            message: "That email or password doesn't look right",
          };
        }
        // if it's the user entered then use the changer method to change the value of current user from null to the user entererd
        setCurrentUser(matchingUser); // currentuser = Alex Rivera

        return { success: true, user: matchingUser };
      },

      // signup
      signUp({ displayName, email, password }) {
        // Check the db if the details already exists
        const emailInUse = mockUsers.some(
          (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
        );

        //   if it exists tell the user they did something wrong
        if (emailInUse) {
          return {
            success: false,
            message: "An Account with that email already exists",
          };
        }

        // create a new user
        const newUser = {
          id: crypto.randomUUID(),
          display_name: displayName.trim(),
          email: email.trim().toLowerCase(),
          password,
          plan: "free",
          time_zone: "UTC",
        };

        setMockUsers((user) => [...user, newUser]);
        setCurrentUser(newUser);

        return { success: true, user: newUser };
      },

      // Signout
      signOut() {
        setCurrentUser(null);
      },
    }),
    [currentUser, mockUsers],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// To ensure data intgrity
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };
