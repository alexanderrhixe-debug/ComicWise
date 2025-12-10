import { env } from "appConfig";
import type { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
/**
 * Return only OAuth providers (Google) so credentials provider
 * can be defined with authorize logic in `src/lib/auth.ts`.
 */
export function getOAuthProviders(): Provider[] {
  const providers: Provider[] = [];
  if (
    env.AUTH_GOOGLE_CLIENT_ID &&
    env.AUTH_GOOGLE_CLIENT_SECRET &&
    env.AUTH_GITHUB_CLIENT_ID &&
    env.AUTH_GITHUB_CLIENT_SECRET
  ) {
    providers.push(
      GitHub({
        clientId: env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
      }),
      Google({ clientId: env.AUTH_GOOGLE_CLIENT_ID, clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET })
    );
  }
  return providers;
}

export default getOAuthProviders;
