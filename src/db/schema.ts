import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users Table
export const users = sqliteTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    password: text("password"),
    image: text("image"),
    role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Courses Table
export const courses = sqliteTable("courses", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description"),
    price: integer("price").notNull().default(0), // JPY
    thumbnailUrl: text("thumbnail_url"),
    published: integer("published", { mode: "boolean" }).default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Modules (Chapters)
export const modules = sqliteTable("modules", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseId: text("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    title: text("title").notNull(),
    order: integer("order").notNull(),
});

// Lessons
export const lessons = sqliteTable("lessons", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    moduleId: text("module_id").references(() => modules.id, { onDelete: "cascade" }).notNull(),
    title: text("title").notNull(),
    videoUrl: text("video_url"),
    description: text("description"), // text content
    attachmentUrl: text("attachment_url"), // reference materials (PDF, Excel, etc.)
    attachmentName: text("attachment_name"), // display name for the attachment
    type: text("type", { enum: ["video", "quiz", "text", "live", "assignment"] }).default("video").notNull(),
    order: integer("order").notNull(),
    isFree: integer("is_free", { mode: "boolean" }).default(false), // for lead magnet/preview
});

// ... (quiz tables)

// Submissions (Assignments)
export const submissions = sqliteTable("submissions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    content: text("content"), // Text content or description
    fileUrl: text("file_url"), // Uploaded file URL
    status: text("status", { enum: ["submitted", "graded", "returned"] }).default("submitted").notNull(),
    grade: integer("grade"), // optional score
    feedback: text("feedback"), // Teacher feedback
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// ... Other tables

// Quiz Questions
export const quizQuestions = sqliteTable("quiz_questions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    questionText: text("question_text").notNull(),
    order: integer("order").notNull(),
});

// Quiz Options
export const quizOptions = sqliteTable("quiz_options", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    questionId: text("question_id").references(() => quizQuestions.id, { onDelete: "cascade" }).notNull(),
    optionText: text("option_text").notNull(),
    isCorrect: integer("is_correct", { mode: "boolean" }).default(false).notNull(),
    order: integer("order").notNull(),
});

// Enrollments (Purchases)
export const enrollments = sqliteTable("enrollments", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    courseId: text("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    purchasedAt: integer("purchased_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Progress
export const progress = sqliteTable("progress", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    completed: integer("completed", { mode: "boolean" }).default(false),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Leads (Newsletter/Magnet)
export const leads = sqliteTable("leads", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    source: text("source").default("lead_magnet"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Announcements
export const announcements = sqliteTable("announcements", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    content: text("content").notNull(),
    videoUrl: text("video_url"),
    courseId: text("course_id").references(() => courses.id, { onDelete: "cascade" }), // Nullable for global announcements
    published: integer("published", { mode: "boolean" }).default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Coupons
export const coupons = sqliteTable("coupons", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    code: text("code").notNull().unique(), // e.g. "WELCOME1000"
    discountAmount: integer("discount_amount").notNull(), // Fixed amount off
    maxUses: integer("max_uses"), // Optional limit
    usedCount: integer("used_count").default(0),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Inquiries (Contact Form)
export const inquiries = sqliteTable("inquiries", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status", { enum: ["unread", "read", "replied"] }).default("unread").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Posts (Community)
export const posts = sqliteTable("posts", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseId: text("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// Comments (Community)
export const comments = sqliteTable("comments", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    postId: text("post_id").references(() => posts.id, { onDelete: "cascade" }).notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// MYASP Transactions (for duplicate prevention)
export const myaspTransactions = sqliteTable("myasp_transactions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    transactionId: text("transaction_id").notNull().unique(),
    customerEmail: text("customer_email").notNull(),
    productId: text("product_id"),
    amount: integer("amount"),
    courseId: text("course_id").references(() => courses.id),
    userId: text("user_id").references(() => users.id),
    processedAt: integer("processed_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

// One-Time Tokens (for auto-login)
export const oneTimeTokens = sqliteTable("one_time_tokens", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull().unique(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    used: integer("used", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});
