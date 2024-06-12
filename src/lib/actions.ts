"use server";

import prisma from "./db";

export async function CreateNewLinkAction(formData: FormData) {
    await prisma.link.create({
        data: {
            category: formData.get("category")?.toString() || "",
            description: formData.get("description")?.toString() || "",
            imageUrl: formData.get("imageUrl")?.toString() || "",
            title: formData.get("title")?.toString() || "",
            url: formData.get("url")?.toString() || "",
        }
    });
}
