import { relations } from "drizzle-orm";
import { users, courses, modules, lessons, enrollments, progress, quizQuestions, quizOptions, posts, comments } from "./schema";


export const usersRelations = relations(users, ({ many }) => ({
    enrollments: many(enrollments),
    progress: many(progress),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
    modules: many(modules),
    enrollments: many(enrollments),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
    course: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    module: one(modules, {
        fields: [lessons.moduleId],
        references: [modules.id],
    }),
    quizQuestions: many(quizQuestions),
    progress: many(progress),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [quizQuestions.lessonId],
        references: [lessons.id],
    }),
    options: many(quizOptions),
}));

export const quizOptionsRelations = relations(quizOptions, ({ one }) => ({
    question: one(quizQuestions, {
        fields: [quizOptions.questionId],
        references: [quizQuestions.id],
    }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
    user: one(users, {
        fields: [enrollments.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [enrollments.courseId],
        references: [courses.id],
    }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    course: one(courses, {
        fields: [posts.courseId],
        references: [courses.id],
    }),
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
}));
