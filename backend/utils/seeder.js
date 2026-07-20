import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Resource, { ConceptNote, PublicHandbook, Inspiration, Testimonial } from '../models/Resource.js';

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/PathFinder';

const seedDatabase = async () => {
  console.log('🌱 Starting Pathfinder Database Seeder...');
  
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Resource.deleteMany({});
    console.log('✅ Wiped existing database collections.');

    // 1. Create Mock Admin & SMM users (plain text, Mongoose Schema pre-save hook handles hashing)
    const admin = await User.create({
      name: 'Admin Curator',
      email: 'admin@pathfinder.build',
      password: 'PathfinderAdmin123!',
      role: 'Admin'
    });

    const smm = await User.create({
      name: 'SMM Editor',
      email: 'smm@pathfinder.build',
      password: 'PathfinderSMM456!',
      role: 'Social Media Manager'
    });
    console.log('✅ Created Admin and SMM test accounts.');

    // 2. Create Default Category Pillars
    const catConcepts = await Category.create({ name: 'Concepts', createdBy: admin._id });
    const catHandbooks = await Category.create({ name: 'Handbooks', createdBy: admin._id });
    const catInspirations = await Category.create({ name: 'Inspirations', createdBy: admin._id });
    const catTestimonials = await Category.create({ name: 'Testimonials', createdBy: admin._id });
    console.log('✅ Created Category Pillars.');

    // 3. Create Concept Notes (Polymorphic A)
    await ConceptNote.create([
      {
        title: 'Sequenced Choice Architecture',
        description: 'A structural outline of decision node mapping for seed founders facing high stakes fitment situations. Explains how to focus energy on variables that shape product roadmap trajectory.',
        category: catConcepts.name,
        author: 'Anirudh R.',
        pdf: 'http://localhost:5000/uploads/sample_choice_architecture.pdf',
        createdBy: admin._id,
        downloadCount: 42
      },
      {
        title: '0 to 1 Stage Fitment Rules',
        description: 'Mental model framework mapping market-founder fit coordinates. This study outlines rigorous methods to pressure test market fit parameters before entering growth phases.',
        category: catConcepts.name,
        author: 'Nishant M.',
        pdf: 'http://localhost:5000/uploads/sample_stage_fitment.pdf',
        createdBy: admin._id,
        downloadCount: 19
      }
    ]);

    // 4. Create Public Handbooks (Polymorphic B)
    await PublicHandbook.create([
      {
        title: 'Early Stage Ascent Playbook',
        description: 'Comprehensive handbook covering initial funding routes, founder alignments, and product fitment structures. A complete step-by-step roadmap to sequence early-stage choices.',
        category: catHandbooks.name,
        readTimeMinutes: 15,
        chapters: ['Mapping Market Uncertainty', 'Building Savant Teams', 'Sequenced Product Iterations'],
        pdf: 'http://localhost:5000/uploads/sample_early_stage_playbook.pdf',
        createdBy: admin._id
      },
      {
        title: 'Strategy Masterclass Handbook',
        description: 'Curated guidelines on navigating critical seed milestones, investor coordination meetings, and board level alignments. Provides practical frameworks for company builders.',
        category: catHandbooks.name,
        readTimeMinutes: 8,
        chapters: ['Pillars of Alignment', 'Crafting Investor Narratives', 'Post-Investment Sequences'],
        pdf: 'http://localhost:5000/uploads/sample_strategy_handbook.pdf',
        createdBy: admin._id
      }
    ]);

    // 5. Create Inspirations (Polymorphic C)
    await Inspiration.create([
      {
        title: 'Paul Graham',
        description: 'Paul Graham is a programmer, writer, and investor. He is best known for co-founding Y Combinator, the startup accelerator program that pioneered seed-stage investing.',
        category: catInspirations.name,
        personName: 'Paul Graham',
        roleTitle: 'Co-founder',
        companyName: 'Y Combinator',
        quote: 'It is better to make a few users love you than a lot of users like you. Do things that don\'t scale.',
        socialLink: 'https://twitter.com/pg',
        thumbnail: 'https://www.pathfinder.build/assets/social-logo.jpeg',
        createdBy: admin._id
      },
      {
        title: 'Naval Ravikant',
        description: 'Naval Ravikant is an entrepreneur and investor. He is the co-founder of AngelList and has invested in over 200 startups including Twitter, Uber, and Yammer.',
        category: catInspirations.name,
        personName: 'Naval Ravikant',
        roleTitle: 'Co-founder',
        companyName: 'AngelList',
        quote: 'Productize yourself. There is no other way. You want to be unique, you want to be authentic, and you want to scale.',
        socialLink: 'https://twitter.com/naval',
        thumbnail: 'https://www.pathfinder.build/assets/social-logo.jpeg',
        createdBy: admin._id
      }
    ]);

    // 6. Create Testimonials (Polymorphic D)
    await Testimonial.create([
      {
        title: 'Marc Andreessen',
        description: 'Investor and board alignment review.',
        category: catTestimonials.name,
        clientName: 'Marc Andreessen',
        clientCompany: 'General Partner, Andreessen Horowitz (a16z)',
        clientAvatar: 'https://www.pathfinder.build/assets/social-logo.jpeg',
        quote: 'Pathfinder builds alignment and rigor in 0-to-1 founder teams like no other studio we have worked with. They sequence decisions with absolute clarity.',
        createdBy: admin._id
      },
      {
        title: 'Sarah Tavel',
        description: 'Early stage startup trajectory guidance feedback.',
        category: catTestimonials.name,
        clientName: 'Sarah Tavel',
        clientCompany: 'General Partner, Benchmark Capital',
        clientAvatar: 'https://www.pathfinder.build/assets/social-logo.jpeg',
        quote: 'Their choice architecture mappings are extremely rigorous. They help founders separate noise from actual signals to execute fast early-stage ascents.',
        createdBy: admin._id
      }
    ]);
    console.log('✅ Seeded mock polymorphic resources.');
    
    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
