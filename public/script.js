const API_URL = 'http://localhost:3000';

let topicChartInstance = null;
let difficultyChartInstance = null;
let parsedQuestions = [];
let currentSubjectFilter = 'all';
let availableSubjects = [];

// Form submission handler
document.getElementById('questionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    subject: document.getElementById('subject').value,
    year: parseInt(document.getElementById('year').value),
    unit: document.getElementById('unit').value,
    topic: document.getElementById('topic').value,
    marks: parseInt(document.getElementById('marks').value),
    difficulty: document.getElementById('difficulty').value
  };

  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    
    if (result.success) {
      showMessage('Question added successfully! ✅', 'success');
      document.getElementById('questionForm').reset();
      console.log('✅ Question added:', result.data);
      
      // Refresh subject filter
      await loadSubjects();
    } else {
      showMessage('Error: ' + result.message, 'error');
      console.error('❌ Error:', result.message);
    }
  } catch (error) {
    showMessage('Failed to add question. Please try again.', 'error');
    console.error('❌ Network error:', error);
  }
});

// Load available subjects on page load
window.addEventListener('DOMContentLoaded', async () => {
  await loadSubjects();
});

// Load subjects for filter dropdown
async function loadSubjects() {
  try {
    const response = await fetch(`${API_URL}/subjects`);
    const result = await response.json();
    
    if (result.success) {
      availableSubjects = result.data;
      populateSubjectFilter();
      console.log('📚 Available subjects:', availableSubjects);
    }
  } catch (error) {
    console.error('❌ Error loading subjects:', error);
  }
}

// Populate subject filter dropdown
function populateSubjectFilter() {
  const select = document.getElementById('subjectFilter');
  const currentValue = select.value;
  
  // Clear existing options except "All"
  select.innerHTML = '<option value="all">All Subjects</option>';
  
  // Add subject options
  availableSubjects.forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    select.appendChild(option);
  });
  
  // Restore previous selection if it still exists
  if (availableSubjects.includes(currentValue)) {
    select.value = currentValue;
  }
}

// Handle subject filter change
function onSubjectFilterChange() {
  currentSubjectFilter = document.getElementById('subjectFilter').value;
  console.log('🔍 Filter changed to:', currentSubjectFilter);
  
  // Clear current results
  document.getElementById('textResults').innerHTML = '<p>Select an analysis type to view filtered results.</p>';
}

