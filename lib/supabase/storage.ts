// import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

// Temporarily disable supabase storage functionality
export async function uploadFile(file: File, bucket: string): Promise<string> {
  // TODO: Implement proper file upload logic when needed
  console.warn("File upload not implemented yet")
  return Promise.resolve(`temp-url-${uuidv4()}`)
}

export async function uploadMultipleFiles(files: File[], bucket: string): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadFile(file, bucket))
  return Promise.all(uploadPromises)
}
