import { env } from "appConfig";
import Google from "next-auth/providers/google";

/**
 * Return only OAuth providers (Google) so credentials provider
 * can be defined with authorize logic in `src/lib/auth.ts`.
 */
export function getOAuthProviders() {
  const providers: any[] = [];
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET })
    );
  }
  return providers;
}

export default getOAuthProviders;
