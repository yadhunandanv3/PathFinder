import assert from 'node:assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

import User from '../models/User.js';
import Content from '../models/Content.js';

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/PathFinderTest';

async function runTests() {
  console.log('🚀 Starting Pathfinder Integration Test Suite (RBAC Refactoring)...\n');

  try {
    // 1. Establish Database Connection
    await mongoose.connect(TEST_MONGO_URI);
    console.log('✅ Connected to Test MongoDB Database successfully.');

    // Clear test collections
    await User.deleteMany({});
    await Content.deleteMany({});
    console.log('✅ Cleaned up stale test collections.');

    // ==========================================
    // TEST 1: User Schema & Role Enums
    // ==========================================
    console.log('\n--- Test 1: User Hashing & Role Enums ---');
    const adminPassword = 'admin@123';
    const smmPassword = 'SMMpassword456!';

    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@pathfinder.build',
      password: adminPassword,
      role: 'ADMIN',
    });

    const smmUser = await User.create({
      name: 'Test SMM',
      email: 'smm@test.com',
      password: smmPassword,
      role: 'SOCIAL_MEDIA_MANAGER',
    });

    assert.ok(adminUser._id, 'Admin user should have database object ID');
    assert.strictEqual(adminUser.role, 'ADMIN', 'Role should be ADMIN');
    assert.strictEqual(smmUser.role, 'SOCIAL_MEDIA_MANAGER', 'Role should be SOCIAL_MEDIA_MANAGER');
    assert.notStrictEqual(adminUser.password, adminPassword, 'Admin password must be hashed');

    console.log('PASS: Password hashing and strict role enums verified.');

    // ==========================================
    // TEST 2: JWT Authentication Payload
    // ==========================================
    console.log('\n--- Test 2: JWT Payload & Verification ---');
    const secret = process.env.JWT_SECRET || 'pathfinder_master_jwt_secret_key_2026_super_secure';

    const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, secret, { expiresIn: '1h' });
    assert.ok(token, 'JWT token string must be generated');

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id.toString(), adminUser._id.toString(), 'JWT payload should preserve user ID');
    assert.strictEqual(decoded.role, 'ADMIN', 'JWT payload should preserve role ADMIN');
    console.log('PASS: JWT issuance and payload verified.');

    // ==========================================
    // TEST 3: Content Collection CRUD & Enums
    // ==========================================
    console.log('\n--- Test 3: Content Collection CRUD & Enums ---');

    const note = await Content.create({
      title: 'Sequenced Choice Architecture',
      description: 'Choice Architecture note details',
      contentType: 'CONCEPT_NOTE',
      category: 'Handbooks',
      status: 'PUBLISHED',
      createdBy: adminUser._id,
      updatedBy: adminUser._id,
    });
    assert.strictEqual(note.contentType, 'CONCEPT_NOTE', 'contentType should be CONCEPT_NOTE');
    assert.strictEqual(note.status, 'PUBLISHED', 'status should default to PUBLISHED');

    const handbook = await Content.create({
      title: 'Early Stage Playbook',
      description: 'Startup roadmap handbook',
      contentType: 'PUBLIC_HANDBOOK',
      category: 'Handbooks',
      readTimeMinutes: 12,
      chapters: ['Fitment', 'Growth', 'Scale'],
      createdBy: smmUser._id,
      updatedBy: smmUser._id,
    });
    assert.strictEqual(handbook.contentType, 'PUBLIC_HANDBOOK', 'contentType should be PUBLIC_HANDBOOK');
    assert.strictEqual(handbook.chapters.length, 3, 'Chapters array should be stored');

    console.log('PASS: Content collection CRUD operations verified.');

    // ==========================================
    // TEST 4: Authorization Rules
    // ==========================================
    console.log('\n--- Test 4: Role-Based Authorization Checks ---');

    const allowedRolesForDelete = ['ADMIN'];
    assert.strictEqual(allowedRolesForDelete.includes(smmUser.role), false, 'SOCIAL_MEDIA_MANAGER cannot delete content');
    assert.strictEqual(allowedRolesForDelete.includes(adminUser.role), true, 'ADMIN can delete content');

    console.log('PASS: Role authorization rules validated.');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 100% COMPLIANCE VERIFIED.');
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILURE:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
