const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinsight';

// Additional questions for all subjects
const additionalQuestions = [
  // ==================== MATHEMATICS (20 more) ====================
  // Unit 1 - Algebra
  { subject: 'Mathematics', year: 2022, unit: 'Unit 1', topic: 'Sequences and Series', marks: 3, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2022, unit: 'Unit 1', topic: 'Binomial Theorem', marks: 6, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 1', topic: 'Permutations', marks: 4, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 1', topic: 'Combinations', marks: 7, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 1', topic: 'Mathematical Induction', marks: 11, difficulty: 'Hard' },
  
  // Unit 2 - Calculus
  { subject: 'Mathematics', year: 2022, unit: 'Unit 2', topic: 'Continuity', marks: 4, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2022, unit: 'Unit 2', topic: 'Maxima and Minima', marks: 9, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 2', topic: 'Definite Integrals', marks: 10, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 2', topic: 'Area Under Curves', marks: 12, difficulty: 'Hard' },
  
  // Unit 3 - Trigonometry & Vectors
  { subject: 'Mathematics', year: 2022, unit: 'Unit 3', topic: 'Vector Algebra', marks: 5, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2022, unit: 'Unit 3', topic: 'Three Dimensional Geometry', marks: 8, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 3', topic: 'Scalar Triple Product', marks: 9, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 3', topic: 'Vector Triple Product', marks: 13, difficulty: 'Hard' },
  
  // Unit 4 - Probability & Statistics
  { subject: 'Mathematics', year: 2022, unit: 'Unit 4', topic: 'Probability', marks: 3, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 4', topic: 'Conditional Probability', marks: 6, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 4', topic: 'Bayes Theorem', marks: 8, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2022, unit: 'Unit 4', topic: 'Mean and Variance', marks: 5, difficulty: 'Easy' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 4', topic: 'Binomial Distribution', marks: 10, difficulty: 'Medium' },
  { subject: 'Mathematics', year: 2024, unit: 'Unit 4', topic: 'Normal Distribution', marks: 12, difficulty: 'Hard' },
  { subject: 'Mathematics', year: 2023, unit: 'Unit 4', topic: 'Correlation', marks: 7, difficulty: 'Medium' },

  // ==================== BOTANY (20 more) ====================
  // Unit 1 - Plant Physiology
  { subject: 'Botany', year: 2022, unit: 'Unit 1', topic: 'Mineral Nutrition', marks: 3, difficulty: 'Easy' },
  { subject: 'Botany', year: 2022, unit: 'Unit 1', topic: 'Nitrogen Metabolism', marks: 7, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 1', topic: 'Enzyme Kinetics', marks: 9, difficulty: 'Medium' },
  { subject: 'Botany', year: 2023, unit: 'Unit 1', topic: 'Plant Hormones', marks: 11, difficulty: 'Hard' },
  { subject: 'Botany', year: 2022, unit: 'Unit 1', topic: 'Photoperiodism', marks: 5, difficulty: 'Easy' },
  
  // Unit 2 - Genetics & Evolution
  { subject: 'Botany', year: 2022, unit: 'Unit 2', topic: 'Linkage and Crossing Over', marks: 4, difficulty: 'Easy' },
  { subject: 'Botany', year: 2022, unit: 'Unit 2', topic: 'Sex Determination', marks: 6, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 2', topic: 'Mutation', marks: 8, difficulty: 'Medium' },
  { subject: 'Botany', year: 2023, unit: 'Unit 2', topic: 'Evolution Theory', marks: 10, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 2', topic: 'Molecular Evolution', marks: 13, difficulty: 'Hard' },
  
  // Unit 3 - Biotechnology & Ecology
  { subject: 'Botany', year: 2022, unit: 'Unit 3', topic: 'Plant Breeding', marks: 5, difficulty: 'Easy' },
  { subject: 'Botany', year: 2022, unit: 'Unit 3', topic: 'Transgenic Plants', marks: 8, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 3', topic: 'Biofertilizers', marks: 6, difficulty: 'Medium' },
  { subject: 'Botany', year: 2023, unit: 'Unit 3', topic: 'Biopesticides', marks: 7, difficulty: 'Medium' },
  
  // Unit 4 - Plant Taxonomy
  { subject: 'Botany', year: 2022, unit: 'Unit 4', topic: 'Plant Classification', marks: 3, difficulty: 'Easy' },
  { subject: 'Botany', year: 2023, unit: 'Unit 4', topic: 'Angiosperm Families', marks: 6, difficulty: 'Medium' },
  { subject: 'Botany', year: 2024, unit: 'Unit 4', topic: 'Gymnosperm Features', marks: 8, difficulty: 'Medium' },
  { subject: 'Botany', year: 2022, unit: 'Unit 4', topic: 'Pteridophytes', marks: 5, difficulty: 'Easy' },
  { subject: 'Botany', year: 2023, unit: 'Unit 4', topic: 'Bryophytes', marks: 4, difficulty: 'Easy' },
  { subject: 'Botany', year: 2024, unit: 'Unit 4', topic: 'Plant Anatomy', marks: 10, difficulty: 'Medium' },

  // ==================== PHYSICS (20 more) ====================
  // Unit 1 - Mechanics
  { subject: 'Physics', year: 2022, unit: 'Unit 1', topic: 'Kinematics', marks: 3, difficulty: 'Easy' },
  { subject: 'Physics', year: 2022, unit: 'Unit 1', topic: 'Momentum', marks: 6, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 1', topic: 'Collision', marks: 9, difficulty: 'Medium' },
  { subject: 'Physics', year: 2023, unit: 'Unit 1', topic: 'Simple Harmonic Motion', marks: 11, difficulty: 'Hard' },
  { subject: 'Physics', year: 2022, unit: 'Unit 1', topic: 'Elasticity', marks: 5, difficulty: 'Easy' },
  
  // Unit 2 - Electromagnetism & Optics
  { subject: 'Physics', year: 2022, unit: 'Unit 2', topic: 'Coulomb\'s Law', marks: 4, difficulty: 'Easy' },
  { subject: 'Physics', year: 2022, unit: 'Unit 2', topic: 'Capacitance', marks: 7, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 2', topic: 'AC Circuits', marks: 10, difficulty: 'Medium' },
  { subject: 'Physics', year: 2023, unit: 'Unit 2', topic: 'Electromagnetic Waves', marks: 12, difficulty: 'Hard' },
  
  // Unit 3 - Modern Physics & Optics
  { subject: 'Physics', year: 2022, unit: 'Unit 3', topic: 'Wave Optics', marks: 5, difficulty: 'Easy' },
  { subject: 'Physics', year: 2022, unit: 'Unit 3', topic: 'Interference', marks: 8, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 3', topic: 'Diffraction', marks: 9, difficulty: 'Medium' },
  { subject: 'Physics', year: 2023, unit: 'Unit 3', topic: 'Polarization', marks: 7, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 3', topic: 'Quantum Mechanics', marks: 14, difficulty: 'Hard' },
  
  // Unit 4 - Thermodynamics
  { subject: 'Physics', year: 2022, unit: 'Unit 4', topic: 'Heat Transfer', marks: 3, difficulty: 'Easy' },
  { subject: 'Physics', year: 2023, unit: 'Unit 4', topic: 'Laws of Thermodynamics', marks: 8, difficulty: 'Medium' },
  { subject: 'Physics', year: 2024, unit: 'Unit 4', topic: 'Carnot Engine', marks: 10, difficulty: 'Medium' },
  { subject: 'Physics', year: 2022, unit: 'Unit 4', topic: 'Kinetic Theory', marks: 6, difficulty: 'Medium' },
  { subject: 'Physics', year: 2023, unit: 'Unit 4', topic: 'Entropy', marks: 12, difficulty: 'Hard' },
  { subject: 'Physics', year: 2024, unit: 'Unit 4', topic: 'Statistical Mechanics', marks: 13, difficulty: 'Hard' },

  // ==================== CHEMISTRY (20 more) ====================
  // Unit 1 - Physical Chemistry
  { subject: 'Chemistry', year: 2022, unit: 'Unit 1', topic: 'States of Matter', marks: 3, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2022, unit: 'Unit 1', topic: 'Solutions', marks: 6, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 1', topic: 'Colligative Properties', marks: 9, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 1', topic: 'Chemical Equilibrium', marks: 11, difficulty: 'Hard' },
  { subject: 'Chemistry', year: 2022, unit: 'Unit 1', topic: 'Ionic Equilibrium', marks: 7, difficulty: 'Medium' },
  
  // Unit 2 - Organic Chemistry
  { subject: 'Chemistry', year: 2022, unit: 'Unit 2', topic: 'Isomerism', marks: 4, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2022, unit: 'Unit 2', topic: 'Carboxylic Acids', marks: 7, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 2', topic: 'Amines', marks: 8, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 2', topic: 'Polymers', marks: 10, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 2', topic: 'Organic Synthesis', marks: 13, difficulty: 'Hard' },
  
  // Unit 3 - Inorganic Chemistry
  { subject: 'Chemistry', year: 2022, unit: 'Unit 3', topic: 'Chemical Bonding', marks: 5, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2022, unit: 'Unit 3', topic: 'p-Block Elements', marks: 8, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 3', topic: 'd-Block Elements', marks: 9, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 3', topic: 'f-Block Elements', marks: 12, difficulty: 'Hard' },
  
  // Unit 4 - Analytical Chemistry
  { subject: 'Chemistry', year: 2022, unit: 'Unit 4', topic: 'Qualitative Analysis', marks: 3, difficulty: 'Easy' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 4', topic: 'Quantitative Analysis', marks: 6, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 4', topic: 'Chromatography', marks: 8, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2022, unit: 'Unit 4', topic: 'Spectroscopy', marks: 10, difficulty: 'Medium' },
  { subject: 'Chemistry', year: 2023, unit: 'Unit 4', topic: 'NMR Spectroscopy', marks: 12, difficulty: 'Hard' },
  { subject: 'Chemistry', year: 2024, unit: 'Unit 4', topic: 'Mass Spectrometry', marks: 11, difficulty: 'Hard' },

  // ==================== TELUGU (20 more) ====================
  // Unit 1 - Grammar
  { subject: 'Telugu', year: 2022, unit: 'Unit 1', topic: 'Pratyayas', marks: 3, difficulty: 'Easy' },
  { subject: 'Telugu', year: 2022, unit: 'Unit 1', topic: 'Upasargas', marks: 4, difficulty: 'Easy' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 1', topic: 'Samasalu', marks: 6, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 1', topic: 'Kridantalu', marks: 7, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2022, unit: 'Unit 1', topic: 'Avyayalu', marks: 5, difficulty: 'Easy' },
  
  // Unit 2 - Literature
  { subject: 'Telugu', year: 2022, unit: 'Unit 2', topic: 'Kavya Lakshana', marks: 6, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2022, unit: 'Unit 2', topic: 'Prabandha Kavyalu', marks: 8, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 2', topic: 'Muktaka Kavyalu', marks: 7, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 2', topic: 'Natakalu', marks: 9, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 2', topic: 'Gadya Sahityam', marks: 11, difficulty: 'Hard' },
  
  // Unit 3 - Composition & Translation
  { subject: 'Telugu', year: 2022, unit: 'Unit 3', topic: 'Paragraph Writing', marks: 5, difficulty: 'Easy' },
  { subject: 'Telugu', year: 2022, unit: 'Unit 3', topic: 'Story Writing', marks: 8, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 3', topic: 'Dialogue Writing', marks: 6, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 3', topic: 'Report Writing', marks: 7, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 3', topic: 'Translation', marks: 10, difficulty: 'Medium' },
  
  // Unit 4 - Modern Literature
  { subject: 'Telugu', year: 2022, unit: 'Unit 4', topic: 'Modern Poetry', marks: 6, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 4', topic: 'Short Stories', marks: 8, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2024, unit: 'Unit 4', topic: 'Novel Analysis', marks: 10, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2022, unit: 'Unit 4', topic: 'Contemporary Writers', marks: 7, difficulty: 'Medium' },
  { subject: 'Telugu', year: 2023, unit: 'Unit 4', topic: 'Literary Movements', marks: 12, difficulty: 'Hard' },

  // ==================== SANSKRIT (20 more) ====================
  // Unit 1 - Grammar
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 1', topic: 'Pratyaya', marks: 3, difficulty: 'Easy' },
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 1', topic: 'Upasarga', marks: 4, difficulty: 'Easy' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 1', topic: 'Taddhita', marks: 6, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 1', topic: 'Kridanta', marks: 7, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 1', topic: 'Avyaya', marks: 5, difficulty: 'Easy' },
  
  // Unit 2 - Classical Literature
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 2', topic: 'Upanishads', marks: 6, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 2', topic: 'Puranas', marks: 7, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 2', topic: 'Meghaduta', marks: 9, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 2', topic: 'Shakuntala', marks: 10, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 2', topic: 'Kumarasambhava', marks: 12, difficulty: 'Hard' },
  
  // Unit 3 - Translation & Comprehension
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 3', topic: 'Prose Translation', marks: 5, difficulty: 'Easy' },
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 3', topic: 'Poetry Translation', marks: 7, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 3', topic: 'Unseen Passage', marks: 8, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 3', topic: 'Composition', marks: 10, difficulty: 'Medium' },
  
  // Unit 4 - Philosophy & Ethics
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 4', topic: 'Vedanta Philosophy', marks: 6, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 4', topic: 'Yoga Sutras', marks: 8, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 4', topic: 'Bhagavad Gita', marks: 10, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2022, unit: 'Unit 4', topic: 'Nyaya Philosophy', marks: 7, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2023, unit: 'Unit 4', topic: 'Mimamsa', marks: 9, difficulty: 'Medium' },
  { subject: 'Sanskrit', year: 2024, unit: 'Unit 4', topic: 'Sankhya Philosophy', marks: 11, difficulty: 'Hard' }
];

async function addMoreQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Insert additional questions
    const result = await Question.insertMany(additionalQuestions);
    console.log(`✅ Successfully added ${result.length} additional questions`);

    // Show summary
    const subjects = await Question.distinct('subject');
    console.log('\n📊 Updated Summary:');
    
    for (const subject of subjects) {
      const count = await Question.countDocuments({ subject });
      console.log(`   ${subject}: ${count} questions`);
    }

    console.log('\n🎉 Additional questions added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding questions:', error);
    process.exit(1);
  }
}

// Run the function
addMoreQuestions();
