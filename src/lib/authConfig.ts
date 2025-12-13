// Use `unknown` for the exported options to avoid coupling to a specific auth package type
import { env } from "appConfig"
import type { Provider } from "next-auth/providers"
import EmailProvider from "next-auth/providers/email"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { adapter } from "src/lib/authAdapter"

type MutableAuthOptions = {
  adapter?: unknown
  session?: { strategy?: string }
  providers: Provider[]
  secret?: string | undefined
}

export const authOptions: MutableAuthOptions = {
  adapter,
  session: { strategy: "database" },
  providers: [],
  secret: env.AUTH_SECRET,
}

// Configure providers dynamically so missing env vars don't break builds
if (env.EMAIL_SERVER_HOST && env.EMAIL_SERVER_PORT) {
  authOptions.providers.push(
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER || undefined,
          pass: env.EMAIL_SERVER_PASSWORD || undefined,
        },
        // `secure` can be a boolean or undefined depending on env parsing
        secure: Boolean(env.EMAIL_SECURE),
      },
      from: env.EMAIL_FROM as string | undefined,
    }) as unknown as Provider
  )
}

// export default authOptions;
/**
 * Return only OAuth providers (Google) so credentials provider
 * can be defined with authorize logic in `src/lib/auth.ts`.
 */
export function getOAuthProviders(): Provider[] {
  const providers: Provider[] = []
  if (env.AUTH_GITHUB_CLIENT_ID && env.AUTH_GITHUB_CLIENT_SECRET) {
    providers.push(
      GitHub({
        clientId: env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
      }) as unknown as Provider
    )
  }

  if (env.AUTH_GOOGLE_CLIENT_ID && env.AUTH_GOOGLE_CLIENT_SECRET) {
    providers.push(
      Google({
        clientId: env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
      }) as unknown as Provider
    )
  }

  // Append OAuth providers to authOptions.providers so NextAuth sees them
  authOptions.providers = authOptions.providers.concat(providers)

  return providers
}

export default getOAuthProviders