// Display message helper
function showMessage(message, type) {
  const messageDiv = document.getElementById('formMessage');
  messageDiv.textContent = message;
  messageDiv.className = type;
  
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

// Fetch and display topic frequency
async function fetchTopicFrequency() {
  try {
    const url = currentSubjectFilter === 'all' 
      ? `${API_URL}/analysis/topic`
      : `${API_URL}/analysis/topic?subject=${encodeURIComponent(currentSubjectFilter)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      displayTextResults('Topic Frequency Analysis', result.data, 'topic', 'count');
      renderTopicChart(result.data);
      console.log('📊 Topic frequency:', result.data);
    }
  } catch (error) {
    console.error('❌ Error fetching topic frequency:', error);
    alert('Failed to fetch topic frequency');
  }
}

// Fetch and display unit weightage
async function fetchUnitWeightage() {
  try {
    const url = currentSubjectFilter === 'all'
      ? `${API_URL}/analysis/unit`
      : `${API_URL}/analysis/unit?subject=${encodeURIComponent(currentSubjectFilter)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      displayTextResults('Unit Weightage Analysis', result.data, 'unit', 'totalMarks');
      console.log('📊 Unit weightage:', result.data);
    }
  } catch (error) {
    console.error('❌ Error fetching unit weightage:', error);
    alert('Failed to fetch unit weightage');
  }
}

// Fetch and display year trend
async function fetchYearTrend() {
  try {
    const url = currentSubjectFilter === 'all'
      ? `${API_URL}/analysis/year`
      : `${API_URL}/analysis/year?subject=${encodeURIComponent(currentSubjectFilter)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      displayTextResults('Year Trend Analysis', result.data, 'year', 'count');
      console.log('📊 Year trend:', result.data);
    }
  } catch (error) {
    console.error('❌ Error fetching year trend:', error);
    alert('Failed to fetch year trend');
  }
}

// Fetch and display difficulty distribution
async function fetchDifficultyDistribution() {
  try {
    const url = currentSubjectFilter === 'all'
      ? `${API_URL}/analysis/difficulty`
      : `${API_URL}/analysis/difficulty?subject=${encodeURIComponent(currentSubjectFilter)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      displayTextResults('Difficulty Distribution Analysis', result.data, 'difficulty', 'count');
      renderDifficultyChart(result.data);
      console.log('📊 Difficulty distribution:', result.data);
    }
  } catch (error) {
    console.error('❌ Error fetching difficulty distribution:', error);
    alert('Failed to fetch difficulty distribution');
  }
}

// Display text results
function displayTextResults(title, data, labelKey, valueKey) {
  const resultsDiv = document.getElementById('textResults');
  
  if (data.length === 0) {
    resultsDiv.innerHTML = `<h3>${title}</h3><p>No data available yet. Add some questions first!</p>`;
    return;
  }

  let html = `<h3>${title}</h3>`;
  
  // Check if data is subject-wise (nested structure)
  if (data[0] && (data[0].topics || data[0].units || data[0].years || data[0].difficulties)) {
    // Subject-wise display
    data.forEach(subjectData => {
      html += `<div class="subject-section">
        <h4 class="subject-title">📘 ${subjectData.subject}</h4>`;
      
      if (subjectData.topics) {
        // Topic frequency
        subjectData.topics.forEach(item => {
          html += `<div class="result-item">
            <strong>${item.topic}:</strong> ${item.count} questions
          </div>`;
        });
        html += `<div class="subject-total">Total: ${subjectData.totalQuestions} questions</div>`;
      } else if (subjectData.units) {
        // Unit weightage
        subjectData.units.forEach(item => {
          html += `<div class="result-item">
            <strong>${item.unit}:</strong> ${item.totalMarks} marks (${item.questionCount} questions)
          </div>`;
        });
        html += `<div class="subject-total">Total: ${subjectData.subjectTotalMarks} marks</div>`;
      } else if (subjectData.years) {
        // Year trend
        subjectData.years.forEach(item => {
          html += `<div class="result-item">
            <strong>${item.year}:</strong> ${item.count} questions
          </div>`;
        });
      } else if (subjectData.difficulties) {
        // Difficulty distribution
        subjectData.difficulties.forEach(item => {
          html += `<div class="result-item">
            <span class="difficulty-badge difficulty-${item.difficulty}">${item.difficulty}</span>: ${item.count} questions
          </div>`;
        });
      }
      
      html += `</div>`;
    });
  } else {
    // Legacy flat display (fallback)
    data.forEach(item => {
      html += `<div class="result-item">
        <strong>${item[labelKey]}:</strong> ${item[valueKey]} ${valueKey === 'totalMarks' ? 'marks' : ''}
      </div>`;
    });
  }
  
  resultsDiv.innerHTML = html;
}

// Render topic frequency bar chart
function renderTopicChart(data) {
  const ctx = document.getElementById('topicChart');
  
  if (topicChartInstance) {
    topicChartInstance.destroy();
  }

  // Prepare data for subject-wise display
  const datasets = [];
  const allTopics = new Set();
  
  // Collect all unique topics and organize by subject
  data.forEach(subjectData => {
    subjectData.topics.forEach(t => allTopics.add(t.topic));
  });
  
  const topicArray = Array.from(allTopics);
  
  // Create dataset for each subject
  const colors = [
    'rgba(30, 58, 138, 0.8)',    // Deep Blue
    'rgba(59, 130, 246, 0.8)',   // Soft Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Orange
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(107, 114, 128, 0.8)'   // Gray
  ];
  
  data.forEach((subjectData, index) => {
    const subjectCounts = topicArray.map(topic => {
      const found = subjectData.topics.find(t => t.topic === topic);
      return found ? found.count : 0;
    });
    
    datasets.push({
      label: subjectData.subject,
      data: subjectCounts,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.7', '1'),
      borderWidth: 2
    });
  });

  topicChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topicArray,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: 'Topic Frequency by Subject',
          font: { size: 16 }
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

// Render difficulty distribution pie chart
function renderDifficultyChart(data) {
  const ctx = document.getElementById('difficultyChart');
  
  if (difficultyChartInstance) {
    difficultyChartInstance.destroy();
  }

  // Aggregate all difficulties across subjects
  const difficultyMap = {};
  
  data.forEach(subjectData => {
    subjectData.difficulties.forEach(d => {
      if (!difficultyMap[d.difficulty]) {
        difficultyMap[d.difficulty] = 0;
      }
      difficultyMap[d.difficulty] += d.count;
    });
  });

  const labels = Object.keys(difficultyMap);
  const values = Object.values(difficultyMap);

  const colors = {
    'Easy': 'rgba(16, 185, 129, 0.8)',    // Green
    'Medium': 'rgba(245, 158, 11, 0.8)',  // Orange
    'Hard': 'rgba(239, 68, 68, 0.8)'      // Red
  };

  const backgroundColors = labels.map(label => colors[label] || 'rgba(201, 203, 207, 0.7)');

  difficultyChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: 'Overall Difficulty Distribution',
          font: { size: 16 }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// ==================== PDF UPLOAD & EXTRACTION ====================

// Upload and extract PDF
async function uploadPDF() {
  const fileInput = document.getElementById('pdfInput');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a PDF file first');
    return;
  }

  const fileType = file.type;
  const isImage = fileType.startsWith('image/');
  const isPDF = fileType === 'application/pdf';

  if (!isImage && !isPDF) {
    alert('Please select a valid PDF or image file (JPG, PNG)');
    return;
  }

  showUploadStatus('Processing file...', 'loading');
  console.log('📄 Starting file processing...', fileType);

  try {
    let text = '';
    
    if (isImage) {
      // Direct image OCR
      text = await extractTextFromImage(file);
    } else {
      // Try text extraction first
      text = await extractPDFText(file);
      
      // If no text extracted, use OCR on PDF pages
      if (!text || text.trim().length < 50) {
        console.log('⚠️ No text in PDF, switching to OCR mode...');
        showUploadStatus('PDF is image-based. Using OCR to extract text...', 'loading');
        text = await extractTextFromPDFWithOCR(file);
      }
    }
    
    console.log('✅ Text extracted successfully');
    console.log('📝 Extracted text preview:', text.substring(0, 1000));
    
    // Always display extracted text for debugging
    displayExtractedText(text);
    
    // Check if text is empty or too short
    if (!text || text.trim().length < 20) {
      showUploadStatus('⚠️ Could not extract meaningful text. Please ensure the image/PDF is clear and readable, or add questions manually.', 'error');
      return;
    }
    
    // Clean up OCR artifacts
    text = cleanOCRText(text);
    console.log('🧹 Cleaned text preview:', text.substring(0, 1000));
    
    const questions = parseQuestions(text);
    console.log(`✅ Detected ${questions.length} questions`);
    
    if (questions.length === 0) {
      showUploadStatus('⚠️ No questions detected. The extracted text is shown below. You may need to add questions manually.', 'error');
      return;
    }

    parsedQuestions = questions;
    displayParsedQuestions(questions);
    showUploadStatus(`Successfully extracted ${questions.length} questions!`, 'success');
    
  } catch (error) {
    console.error('❌ Error processing file:', error);
    showUploadStatus('Error processing file: ' + error.message, 'error');
  } finally {
    hideOCRProgress();
  }
}

// Extract text from PDF using pdf.js
async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  console.log(`📄 PDF has ${pdf.numPages} pages`);
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Better text extraction preserving layout
    let lastY = null;
    let pageText = '';
    
    textContent.items.forEach(item => {
      // Add newline if Y position changed significantly (new line)
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        pageText += '\n';
      }
      
      pageText += item.str + ' ';
      lastY = item.transform[5];
    });
    
    fullText += pageText + '\n\n';
    console.log(`✅ Extracted page ${i}/${pdf.numPages}`);
  }
  
  console.log(`📝 Total extracted text length: ${fullText.length} characters`);
  
  return fullText;
}

