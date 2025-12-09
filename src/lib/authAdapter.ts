import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { account, authenticator, session, user, verificationToken } from "database/schema";
import type { Database } from "db";

export function createDrizzleAdapter(database: Database) {
  return DrizzleAdapter(database, {
    usersTable: user,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
    authenticatorsTable: authenticator,
  }) as any;
}

export default createDrizzleAdapter;
