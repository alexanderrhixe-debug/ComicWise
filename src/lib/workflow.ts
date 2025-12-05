/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

// ═══════════════════════════════════════════════════
// COMPREHENSIVE WORKFLOW SYSTEM (Next.js 16)
// ═══════════════════════════════════════════════════

import { z } from "zod";

import { appConfig } from "app-config";

import emailService from "./email";
import { checkRateLimit } from "./ratelimit";

// ═══════════════════════════════════════════════════
// WORKFLOW TYPES & SCHEMAS
// ═══════════════════════════════════════════════════

export type WorkflowType =
  | "user.welcome"
  | "user.verification"
  | "user.password-reset"
  | "user.account-updated"
  | "user.account-deleted"
  | "comic.created"
  | "comic.updated"
  | "comic.deleted"
  | "chapter.created"
  | "chapter.updated"
  | "chapter.deleted"
  | "bookmark.created"
  | "bookmark.reminder"
  | "comment.created"
  | "comment.reply"
  | "admin.notification";

export interface WorkflowPayload {
  type: WorkflowType;
  data: Record<string, any>;
  recipientEmail: string;
  recipientName?: string;
  metadata?: Record<string, any>;
}

const workflowPayloadSchema = z.object({
  type: z.enum([
    "user.welcome",
    "user.verification",
    "user.password-reset",
    "user.account-updated",
    "user.account-deleted",
    "comic.created",
    "comic.updated",
    "comic.deleted",
    "chapter.created",
    "chapter.updated",
    "chapter.deleted",
    "bookmark.created",
    "bookmark.reminder",
    "comment.created",
    "comment.reply",
    "admin.notification",
  ]),
  data: z.record(z.string(), z.any()),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// ═══════════════════════════════════════════════════
// WORKFLOW EXECUTION ENGINE
// ═══════════════════════════════════════════════════

export async function executeWorkflow(payload: WorkflowPayload) {
  try {
    // Validate payload
    const validatedPayload = workflowPayloadSchema.parse(payload);

    // Rate limiting for email workflows
    const rateLimitKey = `workflow:${validatedPayload.recipientEmail}`;
    const rateLimitResult = checkRateLimit(rateLimitKey, appConfig.rateLimit.email);

    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for workflow: ${validatedPayload.type}`);
      return {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
        retryAfter: new Date(rateLimitResult.resetAt),
      };
    }

    // Execute workflow based on type
    const result = await routeWorkflow(validatedPayload);

    return result;
  } catch (error) {
    console.error("Workflow execution error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Workflow execution failed",
    };
  }
}

// ═══════════════════════════════════════════════════
// WORKFLOW ROUTER
// ═══════════════════════════════════════════════════

async function routeWorkflow(payload: WorkflowPayload) {
  switch (payload.type) {
    // User workflows
    case "user.welcome":
      return await sendWelcomeEmail(payload);
    case "user.verification":
      return await sendVerificationEmail(payload);
    case "user.password-reset":
      return await sendPasswordResetEmail(payload);
    case "user.account-updated":
      return await sendAccountUpdatedEmail(payload);
    case "user.account-deleted":
      return await sendAccountDeletedEmail(payload);

    // Comic workflows
    case "comic.created":
      return await sendComicCreatedNotification(payload);
    case "comic.updated":
      return await sendComicUpdatedNotification(payload);
    case "comic.deleted":
      return await sendComicDeletedNotification(payload);

    // Chapter workflows
    case "chapter.created":
      return await sendChapterCreatedNotification(payload);
    case "chapter.updated":
      return await sendChapterUpdatedNotification(payload);
    case "chapter.deleted":
      return await sendChapterDeletedNotification(payload);

    // Bookmark workflows
    case "bookmark.created":
      return await sendBookmarkCreatedNotification(payload);
    case "bookmark.reminder":
      return await sendBookmarkReminder(payload);

    // Comment workflows
    case "comment.created":
      return await sendCommentNotification(payload);
    case "comment.reply":
      return await sendCommentReplyNotification(payload);

    // Admin workflows
    case "admin.notification":
      return await sendAdminNotification(payload);

    default:
      throw new Error(`Unknown workflow type: ${payload.type}`);
  }
}

// ═══════════════════════════════════════════════════
// USER WORKFLOW IMPLEMENTATIONS
// ═══════════════════════════════════════════════════

async function sendWelcomeEmail(payload: WorkflowPayload) {
  const { recipientEmail, recipientName } = payload;

  const result = await emailService.sendWelcomeEmail({
    name: recipientName || "Comic Reader",
    email: recipientEmail,
  });

  return { success: result.success };
}

async function sendVerificationEmail(payload: WorkflowPayload) {
  const { recipientEmail, recipientName, data } = payload;

  const result = await emailService.sendVerificationEmail({
    name: recipientName || "Comic Reader",
    email: recipientEmail,
    verificationToken: data.token,
  });

  return { success: result.success };
}

async function sendPasswordResetEmail(payload: WorkflowPayload) {
  const { recipientEmail, recipientName, data } = payload;

  const result = await emailService.sendPasswordResetEmail({
    name: recipientName || "Comic Reader",
    email: recipientEmail,
    resetToken: data.token,
    ipAddress: data.ipAddress,
  });

  return { success: result.success };
}

export async function sendNewComicNotification(payload: WorkflowPayload) {
  const { recipientEmail, recipientName, data } = payload;
  const comicUrl = `${appConfig.url}/comics/${data.comicId}`;

  const result = await sendEmail({
    to: recipientEmail,
    subject: `New Comic: ${data.comicTitle}`,
    html: `
      <h1>New Comic Available!</h1>
      <p>Hi ${recipientName || "there"},</p>
      <p>A new comic has been added to ComicWise:</p>
      <h2>${data.comicTitle}</h2>
      <p>${data.comicDescription}</p>
      <a href="${comicUrl}" style="display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 4px; margin-top: 16px;">
        Read Now
      </a>
    `,
  });

  return { success: result.success };
}

async function sendNewChapterNotification(payload: WorkflowPayload) {
  const { recipientEmail, recipientName, data } = payload;

  const result = await emailService.sendNewChapterEmail({
    userName: recipientName || "Comic Reader",
    userEmail: recipientEmail,
    comicTitle: data.comicTitle,
    comicCoverUrl: data.comicCoverUrl || "https://comicwise.app/placeholder-cover.jpg",
    chapterNumber: data.chapterNumber,
    chapterTitle: data.chapterTitle,
    chapterSlug: data.chapterSlug,
    releaseDate: data.releaseDate || new Date().toLocaleDateString(),
  });

  return { success: result.success };
}

async function sendBookmarkReminder(payload: WorkflowPayload) {
  const { recipientEmail, recipientName, data } = payload;
  const bookmarksUrl = `${appConfig.url}/bookmarks`;

  const result = await sendEmail({
    to: recipientEmail,
    subject: "Continue Reading Your Bookmarked Comics",
    html: `
      <h1>Reading Reminder</h1>
      <p>Hi ${recipientName || "there"},</p>
      <p>You have ${data.bookmarkCount} bookmarked comics waiting for you!</p>
      <p>Don't forget to continue your reading journey.</p>
      <a href="${bookmarksUrl}" style="display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 4px; margin-top: 16px;">
        View Bookmarks
      </a>
    `,
  });

  return { success: result.success };
}

async function sendCommentNotification(payload: WorkflowPayload) {
  const { recipientEmail, recipientName, data } = payload;

  const result = await emailService.sendCommentNotificationEmail({
    userName: recipientName || "Comic Reader",
    userEmail: recipientEmail,
    commenterName: data.commenterName,
    commenterAvatar: data.commenterAvatar,
    commentText: data.commentContent,
    comicTitle: data.comicTitle,
    chapterNumber: data.chapterNumber,
    commentId: data.commentId,
    commentType: data.commentType || "new",
  });

  return { success: result.success };
}

// ═══════════════════════════════════════════════════
// BATCH WORKFLOW EXECUTION
// ═══════════════════════════════════════════════════

export async function executeBatchWorkflow(payloads: WorkflowPayload[]) {
  const results = await Promise.allSettled(payloads.map((payload) => executeWorkflow(payload)));

  return {
    total: results.length,
    succeeded: results.filter((r) => r.status === "fulfilled" && r.value.success).length,
    failed: results.filter((r) => r.status === "rejected" || !r.value.success).length,
    results,
  };
}
async function sendAccountUpdatedEmail(payload: WorkflowPayload) {
  const { recipientEmail, recipientName, data } = payload;

  const result = await emailService.sendAccountUpdatedEmail({
    name: recipientName || "Comic Reader",
    email: recipientEmail,
    changeType: data.changeType || "profile",
    changeDetails: data.changes,
    ipAddress: data.ipAddress,
  });

  return { success: result.success };
}

// Stub functions for missing email notifications
async function sendAccountDeletedEmail(payload: WorkflowPayload) {
  // TODO: Implement account deleted email
  console.log("Account deleted notification:", payload);
  return { success: true };
}

async function sendComicCreatedNotification(payload: WorkflowPayload) {
  // TODO: Implement comic created notification
  console.log("Comic created notification:", payload);
  return { success: true };
}

async function sendComicUpdatedNotification(payload: WorkflowPayload) {
  // TODO: Implement comic updated notification
  console.log("Comic updated notification:", payload);
  return { success: true };
}

async function sendComicDeletedNotification(payload: WorkflowPayload) {
  // TODO: Implement comic deleted notification
  console.log("Comic deleted notification:", payload);
  return { success: true };
}

async function sendChapterCreatedNotification(payload: WorkflowPayload) {
  return await sendNewChapterNotification(payload);
}

async function sendChapterUpdatedNotification(payload: WorkflowPayload) {
  // TODO: Implement chapter updated notification
  console.log("Chapter updated notification:", payload);
  return { success: true };
}

async function sendChapterDeletedNotification(payload: WorkflowPayload) {
  // TODO: Implement chapter deleted notification
  console.log("Chapter deleted notification:", payload);
  return { success: true };
}

async function sendBookmarkCreatedNotification(payload: WorkflowPayload) {
  // TODO: Implement bookmark created notification
  console.log("Bookmark created notification:", payload);
  return { success: true };
}

async function sendCommentReplyNotification(payload: WorkflowPayload) {
  return await sendCommentNotification(payload);
}

async function sendAdminNotification(payload: WorkflowPayload) {
  // TODO: Implement admin notification
  console.log("Admin notification:", payload);
  return { success: true };
}

// Helper function for sending simple emails
async function sendEmail(options: { to: string; subject: string; html: string }) {
  // This is a placeholder that uses the transporter directly if needed
  // For now, return success
  console.log("Sending email:", options.subject);
  return { success: true };
}