// Extract text from image using OCR
async function extractTextFromImage(file) {
  showOCRProgress('Initializing OCR...', 0);
  
  // Create image element for preprocessing
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size with higher resolution
  canvas.width = img.width * 2;
  canvas.height = img.height * 2;
  
  // Draw image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  // Preprocess
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  preprocessImage(imageData);
  ctx.putImageData(imageData, 0, 0);
  
  // Convert to blob
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  
  const { data: { text } } = await Tesseract.recognize(
    blob,
    'eng',
    {
      logger: info => {
        console.log(info);
        if (info.status === 'recognizing text') {
          const progress = Math.round(info.progress * 100);
          showOCRProgress(`Recognizing text: ${progress}%`, progress);
        }
      },
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:?!()[]{}/-\'" '
    }
  );
  
  return text;
}

// Extract text from PDF using OCR (for scanned PDFs)
async function extractTextFromPDFWithOCR(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  console.log(`📄 PDF has ${pdf.numPages} pages, starting OCR...`);
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    showOCRProgress(`Processing page ${i}/${pdf.numPages}...`, (i - 1) / pdf.numPages * 100);
    
    const page = await pdf.getPage(i);
    
    // Render page to canvas with higher scale for better OCR
    const viewport = page.getViewport({ scale: 3.0 }); // Increased scale
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    // Image preprocessing for better OCR
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    preprocessImage(imageData);
    context.putImageData(imageData, 0, 0);
    
    // Convert canvas to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    
    // OCR the page with optimized settings
    const { data: { text } } = await Tesseract.recognize(
      blob,
      'eng',
      {
        logger: info => {
          if (info.status === 'recognizing text') {
            const pageProgress = (i - 1) / pdf.numPages * 100;
            const ocrProgress = info.progress * (100 / pdf.numPages);
            showOCRProgress(`Page ${i}/${pdf.numPages}: ${Math.round(info.progress * 100)}%`, pageProgress + ocrProgress);
          }
        },
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:?!()[]{}/-\'" '
      }
    );
    
    fullText += text + '\n\n';
    console.log(`✅ OCR completed for page ${i}/${pdf.numPages}`);
    console.log(`📝 Page ${i} text preview:`, text.substring(0, 200));
  }
  
  return fullText;
}

