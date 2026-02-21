# ExamInsight - Question Paper Pattern Analysis System

A full-stack web application for analyzing examination question patterns across subjects, years, units, topics, marks, and difficulty levels.

## 🚀 Features

- **PDF & Image Upload with OCR**: 
  - Upload text-based PDFs for instant extraction
  - Upload scanned PDFs or images (JPG, PNG) with automatic OCR using Tesseract.js
  - Real-time progress indicator for OCR processing
- **Automatic Question Detection**: Intelligently detects questions using pattern matching (1., Q1, Question 1, etc.)
- **Smart Marks Detection**: Automatically extracts marks from patterns like "(10 marks)", "10M", "[10]"
- **Auto Difficulty Classification**: 
  - 1-5 marks → Easy
  - 6-10 marks → Medium
  - 11+ marks → Hard
- **Review Before Save**: Preview and edit detected questions before saving to database
- **Manual Entry**: Add individual questions manually through a form
- **Comprehensive Analysis**:
  - Topic frequency (sorted by occurrence)
  - Unit-wise total marks distribution
  - Year-wise question trends
  - Difficulty distribution
- **Interactive Visualizations**: Chart.js powered bar charts and pie charts
- **Clean, Responsive UI**: Modern gradient design that works on all devices
- **MongoDB Aggregation**: Efficient data analysis using aggregation pipelines

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)

## 🛠️ Installation Steps

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- express (web server framework)
- mongoose (MongoDB ODM)
- cors (cross-origin resource sharing)

### 2. Set Up MongoDB

#### Option A: Local MongoDB Installation

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Verify MongoDB is running:
```bash
mongosh
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Set environment variable:
```bash
# Windows (PowerShell)
$env:MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/examinsight"

# macOS/Linux
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/examinsight"
```

### 3. MongoDB Connection Configuration

The application connects to MongoDB using the following default URI:
```
mongodb://localhost:27017/examinsight
```

To use a different MongoDB URI, set the `MONGODB_URI` environment variable before starting the server.

## ▶️ Running the Application

Start the server with:

```bash
node server.js
```

You should see:
```
🚀 Server running on http://localhost:3000
✅ Connected to MongoDB
```

## 🌱 Seeding Sample Data (Optional)

To populate the database with sample questions across all subjects:

```bash
node seedData.js
```

This will add sample questions for:
- **Mathematics** (Algebra, Calculus, Trigonometry)
- **Botany** (Plant Physiology, Genetics, Biotechnology)
- **Physics** (Mechanics, Electromagnetism, Modern Physics)
- **Chemistry** (Physical, Organic, Inorganic)
- **Telugu** (Grammar, Literature, Composition)
- **Sanskrit** (Grammar, Literature, Translation)

Each subject has questions across multiple units with varying difficulty levels (Easy, Medium, Hard) and marks.

## 🌐 Using the Application

1. Open your browser and navigate to: `http://localhost:3000`

2. **Upload PDF Question Paper:**
   - Click "Choose File" and select a PDF question paper OR an image (JPG/PNG)
   - Click "Extract Questions from PDF"
   - **For scanned PDFs/images**: Wait for OCR processing (you'll see a progress bar)
   - **For text-based PDFs**: Extraction is instant
   - Review the extracted text preview
   - See all detected questions with auto-detected marks and difficulty
   - Enter subject and year for all questions
   - Edit individual question details (unit, topic, marks)
   - Click "Confirm & Save All Questions" to store in database

3. **Add Questions Manually:**
   - Scroll to "Add Question Manually" section
   - Fill in the form with question details
   - Click "Add Question"
   - You'll see a success message

4. **View Analysis:**
   - Click "Topic Frequency" to see which topics appear most often
   - Click "Unit Weightage" to see total marks per unit
   - Click "Year Trend" to see question counts by year
   - Click "Difficulty Distribution" to see easy/medium/hard breakdown

5. **View Charts:**
   - Bar chart displays topic frequency
   - Pie chart shows difficulty distribution

## 📁 Project Structure

```
examinsight/
├── public/
│   ├── index.html      # Frontend HTML
│   ├── style.css       # Styling
│   └── script.js       # Frontend JavaScript
├── models/
│   └── Question.js     # Mongoose schema
├── server.js           # Express server & API routes
├── package.json        # Dependencies
└── README.md          # Documentation
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Add a new question |
| GET | `/analysis/topic` | Get topic frequency (sorted descending) |
| GET | `/analysis/unit` | Get unit-wise total marks |
| GET | `/analysis/year` | Get year-wise question count |
| GET | `/analysis/difficulty` | Get difficulty distribution |

## 🧪 Testing the API

You can test the API using curl or Postman:

```bash
# Add a question
curl -X POST http://localhost:3000/add \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "year": 2024,
    "unit": "Unit 1",
    "topic": "Calculus",
    "marks": 10,
    "difficulty": "Medium"
  }'

# Get topic frequency
curl http://localhost:3000/analysis/topic
```

## 🛑 Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**
- Make sure MongoDB is running
- Check if port 27017 is available
- Verify your connection string

### Port Already in Use

**Error: "EADDRINUSE"**
- Another application is using port 3000
- Change the PORT in server.js or kill the process using port 3000

### Dependencies Not Found

**Error: "Cannot find module"**
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

## 🎨 Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Chart.js, PDF.js, Tesseract.js (OCR)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **PDF Processing:** PDF.js for text extraction
- **OCR:** Tesseract.js for scanned PDFs and images
- **Features:** CORS, Async/Await, Aggregation Pipelines, Pattern Matching

## 📝 Sample Data

Here's some sample data you can add to test the system:

```json
{
  "subject": "Computer Science",
  "year": 2024,
  "unit": "Unit 1",
  "topic": "Data Structures",
  "marks": 15,
  "difficulty": "Hard"
}
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📄 License

ISC License - Feel free to use this project for educational purposes.
