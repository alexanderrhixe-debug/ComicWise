import type { Adapter } from "@auth/core/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { account, authenticator, session, user, verificationToken } from "database/schema";
import type { Database } from "db";
export function createDrizzleAdapter(database: Database): Adapter {
  // Initialize the standard Drizzle adapter with your database instance and schema
  const standardAdapter = DrizzleAdapter(database, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
    authenticatorsTable: authenticator,
  });
  return {
    ...standardAdapter,
    /**
     * Override the `createUser` method to include the custom field logic.
     */
    async createUser(user: any) {
      // Add custom logic here, e.g., generating a default username
      // If you need to persist custom fields, do so separately after creation
      if (!standardAdapter.createUser) {
        throw new Error("standardAdapter.createUser is not available");
      }
      const createdUser = await standardAdapter.createUser(user);
      // Optionally, update role or other custom fields here if needed
      return createdUser;
    },

    /**
     * Override the `updateUser` method if needed for custom fields.
     */
    async updateUser(user: any) {
      // You can add logic to handle updates to the 'username' field here
      if (!standardAdapter.updateUser) {
        throw new Error("standardAdapter.updateUser is not available");
      }
      const updatedUser = await standardAdapter.updateUser(user);
      return updatedUser;
    },

    // You can override other methods like `getUser` or `getSessionAndUser`
    // to ensure they return the custom fields correctly if necessary.
  };
}

export default createDrizzleAdapter;
