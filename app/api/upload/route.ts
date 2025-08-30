import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images were provided.' },
        { status: 400 }
      );
    }

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
        return uploadImage(base64Image, 'products');
      })
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Images uploaded successfully.',
        data: {
          urls: imageUrls,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload images.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
