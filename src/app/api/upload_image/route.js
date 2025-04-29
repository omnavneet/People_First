import { NextResponse } from "next/server"
import { S3 } from "@aws-sdk/client-s3"

export async function POST(request) {
  try {
    // Extract the file from formData
    const formData = await request.formData()
    const file = formData.get("image")

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Create buffer from file
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `requests/${Date.now().toString()}_${file.name}`

    // Initialize S3 client
    const s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })

    // Upload to S3 with public-read ACL
    await s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read'  // This makes the object publicly readable
    })

    // Generate the public URL for the uploaded file
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`

    return NextResponse.json({
      imageUrl: publicUrl // Return the public URL
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "File upload failed. Please try again later." },
      { status: 500 }
    )
  }
}
