const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Question = require('./models/Question');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/examinsight';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes

// POST /add - Add new question
app.post('/add', async (req, res) => {
  try {
    const { subject, year, unit, topic, marks, difficulty } = req.body;
    
    // Validation
    if (!subject || !year || !unit || !topic || !marks || !difficulty) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const question = new Question({
      subject,
      year,
      unit,
      topic,
      marks,
      difficulty
    });
    
    await question.save();
    console.log('✅ Question added:', question);
    res.status(201).json({ success: true, message: 'Question added successfully', data: question });
  } catch (error) {
    console.error('❌ Error adding question:', error);
    res.status(400).json({ success: false, message: 'Error adding question', error: error.message });
  }
});

// GET /analysis/topic - Topic frequency (sorted descending)
app.get('/analysis/topic', async (req, res) => {
  try {
    const subjectFilter = req.query.subject;
    
    const pipeline = [];
    
    // Add subject filter if specified
    if (subjectFilter) {
      pipeline.push({ $match: { subject: subjectFilter } });
    }
    
    pipeline.push(
      {
        $group: {
          _id: {
            subject: '$subject',
            topic: '$topic'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.subject': 1, count: -1 }
      },
      {
        $group: {
          _id: '$_id.subject',
          topics: {
            $push: {
              topic: '$_id.topic',
              count: '$count'
            }
          },
          totalQuestions: { $sum: '$count' }
        }
      },
      {
        $project: {
          _id: 0,
          subject: '$_id',
          topics: 1,
          totalQuestions: 1
        }
      },
      {
        $sort: { subject: 1 }
      }
    );
    
    const topicFrequency = await Question.aggregate(pipeline);
    
    console.log('📊 Topic frequency analysis (subject-wise):', JSON.stringify(topicFrequency, null, 2));
    res.json({ success: true, data: topicFrequency });
  } catch (error) {
    console.error('❌ Error in topic analysis:', error);
    res.status(500).json({ success: false, message: 'Error analyzing topics', error: error.message });
  }
});

// GET /analysis/unit - Unit-wise total marks
app.get('/analysis/unit', async (req, res) => {
  try {
    const subjectFilter = req.query.subject;
    
    const pipeline = [];
    
    // Add subject filter if specified
    if (subjectFilter) {
      pipeline.push({ $match: { subject: subjectFilter } });
    }
    
    pipeline.push(
      {
        $group: {
          _id: {
            subject: '$subject',
            unit: '$unit'
          },
          totalMarks: { $sum: '$marks' },
          questionCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.subject': 1, totalMarks: -1 }
      },
      {
        $group: {
          _id: '$_id.subject',
          units: {
            $push: {
              unit: '$_id.unit',
              totalMarks: '$totalMarks',
              questionCount: '$questionCount'
            }
          },
          subjectTotalMarks: { $sum: '$totalMarks' }
        }
      },
      {
        $project: {
          _id: 0,
          subject: '$_id',
          units: 1,
          subjectTotalMarks: 1
        }
      },
      {
        $sort: { subject: 1 }
      }
    );
    
    const unitWeightage = await Question.aggregate(pipeline);
    
    console.log('📊 Unit weightage analysis (subject-wise):', JSON.stringify(unitWeightage, null, 2));
    res.json({ success: true, data: unitWeightage });
  } catch (error) {
    console.error('❌ Error in unit analysis:', error);
    res.status(500).json({ success: false, message: 'Error analyzing units', error: error.message });
  }
});

// GET /analysis/year - Year-wise question count
app.get('/analysis/year', async (req, res) => {
  try {
    const subjectFilter = req.query.subject;
    
    const pipeline = [];
    
    // Add subject filter if specified
    if (subjectFilter) {
      pipeline.push({ $match: { subject: subjectFilter } });
    }
    
    pipeline.push(
      {
        $group: {
          _id: {
            subject: '$subject',
            year: '$year'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.subject': 1, '_id.year': 1 }
      },
      {
        $group: {
          _id: '$_id.subject',
          years: {
            $push: {
              year: '$_id.year',
              count: '$count'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          subject: '$_id',
          years: 1
        }
      },
      {
        $sort: { subject: 1 }
      }
    );
    
    const yearTrend = await Question.aggregate(pipeline);
    
    console.log('📊 Year trend analysis (subject-wise):', JSON.stringify(yearTrend, null, 2));
    res.json({ success: true, data: yearTrend });
  } catch (error) {
    console.error('❌ Error in year analysis:', error);
    res.status(500).json({ success: false, message: 'Error analyzing years', error: error.message });
  }
});

// GET /analysis/difficulty - Difficulty distribution
app.get('/analysis/difficulty', async (req, res) => {
  try {
    const subjectFilter = req.query.subject;
    
    const pipeline = [];
    
    // Add subject filter if specified
    if (subjectFilter) {
      pipeline.push({ $match: { subject: subjectFilter } });
    }
    
    pipeline.push(
      {
        $group: {
          _id: {
            subject: '$subject',
            difficulty: '$difficulty'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.subject': 1, count: -1 }
      },
      {
        $group: {
          _id: '$_id.subject',
          difficulties: {
            $push: {
              difficulty: '$_id.difficulty',
              count: '$count'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          subject: '$_id',
          difficulties: 1
        }
      },
      {
        $sort: { subject: 1 }
      }
    );
    
    const difficultyDistribution = await Question.aggregate(pipeline);
    
    console.log('📊 Difficulty distribution analysis (subject-wise):', JSON.stringify(difficultyDistribution, null, 2));
    res.json({ success: true, data: difficultyDistribution });
  } catch (error) {
    console.error('❌ Error in difficulty analysis:', error);
    res.status(500).json({ success: false, message: 'Error analyzing difficulty', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// GET /subjects - Get list of unique subjects
app.get('/subjects', async (req, res) => {
  try {
    const subjects = await Question.distinct('subject');
    console.log('📚 Available subjects:', subjects);
    res.json({ success: true, data: subjects });
  } catch (error) {
    console.error('❌ Error fetching subjects:', error);
    res.status(500).json({ success: false, message: 'Error fetching subjects', error: error.message });
  }
});
