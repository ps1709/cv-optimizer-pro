# User Stories & Acceptance Criteria
## CV Optimizer Pro

---

## Epic 1: CV Upload & Processing

### US-1.1: Upload CV File
**As a** job seeker  
**I want to** upload my CV in PDF or DOCX format  
**So that** the system can analyze and optimize it

**Acceptance Criteria**:
- [ ] Can upload via click or drag-drop
- [ ] Supports PDF, DOCX, DOC, TXT formats
- [ ] Shows loading state while processing
- [ ] Displays success confirmation when ready
- [ ] Shows clear error for unsupported formats
- [ ] File size limit: 10MB

**Story Points**: 5

---

### US-1.2: Parse CV Content
**As a** user  
**I want** my CV text to be accurately extracted  
**So that** the AI has complete information to work with

**Acceptance Criteria**:
- [ ] PDF text extraction using PDF.js
- [ ] DOCX text extraction using Mammoth.js
- [ ] Preserves formatting structure
- [ ] Handles multi-page documents
- [ ] Error handling for corrupted files

**Story Points**: 8

---

## Epic 2: Job Description Input

### US-2.1: Enter Job Details
**As a** job seeker  
**I want to** enter the job title and company name  
**So that** my CV is personalized for the specific role

**Acceptance Criteria**:
- [ ] Required fields: Job Title, Company Name
- [ ] Input validation (not empty)
- [ ] Fields persist during session
- [ ] Clear visual indication of required fields

**Story Points**: 2

---

### US-2.2: Paste Job Description
**As a** user  
**I want to** paste the full job description  
**So that** the AI can identify relevant keywords and requirements

**Acceptance Criteria**:
- [ ] Large text area for pasting
- [ ] Character count displayed
- [ ] Handles long JDs (up to 10,000 chars)
- [ ] Clear button to reset

**Story Points**: 2

---

## Epic 3: AI Optimization

### US-3.1: Generate Optimized CV
**As a** job seeker  
**I want** the AI to optimize my CV for the target role  
**So that** I have a better chance of passing ATS screening

**Acceptance Criteria**:
- [ ] Processing completes in < 30 seconds
- [ ] Output is 1-page format
- [ ] Uses only content from original CV
- [ ] No fabricated information added
- [ ] Incorporates relevant JD keywords
- [ ] Professional formatting maintained

**Story Points**: 13

---

### US-3.2: Single-Line Bullet Points
**As a** user  
**I want** each experience bullet point to be exactly one line  
**So that** my CV is concise and easy to scan

**Acceptance Criteria**:
- [ ] Each bullet is max 15-20 words
- [ ] Starts with action verb
- [ ] Font specification: Arial 10.5pt
- [ ] No bullet wraps to second line

**Story Points**: 3

---

### US-3.3: Preserve Authenticity
**As a** job seeker  
**I want** my CV to contain only truthful information  
**So that** I maintain integrity in my application

**Acceptance Criteria**:
- [ ] All dates remain unchanged
- [ ] Company names exactly as original
- [ ] Job titles preserved
- [ ] No invented skills or experiences
- [ ] Confirmation message displayed

**Story Points**: 5

---

## Epic 4: Scoring System

### US-4.1: View Current CV Score
**As a** user  
**I want to** see how well my original CV matches the JD  
**So that** I understand my starting point

**Acceptance Criteria**:
- [ ] Score displayed as percentage (0-100%)
- [ ] Visual progress bar
- [ ] Color coding (red < 60, yellow 60-79, green 80+)
- [ ] Label: "Current CV Score"

**Story Points**: 3

---

### US-4.2: View Optimized CV Score
**As a** user  
**I want to** see the improved score after optimization  
**So that** I can measure the improvement

**Acceptance Criteria**:
- [ ] Score displayed prominently
- [ ] Shows improvement delta (+X%)
- [ ] Green highlight for improvement
- [ ] Side-by-side with original score

**Story Points**: 3

---

### US-4.3: View Confidence Level
**As a** user  
**I want to** see the AI's confidence in my application success  
**So that** I can gauge my chances realistically

