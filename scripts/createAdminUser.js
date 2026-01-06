/**
 * Firebase User Creation Script
 * Run this script to create the admin user account
 * 
 * USAGE:
 * 1. Install firebase-admin if not already: npm install firebase-admin
 * 2. Download your Firebase Admin SDK private key from Firebase Console
 * 3. Save it as 'serviceAccountKey.json' in this directory
 * 4. Run: node createAdminUser.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Admin user details
const email = 'Grokubadmin@growkub.com';
const password = 'Kub@987/*';
const displayName = 'Grokubadmin';

async function createAdminUser() {
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: displayName,
            emailVerified: true
        });

        console.log('✅ Successfully created admin user:');
        console.log('   UID:', userRecord.uid);
        console.log('   Email:', userRecord.email);
        console.log('   Display Name:', userRecord.displayName);
        console.log('\n📧 Login Credentials:');
        console.log('   Email:', email);
        console.log('   Password:', password);
        console.log('\n🔐 You can now login at: http://localhost:3000/admin-login');

    } catch (error) {
        console.error('❌ Error creating user:', error.message);

        if (error.code === 'auth/email-already-exists') {
            console.log('\n✨ User already exists! You can login with:');
            console.log('   Email:', email);
            console.log('   Password:', password);
        }
    } finally {
        process.exit();
    }
}

createAdminUser();
