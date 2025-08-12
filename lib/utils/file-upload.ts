import { writeFile } from "fs/promises"
import path from "path"
import fs from "fs"

/**
 * Uploads an array of files to the local public/uploads directory.
 * @param files - An array of File objects to upload.
 * @returns A promise that resolves to an array of public URLs for the uploaded files.
 */
export async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadDir = path.join(process.cwd(), "public/uploads")

  // Ensure the upload directory exists.
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const fileUrls: string[] = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`
    const uploadPath = path.join(uploadDir, filename)

    try {
      await writeFile(uploadPath, buffer)
      fileUrls.push(`/uploads/${filename}`)
    } catch (error) {
      console.error("Error uploading file:", error)
      throw new Error(`Failed to upload ${file.name}`)
    }
  }

  return fileUrls
}
