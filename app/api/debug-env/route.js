export async function GET() {
  return Response.json({
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set',
    NEXTAUTH_SECRET_Value: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.substring(0, 20) + '...' : 'Not Set',
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
    MONGODB_URI_Value: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'Not Set',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('NEXTAUTH') || key.includes('MONGODB'))
  });
}
