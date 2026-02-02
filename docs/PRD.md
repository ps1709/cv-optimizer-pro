# Product Requirements Document (PRD)
## CV Optimizer Pro

**Document Version**: 1.0  
**Last Updated**: February 2025  
**Product Manager**: [PS]  
**Status**: In Development

---

## 1. Executive Summary

CV Optimizer Pro is an AI-powered application that helps job seekers create ATS-compliant, targeted resumes by analyzing their existing CV against specific job descriptions and providing optimized versions with measurable improvement scores.

### 1.1 Vision Statement
> Empower every job seeker to present their best professional self by eliminating the guesswork in resume optimization.

### 1.2 Problem Statement
- 75% of resumes are rejected by ATS before human review
- Average job seeker spends 3-4 hours tailoring each application
- No objective way to measure CV-JD alignment
- Professional resume services cost $200-500 per resume

### 1.3 Solution Overview
An AI tool that acts as a Senior Hiring Specialist, providing instant CV optimization with:
- Before/after match scoring
- ATS-compliant formatting
- Keyword optimization
- Authenticity preservation (no fabrication)

---

## 2. Goals & Success Metrics

### 2.1 Business Goals
| Goal | Description | Timeline |
|------|-------------|----------|
| User Acquisition | 10,000 active users | 6 months |
| Engagement | 3+ CVs per user | 3 months |
| Retention | 60% monthly return rate | 6 months |

### 2.2 Key Performance Indicators (KPIs)

| KPI | Current | Target | Measurement |
|-----|---------|--------|-------------|
| Processing Time | N/A | < 30s | Time from submit to results |
| Score Improvement | N/A | +20% avg | (Optimized - Original) score |
| User Satisfaction | N/A | 4.5/5 | In-app rating |
| Completion Rate | N/A | > 80% | Users who save/download CV |

### 2.3 Non-Goals (Out of Scope)
- Job board integration
- Direct application submission
- Video resume creation
- Interview preparation tools

---

## 3. User Research

### 3.1 User Personas

#### Primary Persona: Active Job Seeker
**Name**: Sarah, 28  
**Role**: Marketing Manager  
**Context**: Applying to 10-15 jobs per week

| Attribute | Details |
|-----------|---------|
| Pain Points | Spends 2+ hours per application, unsure if CV passes ATS, no feedback on rejections |
| Goals | Land interviews at target companies, minimize application time |
| Tech Savvy | High - comfortable with web apps |
| Willingness to Pay | $20-50/month for effective solution |

#### Secondary Persona: Career Changer
**Name**: Michael, 35  
**Role**: Engineer → Product Manager transition  
**Context**: Needs to reframe experience for new industry

| Attribute | Details |
|-----------|---------|
| Pain Points | Doesn't know how to position transferable skills, unfamiliar with PM terminology |
| Goals | Successfully pivot careers, get noticed despite non-traditional background |
| Tech Savvy | High |
| Willingness to Pay | $50-100 for comprehensive solution |

### 3.2 User Journey Map

```
AWARENESS          CONSIDERATION         DECISION            USE              ADVOCACY
    │                    │                   │                │                  │
    ▼                    ▼                   ▼                ▼                  ▼
Frustrated with    Searches for        Tries free         Optimizes      Recommends to
job rejections     "ATS checker"       version            multiple CVs   friends/network
                                                          Gets interviews
```

---

## 4. Feature Requirements

### 4.1 Core Features (MVP)

#### F1: CV Upload & Parsing
**Priority**: P0 (Must Have)

| Requirement | Details |
|-------------|---------|
| Supported Formats | PDF, DOCX, DOC, TXT |
| Max File Size | 10MB |
| Parsing Library | PDF.js, Mammoth.js |
| Error Handling | Clear messages for unsupported/corrupted files |

**Acceptance Criteria**:
- [ ] User can drag-drop or click to upload
- [ ] System extracts text within 5 seconds
- [ ] Shows "Ready" confirmation when parsed
- [ ] Displays error for unsupported formats

#### F2: Job Description Input
**Priority**: P0 (Must Have)

| Requirement | Details |
|-------------|---------|
| Input Method | Text area paste |
| Character Limit | 10,000 characters |
| Required Fields | Job Title, Company Name |

**Acceptance Criteria**:
- [ ] User can paste full JD text
- [ ] Character count displayed
- [ ] Validation for required fields
- [ ] Clear button to reset

#### F3: AI-Powered Optimization
**Priority**: P0 (Must Have)

| Requirement | Details |
|-------------|---------|
| AI Model | Claude API |
| Output Format | 1-page, ATS-compliant |
| Bullet Points | Single-line, Arial 10.5pt |
| Processing Time | < 30 seconds |

