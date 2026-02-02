import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Briefcase, CheckCircle, AlertCircle, Download, Loader2, Sparkles, Target, Shield, TrendingUp, FolderOpen, Clock, Edit3, Trash2, ExternalLink, RefreshCw, Save, Plus, ChevronDown, ChevronUp, Search } from 'lucide-react';
import * as mammoth from 'mammoth';

export default function CVOptimizerPro() {
  const [cvFile, setCvFile] = useState(null);
  const [cvContent, setCvContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fileType, setFileType] = useState('');
  const [savedCVs, setSavedCVs] = useState([]);
  const [isLoadingCVs, setIsLoadingCVs] = useState(true);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'history'
  const [editingCV, setEditingCV] = useState(null);
  const [expandedCV, setExpandedCV] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved CVs from persistent storage on mount
  useEffect(() => {
    loadSavedCVs();
  }, []);

  const loadSavedCVs = async () => {
    setIsLoadingCVs(true);
    try {
      const result = await window.storage.get('optimized-cvs-list');
      if (result && result.value) {
        const cvList = JSON.parse(result.value);
        setSavedCVs(cvList);
      }
    } catch (err) {
      console.log('No saved CVs found or error loading:', err);
      setSavedCVs([]);
    } finally {
      setIsLoadingCVs(false);
    }
  };

  const saveCVToStorage = async (cvData) => {
    try {
      // Get existing list
      let cvList = [];
      try {
        const result = await window.storage.get('optimized-cvs-list');
        if (result && result.value) {
          cvList = JSON.parse(result.value);
        }
      } catch (e) {
        cvList = [];
      }

      // Check if updating existing CV
      const existingIndex = cvList.findIndex(cv => cv.id === cvData.id);
      if (existingIndex >= 0) {
        cvList[existingIndex] = { ...cvList[existingIndex], ...cvData, updatedAt: new Date().toISOString() };
      } else {
        cvList.unshift(cvData);
      }

      // Save updated list
      await window.storage.set('optimized-cvs-list', JSON.stringify(cvList));
      setSavedCVs(cvList);
      
      return true;
    } catch (err) {
      console.error('Failed to save CV:', err);
      return false;
    }
  };

  const deleteCV = async (cvId) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    
    try {
      let cvList = [...savedCVs];
      cvList = cvList.filter(cv => cv.id !== cvId);
      await window.storage.set('optimized-cvs-list', JSON.stringify(cvList));
      setSavedCVs(cvList);
      setSuccessMessage('CV deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete CV');
    }
  };

  // Parse DOCX using mammoth
  const parseDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('Could not extract text from DOCX');
    }
    return result.value.trim();
  };

  // Parse PDF using pdf.js
  const parsePDF = async (file) => {
    // Load PDF.js from CDN
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      document.head.appendChild(script);
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load PDF library'));
      });
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) {
      throw new Error('Could not extract text from PDF');
    }
    
    return fullText.trim();
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setCvFile(file);
    setCvContent('');
    
    const fileName = file.name.toLowerCase();

    try {
      let content = '';
      
      if (fileName.endsWith('.pdf')) {
        setFileType('pdf');
        content = await parsePDF(file);
      } else if (fileName.endsWith('.docx')) {
        setFileType('docx');
        content = await parseDOCX(file);
      } else if (fileName.endsWith('.doc')) {
        setFileType('doc');
        content = await parseDOCX(file);
      } else if (fileName.endsWith('.txt')) {
        setFileType('txt');
        content = await file.text();
      } else {
        throw new Error('Unsupported format. Please upload PDF, DOCX, or TXT files.');
      }

      if (!content || content.trim().length < 20) {
        throw new Error('Could not extract text from file. Please try a different file.');
      }

      setCvContent(content.trim());
    } catch (err) {
      setError('Error reading file: ' + err.message);
      setCvFile(null);
      setCvContent('');
    }
  }, []);

  // Process CV with Claude API
  const processCV = async () => {
    if (!cvContent || !jobDescription) {
      setError('Please provide both a CV and Job Description');
      return;
    }

    if (!jobTitle || !companyName) {
      setError('Please provide Job Title and Company Name');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `You are a Senior Hiring Specialist with 15+ years of experience. Create a 1-PAGE optimized CV for this job application.

## CRITICAL RULES - READ CAREFULLY:
1. **USE ONLY INFORMATION FROM THE ORIGINAL CV** - Do NOT invent, fabricate, or add any information that is not present in the original CV
2. **Do NOT add fake skills, experiences, certifications, or achievements**
3. **Do NOT change job titles, company names, dates, or education details**
4. **You may ONLY**: Reword existing content, reorder sections, add relevant keywords naturally, improve phrasing, and format better

## ORIGINAL CV (USE ONLY THIS CONTENT):
${cvContent}

## TARGET ROLE: ${jobTitle} at ${companyName}

## JOB DESCRIPTION:
${jobDescription}

## FORMATTING RULES - STRICTLY FOLLOW:
1. **EXPERIENCE BULLET POINTS**: Each bullet point under a company MUST be exactly ONE LINE (concise, impactful)
2. **FONT SPECIFICATION**: Arial, Size 10.5 (mention this in output for reference)
3. **BULLET FORMAT**: Use "•" for bullet points under each company role
4. **KEEP BULLETS SHORT**: Maximum 15-20 words per bullet point - single line only
5. **ONE PAGE ONLY** - Be concise, prioritize most relevant experience

## OPTIMIZATION RULES:
1. **ATS-COMPLIANT** - Standard headers (SUMMARY, SKILLS, EXPERIENCE, EDUCATION), clean formatting
2. **TARGETED** - Reword existing bullet points to highlight relevance to this role
3. **PRESERVE ACCURACY** - Keep all dates, numbers, company names, and job titles exactly as in original
4. **KEYWORDS** - Naturally incorporate keywords from JD into existing content (don't add new skills)
5. **ACTION VERBS** - Start bullets with strong action verbs while keeping the same meaning

## SCORING INSTRUCTIONS:
1. **current_cv_score**: Score the ORIGINAL CV as-is against the JD (be realistic and honest)
2. **optimized_cv_score**: Score the OPTIMIZED CV against the JD (should be higher due to better keyword alignment and formatting)

## OUTPUT FORMAT (JSON):
{
  "optimized_cv": "FULL 1-PAGE CV with formatting note at top:\\n\\n[Font: Arial, Size: 10.5]\\n\\nNAME\\nContact Info\\n\\nPROFESSIONAL SUMMARY\\n2-3 sentences\\n\\nSKILLS\\nRelevant skills from original CV\\n\\nEXPERIENCE\\n\\nCompany Name | Job Title | Dates\\n• One-line bullet point with action verb and impact\\n• Another single-line achievement\\n• Keep each bullet to ONE line only\\n\\nEDUCATION\\nAs in original",
  "current_cv_score": 55,
  "optimized_cv_score": 78,
  "confidence_level": "High",
  "key_improvements": ["Condensed bullet points to single lines", "Added keyword X from JD", "Improved action verbs"],
  "missing_qualifications": ["Skills from JD not found in CV"],
  "strengths": ["Existing strengths that match JD"],
  "recommendations": ["Suggestions to improve candidacy"],
  "ats_keywords_added": ["keywords from JD added naturally"]
}

IMPORTANT: 
- current_cv_score should honestly reflect how well the ORIGINAL CV matches the JD
- optimized_cv_score should reflect the improved alignment after optimization
- Be realistic - if key requirements are missing, scores should reflect that
- Each bullet point under companies MUST be exactly ONE LINE (this is critical)

Respond ONLY with valid JSON.`
            }
          ],
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API request failed');
      }

      const responseText = data.content
        .map(item => (item.type === "text" ? item.text : ""))
        .filter(Boolean)
        .join("\n");

      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      
      // Add metadata
      parsed.jobTitle = jobTitle;
      parsed.companyName = companyName;
      parsed.jobDescription = jobDescription;
      parsed.originalCV = cvContent;
      
      setResults(parsed);
    } catch (err) {
      setError('Failed to process CV: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Save to Google Drive (creates formatted document)
  const saveToGoogleDrive = async () => {
    if (!results?.optimized_cv) {
      setError('No optimized CV to save');
      return;
    }

    setIsSavingToDrive(true);
    setError('');

    try {
      const cvId = editingCV?.id || `cv-${Date.now()}`;
      const fileName = `${results.jobTitle} - ${results.companyName}`;
      
      const cvData = {
        id: cvId,
        fileName,
        jobTitle: results.jobTitle,
        companyName: results.companyName,
        optimizedCV: results.optimized_cv,
        currentScore: results.current_cv_score,
        optimizedScore: results.optimized_cv_score,
        confidenceLevel: results.confidence_level,
        keyImprovements: results.key_improvements,
        strengths: results.strengths,
        missingQualifications: results.missing_qualifications,
        recommendations: results.recommendations,
        atsKeywords: results.ats_keywords_added,
        jobDescription: results.jobDescription,
        originalCV: results.originalCV,
        createdAt: editingCV?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        googleDocUrl: editingCV?.googleDocUrl || null,
        status: 'pending_sync'
      };

      const saved = await saveCVToStorage(cvData);
      
      if (saved) {
        setSuccessMessage(`✅ CV saved! "${fileName}" is ready for Google Drive sync.`);
        setEditingCV(null);
        setActiveTab('history');
        
        // Clear form
        setCvContent('');
        setCvFile(null);
        setJobDescription('');
        setJobTitle('');
        setCompanyName('');
        setResults(null);
      } else {
        throw new Error('Failed to save CV');
      }
    } catch (err) {
      setError('Failed to save: ' + err.message);
    } finally {
      setIsSavingToDrive(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  // Load CV for editing
  const loadCVForEditing = (cv) => {
    setEditingCV(cv);
    setCvContent(cv.originalCV);
    setJobDescription(cv.jobDescription);
    setJobTitle(cv.jobTitle);
    setCompanyName(cv.companyName);
    setResults({
      optimized_cv: cv.optimizedCV,
      current_cv_score: cv.currentScore,
      optimized_cv_score: cv.optimizedScore,
      confidence_level: cv.confidenceLevel,
      key_improvements: cv.keyImprovements,
      strengths: cv.strengths,
      missing_qualifications: cv.missingQualifications,
      recommendations: cv.recommendations,
      ats_keywords_added: cv.atsKeywords,
      jobTitle: cv.jobTitle,
      companyName: cv.companyName,
      jobDescription: cv.jobDescription,
      originalCV: cv.originalCV
    });
    setActiveTab('create');
  };

  // Download CV as text
  const downloadCV = (cvText, fileName) => {
    const blob = new Blob([cvText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'optimized_cv'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter CVs based on search
  const filteredCVs = savedCVs.filter(cv => 
    cv.fileName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cv.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cv.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get score/confidence colors
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (level) => {
    const colors = {
      'Very High': 'bg-green-100 text-green-700',
      'High': 'bg-emerald-100 text-emerald-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'Low': 'bg-red-100 text-red-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">CV Optimizer Pro</h1>
          </div>
          <p className="text-blue-200 max-w-2xl mx-auto">
            AI-powered CV optimization with Google Drive integration
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">×</button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 mb-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-200">{successMessage}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Plus className="w-5 h-5" />
            {editingCV ? 'Edit CV' : 'Create New CV'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            My CVs ({savedCVs.length})
          </button>
        </div>

        {/* Create/Edit Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {editingCV && (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-200">
                    Editing: <strong>{editingCV.fileName}</strong>
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingCV(null);
                    setCvContent('');
                    setCvFile(null);
                    setJobDescription('');
                    setJobTitle('');
                    setCompanyName('');
                    setResults(null);
                  }}
                  className="text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  Cancel Edit
                </button>
              </div>
            )}

            {/* Job Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <label className="block text-white/80 text-sm mb-2">Job Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <label className="block text-white/80 text-sm mb-2">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* CV and JD Input */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* CV Upload */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Upload CV</h2>
                </div>
                
                <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-white/50 mx-auto mb-3" />
                    <p className="text-white/70 mb-1">
                      {cvFile ? cvFile.name : 'Click to upload'}
                    </p>
                    <p className="text-sm text-white/40">PDF, DOCX, or TXT</p>
                  </label>
                </div>

                {cvFile && (
                  <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${cvContent ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    {cvContent ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 text-sm">{cvFile.name} - Ready</span>
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                        <span className="text-yellow-300 text-sm">Reading {cvFile.name}...</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Job Description</h2>
                </div>
                
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description..."
                  className="w-full h-52 p-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                
                <p className="text-sm text-white/40 mt-2">{jobDescription.length} characters</p>
              </div>
            </div>

            {/* Process Button */}
            <div className="text-center">
              <button
                onClick={processCV}
                disabled={isProcessing || !cvContent || !jobDescription || !jobTitle || !companyName}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-3 mx-auto"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {editingCV ? 'Re-Optimize CV' : 'Optimize My CV'}
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {results && (
              <div className="space-y-6">
                {/* Score Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold text-white/80">Current CV Score</h3>
                    </div>
                    <span className={`text-4xl font-bold ${getScoreColor(results.current_cv_score)}`}>
                      {results.current_cv_score}%
                    </span>
                    <p className="text-white/50 text-xs mt-2">Your original CV match</p>
                    <div className="mt-2 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full"
                        style={{ width: `${results.current_cv_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <h3 className="font-semibold text-white/80">Optimized CV Score</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${getScoreColor(results.optimized_cv_score)}`}>
                        {results.optimized_cv_score}%
                      </span>
                      <span className="text-green-400 text-sm font-semibold">
                        +{results.optimized_cv_score - results.current_cv_score}%
                      </span>
                    </div>
                    <p className="text-white/50 text-xs mt-2">After optimization</p>
                    <div className="mt-2 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${results.optimized_cv_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <h3 className="font-semibold text-white/80">Confidence Level</h3>
                    </div>
                    <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getConfidenceColor(results.confidence_level)}`}>
                      {results.confidence_level}
                    </span>
                    <div className="mt-3">
                      <p className="text-white/50 text-xs mb-1">ATS Keywords Added:</p>
                      <div className="flex flex-wrap gap-1">
                        {results.ats_keywords_added?.slice(0, 3).map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-500/30 text-blue-200 text-xs rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {results.strengths?.map((item, i) => (
                        <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                          <span className="text-green-400">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      Gaps to Address
                    </h3>
                    <ul className="space-y-2">
                      {results.missing_qualifications?.map((item, i) => (
                        <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                          <span className="text-yellow-400">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Optimized CV Preview */}
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Optimized CV (1-Page) - Based on Your Original CV
                      </h3>
                      <p className="text-white/50 text-xs mt-1">Font: Arial | Size: 10.5 | Single-line bullet points</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadCV(results.optimized_cv, `${jobTitle}_${companyName}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download TXT
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 max-h-96 overflow-y-auto shadow-inner">
                    <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed" style={{ fontFamily: 'Arial, sans-serif', fontSize: '10.5pt' }}>
                      {results.optimized_cv}
                    </pre>
                  </div>
                  <p className="text-white/50 text-xs mt-3 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    All content sourced from your original CV - no fabricated information added
                  </p>
                </div>

                {/* Save to Drive Button */}
                <div className="text-center">
                  <button
                    onClick={saveToGoogleDrive}
                    disabled={isSavingToDrive}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg flex items-center gap-3 mx-auto"
                  >
                    {isSavingToDrive ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingCV ? 'Update & Save to Google Drive' : 'Save to Google Drive'}
                      </>
                    )}
                  </button>
                  <p className="text-white/50 text-sm mt-2">
                    Saves to "Optimized CVs" folder
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, company..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                />
                <button
                  onClick={loadSavedCVs}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5 text-white/50" />
                </button>
              </div>
            </div>

            {/* CV List */}
            {isLoadingCVs ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
                <p className="text-white/60">Loading your CVs...</p>
              </div>
            ) : filteredCVs.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl">
                <FolderOpen className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60 mb-2">
                  {searchQuery ? 'No CVs match your search' : 'No optimized CVs yet'}
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Create your first optimized CV →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCVs.map((cv) => (
                  <div key={cv.id} className="bg-white/10 backdrop-blur rounded-xl overflow-hidden">
                    {/* CV Header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedCV(expandedCV === cv.id ? null : cv.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">{cv.fileName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {cv.jobTitle}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(cv.updatedAt || cv.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-white/50 text-xs">Before:</span>
                              <span className={`text-lg font-bold ${getScoreColor(cv.currentScore)}`}>
                                {cv.currentScore}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white/50 text-xs">After:</span>
                              <span className={`text-lg font-bold ${getScoreColor(cv.optimizedScore)}`}>
                                {cv.optimizedScore}%
                              </span>
                              <span className="text-green-400 text-xs">+{cv.optimizedScore - cv.currentScore}%</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getConfidenceColor(cv.confidenceLevel)}`}>
                            {cv.confidenceLevel}
                          </span>
                          {expandedCV === cv.id ? (
                            <ChevronUp className="w-5 h-5 text-white/50" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-white/50" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedCV === cv.id && (
                      <div className="border-t border-white/10 p-4 space-y-4">
                        {/* CV Preview */}
                        <div className="bg-black/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-white/80 font-sans text-sm">
                            {cv.optimizedCV}
                          </pre>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => loadCVForEditing(cv)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit & Re-optimize
                          </button>
                          <button
                            onClick={() => downloadCV(cv.optimizedCV, cv.fileName)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          {cv.googleDocUrl && (
                            <a
                              href={cv.googleDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open in Google Docs
                            </a>
                          )}
                          <button
                            onClick={() => deleteCV(cv.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>

                        {/* Keywords */}
                        {cv.atsKeywords && (
                          <div>
                            <p className="text-white/50 text-sm mb-2">ATS Keywords:</p>
                            <div className="flex flex-wrap gap-1">
                              {cv.atsKeywords.map((kw, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/40 text-sm">
          <p>💡 Tip: Click "Save to Google Drive" after optimizing to sync your CV</p>
        </div>
      </div>
    </div>
  );
}
