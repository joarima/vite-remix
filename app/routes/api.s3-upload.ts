import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { SEOHandle } from '@nasa-gcn/remix-seo'
import { ActionFunctionArgs, json } from '@remix-run/node'

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const filename = formData.get('filename')?.toString()
  const contentType = formData.get('contentType')?.toString()?.toString()

  if (!filename || !contentType) {
    return json({
      error: 'filename or contentType not found.',
    })
  }

  try {
    const client = new S3Client({ region: process.env.AWS_S3_REGION })

    if (!process.env.AWS_S3_BUCKET)
      return json({
        error: 'environment variable AWS_S3_BUCKET not found.',
      })

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: 'images/' + filename,
      Conditions: [
        ['content-length-range', 0, 104857600],
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    })

    return json({ url, fields })
  } catch (error) {
    console.log(error)
    return json({ error: 'createPresignedPost error.' })
  }
}