**Acceptance Criteria**:
- [ ] Levels: Low, Medium, High, Very High
- [ ] Color-coded badges
- [ ] Based on qualification alignment

**Story Points**: 2

---

## Epic 5: Results Display

### US-5.1: View Optimized CV
**As a** user  
**I want to** preview the optimized CV  
**So that** I can review before downloading

**Acceptance Criteria**:
- [ ] Full CV displayed in scrollable area
- [ ] Proper formatting preserved
- [ ] White background for readability
- [ ] Font: Arial 10.5pt

**Story Points**: 3

---

### US-5.2: View Key Improvements
**As a** user  
**I want to** see what changes were made  
**So that** I understand the optimization

**Acceptance Criteria**:
- [ ] Bulleted list of improvements
- [ ] Includes added keywords
- [ ] Shows reworded sections

**Story Points**: 2

---

### US-5.3: View Gaps & Recommendations
**As a** user  
**I want to** know what qualifications I'm missing  
**So that** I can address them in my cover letter or interview

**Acceptance Criteria**:
- [ ] List of missing qualifications
- [ ] Actionable recommendations
- [ ] Differentiated from strengths visually

**Story Points**: 2

---

## Epic 6: Download & Export

### US-6.1: Download as TXT
**As a** user  
**I want to** download the optimized CV as a text file  
**So that** I can copy/paste into other formats

**Acceptance Criteria**:
- [ ] Download button visible
- [ ] File named: JobTitle_Company.txt
- [ ] Instant download
- [ ] All formatting preserved

**Story Points**: 2

---

### US-6.2: Save to Google Drive (Future)
**As a** user  
**I want to** save my optimized CV to Google Drive  
**So that** I can access it from anywhere

**Acceptance Criteria**:
- [ ] Creates "Optimized CVs" folder
- [ ] Saves as Google Doc
- [ ] Link provided after save
- [ ] Edits sync back

**Story Points**: 8

---

## Epic 7: CV History Management

### US-7.1: View CV History
**As a** user  
**I want to** see all my previously optimized CVs  
**So that** I can reuse them for similar applications

**Acceptance Criteria**:
- [ ] List view with job title, company, date
- [ ] Shows before/after scores
- [ ] Expandable for details
- [ ] Sorted by most recent

**Story Points**: 5

---

### US-7.2: Search CVs
**As a** user  
**I want to** search my CV history  
**So that** I can quickly find a specific version

**Acceptance Criteria**:
- [ ] Search by job title
- [ ] Search by company name
- [ ] Real-time filtering
- [ ] Clear search button

**Story Points**: 3

---

### US-7.3: Edit Existing CV
**As a** user  
**I want to** edit and re-optimize a saved CV  
**So that** I can improve it further or update for new JD

**Acceptance Criteria**:
- [ ] "Edit" button on each CV
- [ ] Loads original CV and JD
- [ ] Can modify and re-process
- [ ] Updates existing entry

**Story Points**: 5

---

### US-7.4: Delete CV
**As a** user  
**I want to** delete CVs I no longer need  
**So that** I can keep my history clean

**Acceptance Criteria**:
- [ ] Delete button on each CV
- [ ] Confirmation dialog
- [ ] Permanent deletion
- [ ] Success message

**Story Points**: 2

---

## Summary

| Epic | Stories | Total Points |
|------|---------|--------------|
| CV Upload | 2 | 13 |
| JD Input | 2 | 4 |
| AI Optimization | 3 | 21 |
| Scoring | 3 | 8 |
| Results | 3 | 7 |
| Export | 2 | 10 |
| History | 4 | 15 |
| **Total** | **19** | **78** |

---

## Sprint Planning Suggestion

**Sprint 1** (Week 1-2): Epics 1, 2, 3 - Core functionality  
**Sprint 2** (Week 3-4): Epics 4, 5, 6 - Scoring & Export  
**Sprint 3** (Week 5-6): Epic 7 + Polish - History & UX improvements