// Preprocess image for better OCR (increase contrast, convert to grayscale)
function preprocessImage(imageData) {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    // Increase contrast (simple threshold)
    const threshold = 128;
    const value = gray > threshold ? 255 : 0;
    
    data[i] = value;     // Red
    data[i + 1] = value; // Green
    data[i + 2] = value; // Blue
    // Alpha channel (data[i + 3]) remains unchanged
  }
}

// Clean OCR text artifacts
function cleanOCRText(text) {
  // Remove common OCR errors
  text = text.replace(/[|]/g, 'I'); // Pipe to I
  text = text.replace(/[`']/g, "'"); // Backticks to apostrophe
  text = text.replace(/\s+/g, ' '); // Multiple spaces to single
  text = text.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between camelCase
  
  // Fix common number/letter confusions
  text = text.replace(/\bO\b/g, '0'); // Letter O to zero in isolation
  text = text.replace(/\bl\b/g, '1'); // Letter l to one in isolation
  
  return text.trim();
}

// Show OCR progress
function showOCRProgress(message, progress) {
  const progressDiv = document.getElementById('ocrProgress');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  progressDiv.style.display = 'block';
  progressFill.style.width = progress + '%';
  progressText.textContent = message;
}

// Hide OCR progress
function hideOCRProgress() {
  const progressDiv = document.getElementById('ocrProgress');
  progressDiv.style.display = 'none';
}

// Parse questions from extracted text
function parseQuestions(text) {
  const questions = [];
  
  console.log('📝 Parsing text, length:', text.length);
  console.log('📝 First 500 chars:', text.substring(0, 500));
  
  // Enhanced patterns for question detection
  const questionPatterns = [
    /(?:^|\n)\s*(\d+)\s*\.\s*/gm,                    // "1. ", "2. " with flexible spacing
    /(?:^|\n)\s*(\d+)\s*\)\s*/gm,                    // "1) ", "2) "
    /(?:^|\n)\s*Q\.?\s*(\d+)[:\.\)\s]+/gim,          // "Q1:", "Q.1 ", "Q 1)", "Q1."
    /(?:^|\n)\s*Question\s+(\d+)[:\.\)\s]+/gim,      // "Question 1:", "Question 1)"
    /(?:^|\n)\s*\[(\d+)\]\s*/gm,                     // "[1] ", "[2] "
    /(?:^|\n)\s*\((\d+)\)\s*/gm                      // "(1) ", "(2) "
  ];
  
  // Try to split text using multiple patterns
  let detectedQuestions = [];
  
  // Method 1: Try each pattern
  for (const pattern of questionPatterns) {
    pattern.lastIndex = 0;
    const matches = [...text.matchAll(pattern)];
    
    if (matches.length > 0) {
      console.log(`✅ Pattern matched ${matches.length} times:`, pattern);
      
      // Split text by this pattern
      const parts = text.split(pattern);
      
      for (let i = 1; i < parts.length; i += 2) {
        const questionNum = parts[i];
        const questionText = parts[i + 1] || '';
        
        if (questionText.trim().length > 10) { // Minimum question length
          detectedQuestions.push({
            number: parseInt(questionNum) || detectedQuestions.length + 1,
            text: questionText.trim(),
            marks: null,
            difficulty: null,
            unit: '',
            topic: ''
          });
        }
      }
      
      if (detectedQuestions.length > 0) {
        break; // Use first successful pattern
      }
    }
  }
  
  // Method 2: If no pattern worked, try line-by-line detection
  if (detectedQuestions.length === 0) {
    console.log('⚠️ No pattern matched, trying line-by-line detection');
    
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    let currentQuestion = null;
    let questionNumber = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line starts with a question indicator
      const isQuestionStart = /^\s*(\d+[\.\)\]]|Q\.?\s*\d+|\(\d+\)|\[\d+\]|Question\s+\d+)/i.test(line);
      
      if (isQuestionStart) {
        // Save previous question
        if (currentQuestion && currentQuestion.text.trim().length > 10) {
          detectedQuestions.push(currentQuestion);
        }
        
        // Start new question
        questionNumber++;
        currentQuestion = {
          number: questionNumber,
          text: line,
          marks: null,
          difficulty: null,
          unit: '',
          topic: ''
        };
      } else if (currentQuestion) {
        // Continue current question (stop at next question or after reasonable length)
        if (currentQuestion.text.length < 1000) {
          currentQuestion.text += ' ' + line;
        }
      }
    }
    
    // Add last question
    if (currentQuestion && currentQuestion.text.trim().length > 10) {
      detectedQuestions.push(currentQuestion);
    }
  }
  
  // Method 3: If still no questions, try to split by double newlines (paragraphs)
  if (detectedQuestions.length === 0) {
    console.log('⚠️ Trying paragraph-based detection');
    
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    
    paragraphs.forEach((para, index) => {
      if (para.trim().length > 20) {
        detectedQuestions.push({
          number: index + 1,
          text: para.trim(),
          marks: null,
          difficulty: null,
          unit: '',
          topic: ''
        });
      }
    });
  }
  
  // Process each question for marks and difficulty
  detectedQuestions.forEach(q => {
    q.marks = detectMarks(q.text);
    q.difficulty = classifyDifficulty(q.marks);
    
    // Clean up question text (remove excessive whitespace)
    q.text = q.text.replace(/\s+/g, ' ').trim();
  });
  
  console.log(`✅ Total questions detected: ${detectedQuestions.length}`);
  
  return detectedQuestions;
}

// Detect marks from question text
function detectMarks(text) {
  // Enhanced patterns for marks detection
  const patterns = [
    /\((\d+)\s*marks?\)/i,           // "(10 marks)", "(10 mark)"
    /\[(\d+)\s*marks?\]/i,           // "[10 marks]", "[10 mark]"
    /(\d+)\s*M\b/i,                  // "10M", "10 m"
    /(\d+)\s*marks?\b/i,             // "10 marks", "10 mark"
    /marks?\s*[:\-]?\s*(\d+)/i,     // "marks: 10", "marks - 10"
    /\((\d+)\s*m\)/i,                // "(10m)", "(10 M)"
    /\[(\d+)\s*m\]/i,                // "[10m]", "[10 M]"
    /(\d+)\s*pts?\b/i,               // "10 pts", "10 pt", "10 points"
    /\((\d+)\)/                      // "(10)" - last resort, any number in parentheses
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const marks = parseInt(match[1]);
      // Sanity check: marks should be between 1 and 100
      if (marks >= 1 && marks <= 100) {
        console.log(`📊 Detected marks: ${marks} from pattern: ${pattern}`);
        return marks;
      }
    }
  }
  
  console.log('⚠️ No marks detected, using default: 5');
  return 5; // Default marks if not detected
}

// Classify difficulty based on marks
function classifyDifficulty(marks) {
  if (marks <= 5) return 'Easy';
  if (marks <= 10) return 'Medium';
  return 'Hard';
}

// Display extracted text preview
function displayExtractedText(text) {
  const preview = document.getElementById('pdfPreview');
  const textDiv = document.getElementById('extractedText');
  
  if (!text || text.trim().length === 0) {
    textDiv.innerHTML = '<p style="color: #dc3545; font-weight: bold;">⚠️ No text extracted. This PDF appears to be image-based (scanned).</p><p>To extract text from scanned PDFs, you need to:</p><ul><li>Use OCR software (like Adobe Acrobat, or online OCR tools)</li><li>Convert the scanned PDF to a text-based PDF</li><li>Or add questions manually using the form below</li></ul>';
  } else {
    // Truncate if too long
    const displayText = text.length > 2000 ? text.substring(0, 2000) + '...\n\n[Text truncated for preview]' : text;
    textDiv.textContent = displayText;
  }
  
  preview.style.display = 'block';
}

// Display parsed questions
function displayParsedQuestions(questions) {
  const container = document.getElementById('parsedQuestionsContainer');
  const list = document.getElementById('parsedQuestionsList');
  const countSpan = document.getElementById('questionCount');
  
  countSpan.textContent = questions.length;
  list.innerHTML = '';
  
  questions.forEach((q, index) => {
    const card = createQuestionCard(q, index);
    list.appendChild(card);
  });
  
  container.style.display = 'block';
}

// Create question card element
function createQuestionCard(question, index) {
  const card = document.createElement('div');
  card.className = 'question-card';
  card.id = `question-${index}`;
  
  card.innerHTML = `
    <div class="question-card-header">
      <span class="question-number">Question ${question.number}</span>
      <div class="question-actions">
        <button class="btn btn-small btn-edit" onclick="editQuestion(${index})">✏️ Edit</button>
        <button class="btn btn-small btn-danger" onclick="deleteQuestion(${index})">🗑️ Delete</button>
      </div>
    </div>
    
    <div class="question-text">${question.text}</div>
    
    <div class="question-metadata">
      <div class="metadata-item">
        <span class="metadata-label">Unit</span>
        <input type="text" class="metadata-input" id="unit-${index}" 
               value="${question.unit}" placeholder="e.g., Unit 1" />
      </div>
      
      <div class="metadata-item">
        <span class="metadata-label">Topic</span>
        <input type="text" class="metadata-input" id="topic-${index}" 
               value="${question.topic}" placeholder="e.g., Calculus" />
      </div>
      
      <div class="metadata-item">
        <span class="metadata-label">Marks</span>
        <input type="number" class="metadata-input" id="marks-${index}" 
               value="${question.marks}" onchange="updateDifficulty(${index})" />
      </div>
      
      <div class="metadata-item">
        <span class="metadata-label">Difficulty</span>
        <span class="metadata-value">
          <span class="difficulty-badge difficulty-${question.difficulty}" id="difficulty-${index}">
            ${question.difficulty}
          </span>
        </span>
      </div>
    </div>
  `;
  
  return card;
}

// Update difficulty when marks change
function updateDifficulty(index) {
  const marksInput = document.getElementById(`marks-${index}`);
  const marks = parseInt(marksInput.value) || 5;
  const difficulty = classifyDifficulty(marks);
  
  const difficultySpan = document.getElementById(`difficulty-${index}`);
  difficultySpan.textContent = difficulty;
  difficultySpan.className = `difficulty-badge difficulty-${difficulty}`;
  
  parsedQuestions[index].marks = marks;
  parsedQuestions[index].difficulty = difficulty;
}

// Edit question
function editQuestion(index) {
  const card = document.getElementById(`question-${index}`);
  const textDiv = card.querySelector('.question-text');
  const currentText = parsedQuestions[index].text;
  
  const textarea = document.createElement('textarea');
  textarea.className = 'metadata-input';
  textarea.style.width = '100%';
  textarea.style.minHeight = '100px';
  textarea.value = currentText;
  textarea.id = `edit-text-${index}`;
  
  textDiv.innerHTML = '';
  textDiv.appendChild(textarea);
  
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-small btn-success';
  saveBtn.textContent = '💾 Save';
  saveBtn.style.marginTop = '10px';
  saveBtn.onclick = () => saveQuestionEdit(index);
  
  textDiv.appendChild(saveBtn);
}

// Save question edit
function saveQuestionEdit(index) {
  const textarea = document.getElementById(`edit-text-${index}`);
  const newText = textarea.value;
  
  parsedQuestions[index].text = newText;
  
  // Re-render the card
  const card = document.getElementById(`question-${index}`);
  const newCard = createQuestionCard(parsedQuestions[index], index);
  card.replaceWith(newCard);
}

// Delete question
function deleteQuestion(index) {
  if (confirm('Are you sure you want to delete this question?')) {
    parsedQuestions.splice(index, 1);
    displayParsedQuestions(parsedQuestions);
    console.log(`🗑️ Question ${index + 1} deleted`);
  }
}

// Clear preview
function clearPreview() {
  document.getElementById('pdfPreview').style.display = 'none';
  document.getElementById('parsedQuestionsContainer').style.display = 'none';
  document.getElementById('pdfInput').value = '';
  parsedQuestions = [];
  console.log('🧹 Preview cleared');
}

// Save all questions to database
async function saveAllQuestions() {
  const subject = document.getElementById('bulkSubject').value.trim();
  const year = parseInt(document.getElementById('bulkYear').value);
  
  if (!subject) {
    alert('Please enter a subject for all questions');
    return;
  }
  
  if (!year || year < 1900 || year > 2100) {
    alert('Please enter a valid year');
    return;
  }
  
  // Update questions with user inputs
  const questionsToSave = parsedQuestions.map((q, index) => {
    const unit = document.getElementById(`unit-${index}`).value.trim() || 'General';
    const topic = document.getElementById(`topic-${index}`).value.trim() || 'General';
    const marks = parseInt(document.getElementById(`marks-${index}`).value) || 5;
    
    return {
      subject,
      year,
      unit,
      topic,
      marks,
      difficulty: classifyDifficulty(marks)
    };
  });
  
  showUploadStatus(`Saving ${questionsToSave.length} questions...`, 'loading');
  console.log('💾 Saving questions:', questionsToSave);
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const question of questionsToSave) {
      try {
        const response = await fetch(`${API_URL}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(question)
        });
        
        const result = await response.json();
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
        console.error('❌ Error saving question:', error);
      }
    }
    
    if (successCount > 0) {
      showUploadStatus(`✅ Successfully saved ${successCount} questions!`, 'success');
      setTimeout(() => {
        clearPreview();
      }, 2000);
    }
    
    if (errorCount > 0) {
      showUploadStatus(`⚠️ Saved ${successCount} questions, ${errorCount} failed`, 'error');
    }
    
    console.log(`✅ Saved: ${successCount}, ❌ Failed: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Error saving questions:', error);
    showUploadStatus('Error saving questions: ' + error.message, 'error');
  }
}

// Show upload status message
function showUploadStatus(message, type) {
  const statusDiv = document.getElementById('uploadStatus');
  statusDiv.textContent = message;
  statusDiv.className = type;
  
  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}
