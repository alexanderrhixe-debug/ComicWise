// ═══════════════════════════════════════════════════
// GLOBAL TYPE DEFINITIONS (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "user" | "admin" | "moderator";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "user" | "admin" | "moderator";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "user" | "admin" | "moderator";
  }
}

// Extend Window interface for browser globals
declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }

  // Node.js process types
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;
      NEON_DATABASE_URL?: string;

      // Authentication
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;

      // Email
      EMAIL_SERVER_HOST?: string;
      EMAIL_SERVER_PORT?: string;
      EMAIL_SERVER_USER?: string;
      EMAIL_SERVER_PASSWORD?: string;
      EMAIL_FROM?: string;
      EMAIL_SECURE?: string;

      // OAuth
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      GITHUB_CLIENT_ID?: string;
      GITHUB_CLIENT_SECRET?: string;

      // Upload Providers
      UPLOAD_PROVIDER?: "imagekit" | "cloudinary" | "local";
      IMAGEKIT_PUBLIC_KEY?: string;
      IMAGEKIT_PRIVATE_KEY?: string;
      IMAGEKIT_URL_ENDPOINT?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;

      // Background Jobs
      QSTASH_TOKEN?: string;
      QSTASH_CURRENT_SIGNING_KEY?: string;
      QSTASH_NEXT_SIGNING_KEY?: string;
      QSTASH_URL?: string;

      // Rate Limiting
      UPSTASH_REDIS_REST_URL?: string;
      UPSTASH_REDIS_REST_TOKEN?: string;

      // App Configuration
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_APP_URL?: string;
      PORT?: string;
      HOSTNAME?: string;
    }
  }
}

export {};
