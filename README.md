# CV Optimizer Pro 🚀

An AI-powered CV optimization tool that transforms resumes into ATS-compliant, targeted documents with match scoring and Google Drive integration.

![CV Optimizer Pro](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![AI Powered](https://img.shields.io/badge/AI-Claude%20API-purple)

## 🎯 Problem Statement

Job seekers face a critical challenge: **75% of resumes are rejected by ATS (Applicant Tracking Systems)** before reaching human recruiters. Additionally:
- Tailoring CVs for each application is time-consuming
- Most candidates don't know which keywords matter
- There's no way to measure CV-JD alignment objectively

## 💡 Solution

CV Optimizer Pro acts as a **Senior Hiring Specialist** that:
1. Analyzes your CV against specific job descriptions
2. Optimizes content for ATS compliance
3. Provides before/after match scores
4. Maintains authenticity (no fabricated information)
5. Syncs optimized CVs to Google Drive

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Smart Parsing** | Reads PDF & DOCX files using pdf.js and mammoth.js |
| **AI Optimization** | Rewrites CV with targeted keywords while preserving authenticity |
| **Dual Scoring** | Shows current CV score vs. optimized CV score |
| **1-Page Format** | Condenses to single page with single-line bullet points |
| **ATS Compliance** | Standard sections, proper formatting, keyword optimization |
| **Google Drive Sync** | Auto-saves to "Optimized CVs" folder |
| **Version History** | Track all optimized CVs with edit capability |

## 📊 How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Upload CV   │────▶│  Paste Job   │────▶│ AI Analyzes  │────▶│  Optimized   │
│  (PDF/DOCX)  │     │ Description  │     │ & Optimizes  │     │  CV + Score  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                      │
                                                                      ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Edit &    │◀────│   View in    │◀────│   Save to    │◀────│  Download    │
│  Re-optimize │     │   History    │     │ Google Drive │     │   as TXT     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## 🎨 Screenshots

### Main Interface
- Clean, modern UI with dark theme
- Two-tab layout: Create New CV | My CVs

### Score Dashboard
- **Current CV Score**: Original match percentage
- **Optimized Score**: Improved match after optimization
- **Improvement Delta**: Shows +X% gain

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS
- **File Parsing**: 
  - PDF.js (PDF extraction)
  - Mammoth.js (DOCX extraction)
- **AI Engine**: Claude API (Anthropic)
- **Storage**: Browser Persistent Storage API
- **Icons**: Lucide React

## 📁 Project Structure

```
cv-optimizer-pro/
├── src/
│   ├── components/
│   │   └── CVOptimizerPro.jsx    # Main application component
│   ├── App.jsx
│   └── index.js
├── public/
│   └── index.html
├── docs/
│   ├── PRD.md                     # Product Requirements Document
│   ├── USER_STORIES.md            # User stories & acceptance criteria
│   └── TECHNICAL_SPEC.md          # Technical specifications
├── README.md
├── package.json
└── LICENSE
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Claude API access (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cv-optimizer-pro.git

# Navigate to project directory
cd cv-optimizer-pro

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Setup

Create a `.env` file in the root directory:
```
REACT_APP_CLAUDE_API_KEY=your_api_key_here
```

## 📋 Product Requirements

### User Personas

**Primary**: Job seekers actively applying to positions
- Pain: Spending hours tailoring CVs with uncertain results
- Goal: Maximize interview callback rate

**Secondary**: Career coaches and resume writers
- Pain: Manually optimizing client CVs
- Goal: Scale their services efficiently

### Success Metrics

| Metric | Target |
|--------|--------|
| CV Processing Time | < 30 seconds |
| User Satisfaction | > 4.5/5 stars |
| Score Improvement | Average +20% |
| Return User Rate | > 60% |

## 🔒 Privacy & Security

- **No Data Storage**: CVs are processed in-browser, not stored on servers
- **Local First**: All CV history stored in browser's persistent storage
- **Authenticity Guaranteed**: AI cannot fabricate information—only rewrites existing content

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] PDF/DOCX file parsing
- [x] AI-powered optimization
- [x] Dual scoring system
- [x] Persistent storage
- [x] Google Drive integration framework

### Phase 2 (Planned)
- [ ] Export to DOCX/PDF format
- [ ] LinkedIn profile import
- [ ] Multiple CV templates
- [ ] Cover letter generator

### Phase 3 (Future)
- [ ] Chrome extension
- [ ] Batch processing
- [ ] Team/Enterprise features
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- Product Manager passionate about AI-powered productivity tools
- [LinkedIn](https://www.linkedin.com/in/sharmapriyanshu/)


## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for Claude API
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF parsing
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for DOCX parsing

---

<p align="center">
  Made with ❤️ for job seekers everywhere
</p>
