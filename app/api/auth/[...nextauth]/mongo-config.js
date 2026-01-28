import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';

// Log environment variables for debugging
console.log('Auth Config Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '***' : 'Not Set',
  MONGODB_URI: process.env.MONGODB_URI ? '***' : 'Not Set',
  NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG
});

if (!process.env.NEXTAUTH_SECRET) {
  console.error('NEXTAUTH_SECRET is not set. Please set it in your environment variables.');
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Please set it in your environment variables.');
}

export const authOptions = {
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }
          
          console.log('Authorization attempt for:', credentials.email);
          await dbConnect();
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          
          // If user not found
          if (!user) {
            console.log('No user found with email:', credentials.email);
            throw new Error('No user found with this email');
          }
          
          // Check password
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log('Invalid password for user:', credentials.email);
            throw new Error('Invalid password');
          }
          
          console.log('User authenticated successfully:', user.email);
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user = session.user || {};
          session.user.id = token.id;
          session.user.role = token.role;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        throw error;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // Ensure baseUrl has a trailing slash
        const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        
        // Handle admin redirects
        if (url.startsWith('/admin') || url === '/admin') {
          return `${normalizedBaseUrl}admin`;
        }
        
        // Handle login redirects
        if (url.includes('/admin-auth/login')) {
          return normalizedBaseUrl;
        }
        
        // Default to baseUrl if the URL is not absolute
        return url.startsWith('http') ? url : normalizedBaseUrl;
      } catch (error) {
        console.error('Redirect callback error:', error);
        return baseUrl;
      }
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
    signOut: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
};

export { authOptions };
