import { writeFile } from "fs/promises"
import path from "path"
import fs from "fs"

/**
 * Uploads an array of files to the local public/uploads directory.
 * @param files - An array of File objects to upload.
 * @returns A promise that resolves to an array of public URLs for the uploaded files.
 */
import crypto from "crypto"

export async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadDir = path.join(process.cwd(), "public/uploads")

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const MAX_SIZE_BYTES = 10 * 1024 * 1024
  const fileUrls: string[] = []

  for (const file of files) {
    if (!file.type?.startsWith("image/")) {
      throw new Error("Only image uploads are allowed")
    }
    if (typeof file.size === "number" && file.size > MAX_SIZE_BYTES) {
      throw new Error("Image exceeds 10MB limit")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 12)
    const ext = path.extname(file.name || "") || ".jpg"
    const safeName = `${Date.now()}-${hash}${ext}`
    const uploadPath = path.join(uploadDir, safeName)

    try {
      await writeFile(uploadPath, buffer)
      fileUrls.push(`/uploads/${safeName}`)
    } catch (error) {
      console.error("Error uploading file:", error)
      throw new Error(`Failed to upload ${file.name}`)
    }
  }

  return fileUrls
}
