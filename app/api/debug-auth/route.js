import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Diagnostic endpoint to debug sign-in issues
// Access via: /api/debug-auth?email=your@email.com
// DELETE THIS FILE after debugging is complete!
export async function GET(request) {
    const results = {
        step1_env_check: null,
        step2_db_connection: null,
        step3_user_lookup: null,
        step4_password_check: null,
    };

    // Step 1: Check env variables
    const hasMongoUri = !!process.env.MONGODB_URI;
    const hasSecret = !!process.env.NEXTAUTH_SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    const mongoUriPrefix = hasMongoUri
        ? process.env.MONGODB_URI.substring(0, 20) + '...'
        : 'NOT SET';

    results.step1_env_check = {
        MONGODB_URI: mongoUriPrefix,
        NEXTAUTH_SECRET: hasSecret ? 'SET' : 'NOT SET',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
        NODE_ENV: process.env.NODE_ENV,
    };

    // Step 2: Try to connect to DB
    try {
        await connectDB();
        results.step2_db_connection = { status: '✅ Connected successfully' };
    } catch (error) {
        results.step2_db_connection = {
            status: '❌ FAILED',
            error: error.message,
        };
        return NextResponse.json(results, { status: 200 });
    }

    // Step 3: Try to find a user
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
        results.step3_user_lookup = {
            status: '⚠️ No email provided. Add ?email=your@email.com to URL',
        };
        return NextResponse.json(results, { status: 200 });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            results.step3_user_lookup = {
                status: '❌ No user found with this email',
                emailSearched: email.toLowerCase(),
            };
            return NextResponse.json(results, { status: 200 });
        }

        results.step3_user_lookup = {
            status: '✅ User found',
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            hasPassword: !!user.password,
            passwordLength: user.password ? user.password.length : 0,
            passwordStartsWith: user.password ? user.password.substring(0, 7) : 'N/A',
            // bcrypt hashes always start with $2a$ or $2b$
            isHashedPassword: user.password
                ? user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
                : false,
        };

        // Step 4: Test password comparison (only if password provided)
        const testPassword = request.nextUrl.searchParams.get('password');
        if (testPassword) {
            try {
                const isMatch = await bcrypt.compare(testPassword, user.password);
                results.step4_password_check = {
                    status: isMatch ? '✅ Password matches!' : '❌ Password does NOT match',
                };
            } catch (error) {
                results.step4_password_check = {
                    status: '❌ bcrypt.compare failed',
                    error: error.message,
                };
            }
        } else {
            results.step4_password_check = {
                status: '⚠️ Add &password=yourpassword to URL to test',
            };
        }
    } catch (error) {
        results.step3_user_lookup = {
            status: '❌ Error looking up user',
            error: error.message,
        };
    }

    return NextResponse.json(results, { status: 200 });
}
