const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinsight';

// Sample questions for all subjects
const sampleQuestions = [
  // ==================== MATHEMATICS ====================
  // Unit 1 - Algebra
  { subject: 'Mathematics', year: 2023, unit: 'Unit 1', topic: 'Quadratic Equations', marks: 2, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 1', topic: 'Quadratic Equations', marks: 5, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 1', topic: 'Matrices', marks: 8, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 1', topic: 'Determinants', marks: 10, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 1', topic: 'Complex Numbers', marks: 12, difficulty: 'Hard' },
  
  // Unit 2 - Calculus
  { subject: 'Mathematics', year: 2023, unit: 'Unit 2', topic: 'Differentiation', marks: 3, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 2', topic: 'Integration', marks: 8, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 2', topic: 'Limits', marks: 5, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 2', topic: 'Differential Equations', marks: 15, difficulty: 'Hard' },
  
  // Unit 3 - Trigonometry
  { subject: 'Mathematics', year: 2023, unit: 'Unit 3', topic: 'Trigonometric Identities', marks: 4, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 3', topic: 'Inverse Trigonometry', marks: 7, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 3', topic: 'Trigonometric Equations', marks: 10, difficulty: 'Medium' },
  
  // ==================== BOTANY ====================
  // Unit 1 - Plant Physiology
  { subject: 'Botany', year: 2023, unit: 'Unit 1', topic: 'Photosynthesis', marks: 2, difficulty: 'Easy' },
  { subject: 'Botany', year: 2023, unit: 'Unit 1', topic: 'Photosynthesis', marks: 8, difficulty: 'Medium' },
  { subject: 'Botany', year: 2023, unit: 'Unit 1', topic: 'Respiration', marks: 6, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 1', topic: 'Plant Growth', marks: 10, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 1', topic: 'Water Relations', marks: 12, difficulty: 'Hard' },
  
  // Unit 2 - Genetics
  { subject: 'Botany', year: 2023, unit: 'Unit 2', topic: 'Mendelian Genetics', marks: 5, difficulty: 'Easy' },
  { subject: 'Botany', year: 2023, unit: 'Unit 2', topic: 'DNA Structure', marks: 8, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 2', topic: 'Gene Expression', marks: 10, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 2', topic: 'Chromosomal Theory', marks: 15, difficulty: 'Hard' },
  
  // Unit 3 - Plant Biotechnology
  { subject: 'Botany', year: 2023, unit: 'Unit 3', topic: 'Tissue Culture', marks: 4, difficulty: 'Easy' },
  { subject: 'Botany', year: 2023, unit: 'Unit 3', topic: 'Genetic Engineering', marks: 9, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 3', topic: 'Recombinant DNA', marks: 12, difficulty: 'Hard' },
  
  // ==================== PHYSICS ====================
  // Unit 1 - Mechanics
  { subject: 'Physics', year: 2023, unit: 'Unit 1', topic: 'Newton\'s Laws', marks: 2, difficulty: 'Easy' },
  { subject: 'Physics', year: 2023, unit: 'Unit 1', topic: 'Work and Energy', marks: 5, difficulty: 'Easy' },
  { subject: 'Physics', year: 2023, unit: 'Unit 1', topic: 'Rotational Motion', marks: 8, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 1', topic: 'Gravitation', marks: 10, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 1', topic: 'Fluid Mechanics', marks: 12, difficulty: 'Hard' },
  
  // Unit 2 - Electromagnetism
  { subject: 'Physics', year: 2023, unit: 'Unit 2', topic: 'Electric Field', marks: 3, difficulty: 'Easy' },
  { subject: 'Physics', year: 2023, unit: 'Unit 2', topic: 'Magnetic Field', marks: 7, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 2', topic: 'Electromagnetic Induction', marks: 10, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 2', topic: 'Maxwell\'s Equations', marks: 15, difficulty: 'Hard' },
  
  // Unit 3 - Modern Physics
  { subject: 'Physics', year: 2023, unit: 'Unit 3', topic: 'Photoelectric Effect', marks: 4, difficulty: 'Easy' },
  { subject: 'Physics', year: 2023, unit: 'Unit 3', topic: 'Atomic Structure', marks: 8, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 3', topic: 'Nuclear Physics', marks: 12, difficulty: 'Hard' },
  
  // ==================== CHEMISTRY ====================
  // Unit 1 - Physical Chemistry
  { subject: 'Chemistry', year: 2023, unit: 'Unit 1', topic: 'Atomic Structure', marks: 2, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 1', topic: 'Chemical Bonding', marks: 5, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 1', topic: 'Thermodynamics', marks: 8, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 1', topic: 'Chemical Kinetics', marks: 10, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 1', topic: 'Electrochemistry', marks: 12, difficulty: 'Hard' },
  
  // Unit 2 - Organic Chemistry
  { subject: 'Chemistry', year: 2023, unit: 'Unit 2', topic: 'Hydrocarbons', marks: 3, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 2', topic: 'Alcohols and Phenols', marks: 7, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 2', topic: 'Aldehydes and Ketones', marks: 9, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 2', topic: 'Biomolecules', marks: 15, difficulty: 'Hard' },
  
  // Unit 3 - Inorganic Chemistry
  { subject: 'Chemistry', year: 2023, unit: 'Unit 3', topic: 'Periodic Table', marks: 4, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 3', topic: 'Coordination Compounds', marks: 8, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 3', topic: 'Metallurgy', marks: 11, difficulty: 'Hard' },
  
  // ==================== TELUGU ====================
  // Unit 1 - Grammar
  { subject: 'Telugu', year: 2023, unit: 'Unit 1', topic: 'Sandhi', marks: 2, difficulty: 'Easy' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 1', topic: 'Samasa', marks: 4, difficulty: 'Easy' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 1', topic: 'Vibhakti', marks: 6, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 1', topic: 'Alankaras', marks: 8, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 1', topic: 'Chandas', marks: 10, difficulty: 'Medium' },
  
  // Unit 2 - Literature
  { subject: 'Telugu', year: 2023, unit: 'Unit 2', topic: 'Poetry Analysis', marks: 5, difficulty: 'Easy' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 2', topic: 'Prose Comprehension', marks: 8, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 2', topic: 'Drama', marks: 10, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 2', topic: 'Literary Criticism', marks: 12, difficulty: 'Hard' },
  
  // Unit 3 - Composition
  { subject: 'Telugu', year: 2023, unit: 'Unit 3', topic: 'Essay Writing', marks: 10, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 3', topic: 'Letter Writing', marks: 5, difficulty: 'Easy' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 3', topic: 'Precis Writing', marks: 8, difficulty: 'Medium' },
  
  // ==================== SANSKRIT ====================
  // Unit 1 - Grammar
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 1', topic: 'Sandhi Rules', marks: 2, difficulty: 'Easy' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 1', topic: 'Samasa', marks: 4, difficulty: 'Easy' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 1', topic: 'Karak', marks: 6, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 1', topic: 'Dhatu Roop', marks: 8, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 1', topic: 'Shabd Roop', marks: 10, difficulty: 'Medium' },
  
  // Unit 2 - Literature
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 2', topic: 'Vedic Literature', marks: 5, difficulty: 'Easy' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 2', topic: 'Ramayana', marks: 8, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 2', topic: 'Mahabharata', marks: 10, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 2', topic: 'Kalidasa Works', marks: 12, difficulty: 'Hard' },
  
  // Unit 3 - Translation
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 3', topic: 'Sanskrit to English', marks: 6, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 3', topic: 'English to Sanskrit', marks: 8, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 3', topic: 'Comprehension', marks: 10, difficulty: 'Medium' }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing questions (optional - comment out if you want to keep existing data)
    // await Question.deleteMany({});
    // console.log('🗑️  Cleared existing questions');

    // Insert sample questions
    const result = await Question.insertMany(sampleQuestions);
    console.log(`✅ Successfully added ${result.length} sample questions`);

    // Show summary
    const subjects = await Question.distinct('subject');
    console.log('\n📊 Summary:');
    
    for (const subject of subjects) {
      const count = await Question.countDocuments({ subject });
      console.log(`   ${subject}: ${count} questions`);
    }

    console.log('\n🎉 Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
