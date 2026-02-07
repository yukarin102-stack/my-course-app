"use server";

import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { readdir, stat } from "fs/promises";

export async function uploadFile(formData: FormData) {
    const session = await auth();
    // 管理者チェック (簡易)
    if (!session || (session.user as any).role !== "admin") {
        return { error: "権限がありません" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "ファイルが選択されていません" };
    }

    // ファイル名（重複回避のためタイムスタンプ付与）
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filename = `${timestamp}_${safeName}`;

    // 保存先: public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");

    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // ignore if exists
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(uploadDir, filename);

    try {
        await writeFile(filePath, buffer);
        console.log(`Uploaded file to ${filePath}`);

        // 公開パスを返す
        return { success: true, url: `/uploads/${filename}`, filename: filename };
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: "アップロードに失敗しました" };
    }
}

export async function listFiles() {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
        return [];
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
        const files = await readdir(uploadDir);

        // 詳細情報を取得してソート（新しい順）
        const fileDetails = await Promise.all(files.map(async (file) => {
            const stats = await stat(join(uploadDir, file));
            return {
                name: file,
                url: `/uploads/${file}`,
                size: stats.size,
                createdAt: stats.birthtimeMs
            };
        }));

        return fileDetails.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
        return [];
    }
}
