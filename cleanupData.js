const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinsight';

async function cleanupDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove duplicate/incorrect entries
    const result1 = await Question.deleteMany({ subject: 'BOTNY' });
    console.log(`🗑️  Removed ${result1.deletedCount} questions with subject "BOTNY"`);

    const result2 = await Question.deleteMany({ subject: 'mathematics' });
    console.log(`🗑️  Removed ${result2.deletedCount} questions with subject "mathematics"`);

    // Show summary
    const subjects = await Question.distinct('subject');
    console.log('\n📊 Remaining subjects:');
    
    for (const subject of subjects) {
      const count = await Question.countDocuments({ subject });
      console.log(`   ${subject}: ${count} questions`);
    }

    console.log('\n🎉 Cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
}

// Run the cleanup function
cleanupDatabase();
