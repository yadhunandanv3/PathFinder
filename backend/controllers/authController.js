import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecretKey } = req.body;

    // Verify duplicate emails
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, 'User with this email already exists'));
    }

    // RBAC: Privileged role registration restrictions
    let finalRole = 'Visitor';
    if (role && role !== 'Visitor') {
      if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return next(new ApiError(403, 'Unauthorized access key for privileged roles'));
      }
      finalRole = role;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json(
      new ApiResponse(
        201,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists (explicitly select password field)
    let user = await User.findOne({ email }).select('+password');
    
    // Auto-seed admin user and initial catalog resources if logging into fresh cloud DB
    if (!user && (email === 'admin@pathfinder.build' || email === 'smm@pathfinder.build')) {
      const adminUser = await User.create({
        name: 'Admin Curator',
        email: 'admin@pathfinder.build',
        password: 'PathfinderAdmin123!',
        role: 'Admin',
      });
      await User.create({
        name: 'SMM Curator',
        email: 'smm@pathfinder.build',
        password: 'PathfinderSMM456!',
        role: 'SMM',
      });

      // Import Category & Resource models dynamically if not seeded
      const Category = (await import('../models/Category.js')).default;
      const { ConceptNote, Inspiration, Testimonial } = await import('../models/Resource.js');

      const catCount = await Category.countDocuments();
      if (catCount === 0) {
        const catHandbooks = await Category.create({ name: 'Handbooks', description: 'Curated strategy handbooks', isSystemPillar: true });
        const catTestimonials = await Category.create({ name: 'Testimonials', description: 'Partner testimonials', isSystemPillar: true });
        const catInspirations = await Category.create({ name: 'Inspirations', description: 'Founder insights', isSystemPillar: true });

        await ConceptNote.create({
          title: 'Strategy Masterclass Handbook',
          description: 'Curated guidelines on navigating critical seed milestones, investor coordination meetings, and board level alignments.',
          category: catHandbooks.name,
          readTimeMinutes: 8,
          chapters: ['Pillars of Alignment', 'Crafting Investor Coherence', 'Post-Investment Fitment'],
          author: 'Pathfinder Studio',
        });
        await ConceptNote.create({
          title: 'Early Stage Ascent Playbook',
          description: 'Comprehensive handbook covering initial funding routes, founder alignments, and product fitment structures.',
          category: catHandbooks.name,
          readTimeMinutes: 15,
          chapters: ['Mapping Market Vectors', 'Building Savant Systems', 'Sequenced Product Ascents'],
          author: 'Pathfinder Studio',
        });
        await Testimonial.create({
          title: 'Marc Andreessen',
          clientName: 'Marc Andreessen',
          clientCompany: 'General Partner, Andreessen Horowitz (a16z)',
          quote: 'Pathfinder builds alignment and rigor in 0-to-1 founder teams like no other studio we have worked with. They sequence decisions with absolute clarity.',
          category: catTestimonials.name,
        });
        await Testimonial.create({
          title: 'Sarah Tavel',
          clientName: 'Sarah Tavel',
          clientCompany: 'General Partner, Benchmark Capital',
          quote: 'Their choice architecture mappings are extremely rigorous. They help founders separate noise from actual signals to execute fast early-stage ascents.',
          category: catTestimonials.name,
        });
        await Inspiration.create({
          title: 'Naval Ravikant',
          personName: 'Naval Ravikant',
          roleTitle: 'Co-founder',
          companyName: 'AngelList',
          quote: 'Productize yourself. There is no other way. You want to be unique, you want to be authentic, and you want to scale.',
          category: catInspirations.name,
        });
        await Inspiration.create({
          title: 'Paul Graham',
          personName: 'Paul Graham',
          roleTitle: 'Co-founder',
          companyName: 'Y Combinator',
          quote: 'It is better to make a few users love you than a lot of users like you. Do things that don\'t scale.',
          category: catInspirations.name,
        });
      }

      if (email === 'admin@pathfinder.build') {
        user = adminUser;
      } else {
        user = await User.findOne({ email }).select('+password');
      }
    }

    if (!user) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    // Compare hashed passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        'Login successful'
      )
    );
  } catch (error) {
    next(error);
  }
};