**Optimization Rules**:
1. Use ONLY content from original CV
2. Never fabricate skills/experiences
3. Preserve all dates, company names, titles
4. Add keywords from JD naturally
5. Use strong action verbs

**Acceptance Criteria**:
- [ ] Generates optimized CV in < 30s
- [ ] All bullet points are single-line
- [ ] No fabricated information
- [ ] Includes relevant JD keywords

#### F4: Dual Scoring System
**Priority**: P0 (Must Have)

| Score | Description |
|-------|-------------|
| Current CV Score | Original CV match vs JD (0-100%) |
| Optimized CV Score | Improved CV match vs JD (0-100%) |
| Improvement Delta | Percentage point increase |

**Acceptance Criteria**:
- [ ] Both scores displayed prominently
- [ ] Visual progress bars
- [ ] Green highlight for improvement
- [ ] Honest/realistic scoring

#### F5: CV History & Management
**Priority**: P1 (Should Have)

| Requirement | Details |
|-------------|---------|
| Storage | Browser Persistent Storage |
| Actions | View, Edit, Delete, Download |
| Search | By job title, company |

**Acceptance Criteria**:
- [ ] CVs persist across sessions
- [ ] Can edit and re-optimize
- [ ] Search filters work
- [ ] Delete with confirmation

### 4.2 Enhanced Features (Post-MVP)

#### F6: Google Drive Integration
**Priority**: P2 (Nice to Have)

- Auto-create "Optimized CVs" folder
- Save as Google Doc
- Edit syncs back to app

#### F7: Export Formats
**Priority**: P2 (Nice to Have)

- Export to DOCX
- Export to PDF
- Multiple templates

---

## 5. Technical Requirements

### 5.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  Components    │  State Mgmt   │  File Parsing          │
│  - Upload      │  - useState   │  - PDF.js              │
│  - Results     │  - useEffect  │  - Mammoth.js          │
│  - History     │  - useCallback│                        │
└────────────────┴───────────────┴────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
├─────────────────────────────────────────────────────────┤
│  Claude API          │  Persistent Storage  │  G Drive  │
│  - CV Analysis       │  - CV History        │  - Sync   │
│  - Optimization      │  - User Prefs        │  - Export │
└──────────────────────┴──────────────────────┴───────────┘
```

### 5.2 Performance Requirements

| Metric | Requirement |
|--------|-------------|
| Initial Load | < 3 seconds |
| File Parse | < 5 seconds |
| AI Processing | < 30 seconds |
| UI Response | < 100ms |

### 5.3 Security & Privacy

- No server-side CV storage
- API calls over HTTPS
- No PII logging
- Local-first data storage

---

## 6. Design Requirements

### 6.1 Design Principles

1. **Clarity**: Users understand what to do at each step
2. **Trust**: Transparent about what AI does/doesn't do
3. **Speed**: Minimize time to value
4. **Delight**: Celebrate improvements with positive feedback

### 6.2 UI Components

| Component | Purpose |
|-----------|---------|
| Upload Zone | Drag-drop file upload |
| Score Cards | Visual before/after comparison |
| CV Preview | Formatted output display |
| History List | Expandable CV cards |

---

## 7. Launch Plan

### 7.1 Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| Alpha | Core optimization, basic UI | Week 1-2 |
| Beta | History, scoring, polish | Week 3-4 |
| V1.0 | Google Drive, export | Week 5-6 |

### 7.2 Success Criteria for Launch

- [ ] 95% uptime
- [ ] < 1% error rate
- [ ] 4+ star rating from beta users
- [ ] Core features fully functional

---

## 8. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| AI generates inaccurate content | High | Medium | Strict prompts, authenticity rules |
| File parsing fails | Medium | Low | Multiple parsing methods, clear errors |
| API rate limits | Medium | Medium | Caching, queue system |
| User data loss | High | Low | Persistent storage, export options |

---

## 9. Open Questions

1. Should we add a "compare versions" feature?
2. What's the right pricing model (freemium vs. subscription)?
3. Should we integrate with LinkedIn for profile import?
4. How do we handle non-English CVs?

---

## 10. Appendix

### 10.1 Competitive Analysis

| Competitor | Strengths | Weaknesses | Our Differentiation |
|------------|-----------|------------|---------------------|
| Jobscan | Established, ATS database | Expensive ($50/mo), no rewrite | AI-powered rewrite, affordable |
| Resume.io | Beautiful templates | No JD matching | JD-specific optimization |
| Rezi | AI features | Complex UI | Simple, focused experience |

### 10.2 References

- [ATS Statistics](https://example.com)
- [User Research Interviews](https://example.com)
- [Competitor Analysis](https://example.com)

---

*Document maintained by PS - Product Manager*
