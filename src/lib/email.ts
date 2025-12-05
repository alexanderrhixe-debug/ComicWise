// ═══════════════════════════════════════════════════
// EMAIL SERVICE - Send Emails with React Email Templates
// ═══════════════════════════════════════════════════

import { render } from "@react-email/components";
import nodemailer from "nodemailer";

import { appConfig } from "@/app-config";

// Import email templates
import AccountUpdatedEmail from "@/components/emails/AccountUpdatedEmail";
import CommentNotificationEmail from "@/components/emails/CommentNotificationEmail";
import NewChapterEmail from "@/components/emails/NewChapterEmail";
import PasswordResetEmail from "@/components/emails/PasswordResetEmail";
import VerificationEmail from "@/components/emails/VerificationEmail";
import WelcomeEmail from "@/components/emails/WelcomeEmail";

// ═══════════════════════════════════════════════════
// NODEMAILER TRANSPORTER SETUP
// ═══════════════════════════════════════════════════

const transporter = nodemailer.createTransport({
  host: appConfig.email.host,
  port: appConfig.email.port,
  secure: appConfig.email.secure,
  auth: {
    user: appConfig.email.user,
    pass: appConfig.email.password,
  },
});

// Verify transporter configuration
if (appConfig.email.enabled) {
  transporter
    .verify()
    .then(() => {
      console.log("✅ Email server is ready to send messages");
    })
    .catch((error) => {
      console.error("❌ Email transporter verification failed:", error);
    });
}

// ═══════════════════════════════════════════════════
// EMAIL SENDING FUNCTIONS
// ═══════════════════════════════════════════════════

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using configured transporter
 */
async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!appConfig.email.enabled) {
    console.warn("⚠️ Email feature is disabled. Skipping email send.");
    return { success: false, error: "Email feature is disabled" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${appConfig.name}" <${appConfig.email.from}>`,
      to,
      subject,
      html,
      text: text || undefined,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

// ═══════════════════════════════════════════════════
// TEMPLATE-SPECIFIC EMAIL FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(params: { name: string; email: string }) {
  const html = await render(WelcomeEmail({ name: params.name, email: params.email }));

  return sendEmail({
    to: params.email,
    subject: `Welcome to ${appConfig.name}! 🎉`,
    html,
  });
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(params: {
  name: string;
  email: string;
  verificationToken: string;
}) {
  const html = await render(
    VerificationEmail({
      name: params.name,
      email: params.email,
      token: params.verificationToken,
    })
  );

  return sendEmail({
    to: params.email,
    subject: `Verify your ${appConfig.name} email address`,
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  name: string;
  email: string;
  resetToken: string;
  ipAddress?: string;
}) {
  const html = await render(
    PasswordResetEmail({
      name: params.name,
      email: params.email,
      token: params.resetToken,
    })
  );

  return sendEmail({
    to: params.email,
    subject: `Reset your ${appConfig.name} password`,
    html,
  });
}

/**
 * Send account updated notification
 */
export async function sendAccountUpdatedEmail(params: {
  name: string;
  email: string;
  changeType: "password" | "email" | "profile";
  changeDetails?: string;
  ipAddress?: string;
}) {
  const html = await render(
    AccountUpdatedEmail({
      userName: params.name,
      userEmail: params.email,
      changeType: params.changeType,
      changeDetails: params.changeDetails,
      ipAddress: params.ipAddress,
    })
  );

  return sendEmail({
    to: params.email,
    subject: `Your ${appConfig.name} account has been updated`,
    html,
  });
}

/**
 * Send new chapter notification
 */
export async function sendNewChapterEmail(params: {
  userName: string;
  userEmail: string;
  comicTitle: string;
  comicCoverUrl: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterSlug: string;
  releaseDate: string;
}) {
  const chapterUrl = `${appConfig.url}/read/${params.chapterSlug}`;

  const html = await render(
    NewChapterEmail({
      userName: params.userName,
      userEmail: params.userEmail,
      comicTitle: params.comicTitle,
      comicCoverUrl: params.comicCoverUrl,
      chapterNumber: params.chapterNumber,
      chapterTitle: params.chapterTitle,
      chapterUrl,
      releaseDate: params.releaseDate,
    })
  );

  return sendEmail({
    to: params.userEmail,
    subject: `New chapter of ${params.comicTitle} is available!`,
    html,
  });
}

/**
 * Send comment notification
 */
export async function sendCommentNotificationEmail(params: {
  userName: string;
  userEmail: string;
  commenterName: string;
  commenterAvatar?: string;
  commentText: string;
  comicTitle: string;
  chapterNumber?: number;
  commentId: string;
  commentType: "reply" | "mention" | "new";
}) {
  const commentUrl = `${appConfig.url}/comic/${params.comicTitle}#comment-${params.commentId}`;

  const html = await render(
    CommentNotificationEmail({
      userName: params.userName,
      userEmail: params.userEmail,
      commenterName: params.commenterName,
      commenterAvatar: params.commenterAvatar,
      commentText: params.commentText,
      comicTitle: params.comicTitle,
      chapterNumber: params.chapterNumber,
      commentUrl,
      commentType: params.commentType,
    })
  );

  const getSubject = () => {
    switch (params.commentType) {
      case "reply":
        return `${params.commenterName} replied to your comment`;
      case "mention":
        return `${params.commenterName} mentioned you in a comment`;
      case "new":
        return `New comment on ${params.comicTitle}`;
      default:
        return "New activity on ComicWise";
    }
  };

  return sendEmail({
    to: params.userEmail,
    subject: getSubject(),
    html,
  });
}

// ═══════════════════════════════════════════════════
// BATCH EMAIL FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Send email to multiple recipients (for notifications)
 */
export async function sendBulkEmails(
  recipients: string[],
  emailGenerator: (email: string) => Promise<SendEmailOptions>
) {
  if (!appConfig.features.email) {
    console.warn("⚠️ Email feature is disabled. Skipping bulk email send.");
    return { success: false, error: "Email feature is disabled" };
  }

  const results = await Promise.allSettled(
    recipients.map(async (email) => {
      const emailOptions = await emailGenerator(email);
      return sendEmail(emailOptions);
    })
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`📧 Bulk email results: ${successful} sent, ${failed} failed`);

  return {
    success: failed === 0,
    results: {
      total: recipients.length,
      successful,
      failed,
    },
  };
}

// ═══════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════

export const emailService = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAccountUpdatedEmail,
  sendNewChapterEmail,
  sendCommentNotificationEmail,
  sendBulkEmails,
};

export default emailService;
