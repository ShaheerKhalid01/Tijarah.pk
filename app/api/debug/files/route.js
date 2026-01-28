import { promises as fs } from 'fs';
import path from 'path';

const publicPath = path.join(process.cwd(), 'public');

export async function GET() {
  try {
    const files = await fs.readdir(publicPath, { withFileTypes: true });
    const fileList = files.map(file => ({
      name: file.name,
      type: file.isDirectory() ? 'directory' : 'file',
      path: path.join('public', file.name)
    }));
    
    return new Response(JSON.stringify(fileList, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to read directory',
      message: error.message,
      path: publicPath
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
