export async function GET() {
  return Response.json({
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
    NODE_ENV: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('MONGO'))
  });
}
