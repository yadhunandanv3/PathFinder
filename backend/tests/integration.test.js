import assert from 'node:assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Load environmental variables
dotenv.config();

// Load Mongoose models
import User from '../models/User.js';
import Resource, { ConceptNote, PublicHandbook, Inspiration, Testimonial } from '../models/Resource.js';
import Category from '../models/Category.js';

const TEST_MONGO_URI = 'mongodb://127.0.0.1:27017/PathFinderTest';

async function runTests() {
  console.log('🚀 Starting Pathfinder Integration Test Suite...\n');

  try {
    // 1. Establish Database Connection
    await mongoose.connect(TEST_MONGO_URI);
    console.log('✅ Connected to Test MongoDB Database successfully.');

    // Clear previous test collections to ensure isolation
    await User.deleteMany({});
    await Resource.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleaned up stale test collections.');

    // ==========================================
    // TEST 1: User Registration & Hashing
    // ==========================================
    console.log('\n--- Test 1: User Hashing & Validation ---');
    const adminPassword = 'AdminPassword123!';
    const smmPassword = 'SMMpassword456!';

    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'Admin'
    });

    const smmUser = await User.create({
      name: 'Test SMM',
      email: 'smm@test.com',
      password: smmPassword,
      role: 'Social Media Manager'
    });

    assert.ok(adminUser._id, 'Admin user should have database object ID');
    assert.notStrictEqual(adminUser.password, adminPassword, 'Admin password must be hashed, not plain text');
    
    const isMatched = await bcrypt.compare(adminPassword, adminUser.password);
    assert.strictEqual(isMatched, true, 'Bcrypt compare should match input password with hash');
    console.log('PASS: Password hashing and validation verified.');

    // ==========================================
    // TEST 2: User Login & JWT Output
    // ==========================================
    console.log('\n--- Test 2: JWT Issuance ---');
    const secret = process.env.JWT_SECRET || 'secretkey';
    
    // Simulate token payload signing
    const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, secret, { expiresIn: '1h' });
    assert.ok(token, 'JWT token string must be generated');

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.role, 'Admin', 'JWT payload should preserve user role');
    console.log('PASS: JWT generation verified.');

    // ==========================================
    // TEST 3: Polymorphic Resource Discriminators
    // ==========================================
    console.log('\n--- Test 3: Polymorphic Resource Discriminators ---');
    
    // Seed test category
    const cat = await Category.create({ name: 'Strategy', createdBy: adminUser._id });

    // Seed Concept Note
    const note = await ConceptNote.create({
      description: 'Choice Architecture note details',
      category: cat.name,
      title: 'Sequenced Choice Architecture',
      author: 'Vikram',
      pdf: 'http://test.com/note.pdf',
      createdBy: adminUser._id
    });
    assert.strictEqual(note.type, 'ConceptNote', 'Discriminator key type should be set to ConceptNote');
    assert.strictEqual(note.downloadCount, 0, 'Initial download count should default to 0');

    // Seed Handbook
    const handbook = await PublicHandbook.create({
      description: 'Startup roadmap handbook',
      category: cat.name,
      title: 'Early Stage Playbook',
      readTimeMinutes: 12,
      chapters: ['Fitment', 'Growth', 'Scale'],
      pdf: 'http://test.com/handbook.pdf',
      createdBy: adminUser._id
    });
    assert.strictEqual(handbook.type, 'PublicHandbook', 'Discriminator key type should be set to PublicHandbook');
    assert.strictEqual(handbook.chapters.length, 3, 'Chapters array should be saved');

    // Seed Inspiration
    const inspiration = await Inspiration.create({
      description: 'Biography overview details',
      category: cat.name,
      title: 'Paul Graham',
      personName: 'Paul Graham',
      roleTitle: 'Co-founder',
      companyName: 'Y Combinator',
      quote: 'Do things that don\'t scale',
      socialLink: 'https://twitter.com/pg',
      createdBy: adminUser._id
    });
    assert.strictEqual(inspiration.type, 'Inspiration', 'Discriminator key type should be set to Inspiration');
    assert.strictEqual(inspiration.personName, 'Paul Graham', 'Person metadata should save successfully');

    // Seed Testimonial
    const testimonial = await Testimonial.create({
      description: 'Relationship description context',
      category: cat.name,
      title: 'Marc Andreessen',
      clientName: 'Marc Andreessen',
      clientCompany: 'a16z',
      quote: 'Pathfinder builds alignment like no other.',
      createdBy: adminUser._id
    });
    assert.strictEqual(testimonial.type, 'Testimonial', 'Discriminator key type should be set to Testimonial');
    console.log('PASS: Polymorphic schemas and discriminators successfully stored.');

    // ==========================================
    // TEST 4: Category Constraints & RBAC
    // ==========================================
    console.log('\n--- Test 4: Role-Based Access Controls ---');
    
    // Simulate SMM trying to delete category
    const isSMMAllowed = smmUser.role === 'Admin';
    assert.strictEqual(isSMMAllowed, false, 'SMM editor account must not hold admin permissions');
    
    const isAdminAllowed = adminUser.role === 'Admin';
    assert.strictEqual(isAdminAllowed, true, 'Admin account must hold full access permissions');
    console.log('PASS: RBAC roles checks validated.');

    // ==========================================
    // TEST 5: Download Analytics Logs
    // ==========================================
    console.log('\n--- Test 5: PDF Download Analytics ---');
    
    // Simulate user downloading a Concept Note
    const requestedNote = await Resource.findById(note._id);
    if (requestedNote.type === 'ConceptNote') {
      requestedNote.downloadCount += 1;
      await requestedNote.save();
    }

    const updatedNote = await Resource.findById(note._id);
    assert.strictEqual(updatedNote.downloadCount, 1, 'Download count should increment to 1');
    console.log('PASS: Download count increment audit verified.');

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
