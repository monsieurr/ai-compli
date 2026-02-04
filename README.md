# 🇪🇺 EU AI Act Compass

A comprehensive web application for cataloguing and assessing AI systems for EU AI Act (Regulation 2024/1689) compliance. Built with React, Flask, and AI-powered risk analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![React](https://img.shields.io/badge/react-18.2+-blue.svg)

## 🎯 Features

### Core Functionality
- **📋 Board Management**: Create multiple boards to organize AI solutions by department, project, or squad
- **🤖 AI Cataloguing**: Document AI systems with detailed descriptions and role assignment
- **📝 EU AI Act Survey**: Interactive compliance questionnaire based on official EU AI Act provisions
- **⚡ AI Analysis**: Automated risk assessment using LLM powered by Claude API
- **📊 KPI Dashboard**: Real-time analytics tracking compliance status across your organization
- **📥 Export**: Download compliance data in CSV or JSON format
- **🔄 Real-time Updates**: Automatic KPI recalculation when solutions are added or assessed

### Risk Classification
Based on EU AI Act Regulation 2024/1689:
- **Unacceptable Risk** (Prohibited): Social scoring, subliminal manipulation, real-time biometric surveillance
- **High Risk**: Employment, education, critical infrastructure, law enforcement, healthcare
- **Limited Risk**: Chatbots, emotion recognition, deepfakes (transparency required)
- **Minimal Risk**: Spam filters, recommendation systems, most general AI applications

### Role-Based Assessment
Compliance requirements vary by your relationship with the AI:
- **Provider**: Develops or supplies AI systems
- **Deployer**: Operates AI systems under their authority
- **User**: Interacts with AI systems
- **Distributor**: Makes AI systems available in the supply chain

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Option 1: Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Backend will run on `http://localhost:5000`

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### Option 2: Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Application will be available at `http://localhost`

## 📖 User Guide

### 1. Creating Your First Board

1. Click "**➕ New Board**" in the sidebar
2. Enter a name (e.g., "HR Department", "Marketing Squad", "Engineering Team")
3. The board appears in your sidebar navigation

### 2. Adding AI Solutions

1. Navigate to your board
2. Click "**➕ Add AI Solution**"
3. Fill in the form:
   - **Solution Name**: Descriptive name (e.g., "Resume Screening AI")
   - **Description**: What the AI does and how it's used
   - **Your Role**: Select Provider/Deployer/User/Distributor
4. Click "**Add Solution**"

### 3. Conducting Manual Assessment (Survey)

1. Find your solution in the board table
2. Click "**📝 Survey**"
3. Answer each question based on the AI Act provisions:
   - Questions cover prohibited uses, high-risk applications, and transparency requirements
   - Answer "Yes", "No", or "Unsure"
   - Progress bar shows completion status
4. The system automatically determines risk level based on your answers
5. Results appear in the "Risk (Survey)" column

### 4. Running AI-Powered Analysis

1. Click "**⚡ Run AI Analysis**" at the top of the board
2. The system analyzes ALL solutions in the board using Claude AI
3. Each solution receives:
   - Risk level classification
   - Detailed rationale citing specific EU AI Act articles
4. Results appear in the "Risk (AI)" column
5. Compare AI vs. Survey results to validate assessments

### 5. Understanding Risk Badges

| Badge | Meaning | Action Required |
|-------|---------|----------------|
| 🚫 **Unacceptable** | Prohibited system | ⛔ Cannot be deployed in EU |
| ⚠️ **High** | High-risk system | ✅ Conformity assessment required |
| ℹ️ **Limited** | Transparency obligations | 📢 Must inform users |
| ✅ **Minimal** | No restrictions | ✓ No special requirements |
| ⏳ **Pending** | Not yet assessed | ⚡ Run survey or AI analysis |

### 6. Viewing Analytics

#### Global Dashboard
- Shows aggregate statistics across all boards
- Tracks total boards, solutions, and risk distribution
- Compares AI analysis vs. Survey results

#### Board-Level KPIs
- Each board displays its own statistics
- Monitor compliance status per department/project
- Identify high-risk areas quickly

### 7. Exporting Data

1. Navigate to your board
2. Click "**📥 Export CSV**" or "**📥 Export JSON**"
3. File downloads automatically with board name
4. Use for reporting, audits, or external analysis

## 🔧 Technical Architecture

### Backend (Flask)
```
backend/
├── app.py              # Main Flask application with REST API
├── models.py           # SQLAlchemy database models
├── ai_service.py       # AI analysis using Claude API
├── requirements.txt    # Python dependencies
└── Dockerfile          # Container configuration
```

**Key Endpoints:**
- `GET/POST /boards` - Board management
- `GET/POST /boards/{id}/solutions` - Solution CRUD
- `POST /boards/{id}/analyze` - Trigger AI analysis
- `POST /solutions/{id}/survey` - Submit survey results
- `GET /kpi` - Global analytics
- `GET /boards/{id}/export/csv` - CSV export
- `GET /boards/{id}/export/json` - JSON export

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # React entry point
│   └── main.css        # Professional styling
├── index.html          # HTML template
├── package.json        # Node dependencies
├── vite.config.js      # Build configuration
└── Dockerfile          # Container configuration
```

### Database Schema
```sql
-- Boards (departments/projects/squads)
CREATE TABLE board (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Solutions
CREATE TABLE solution (
    id INTEGER PRIMARY KEY,
    board_id INTEGER FOREIGN KEY REFERENCES board(id),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_role VARCHAR(50) DEFAULT 'Not specified',
    risk_survey VARCHAR(50) DEFAULT 'Pending',
    survey_details TEXT,
    risk_ai VARCHAR(50) DEFAULT 'Pending',
    ai_rationale TEXT
);
```

## 🤖 AI Analysis

The application uses **Claude Sonnet 4.5** for intelligent risk assessment:

### How It Works
1. Sends solution name, description, and user role to Claude API
2. Includes complete EU AI Act context and classification rules
3. Claude analyzes against official provisions (Regulation 2024/1689)
4. Returns risk level with detailed citation of relevant articles

### Why Claude?
- **Free tier available**: Accessible for POC and small deployments
- **High accuracy**: Better understanding of legal/regulatory text
- **Comprehensive reasoning**: Provides detailed explanations
- **Up-to-date knowledge**: Trained on recent EU AI Act documentation

### Alternative LLM Options
The system is designed to be LLM-agnostic. To use a different model:

1. **Ollama (Local)**: Edit `ai_service.py` to use Ollama endpoint
2. **OpenAI**: Replace API call with OpenAI client
3. **Hugging Face**: Use Inference API
4. **Azure OpenAI**: Configure Azure endpoint

## 📊 EU AI Act Survey Details

The survey is based on official EU AI Act provisions:

### Prohibited AI Systems (Article 5)
- 6 questions covering banned applications
- Includes: manipulation, exploitation, social scoring, biometric identification

### High-Risk AI Systems (Annex III)
- 6 questions covering regulated sectors
- Includes: employment, education, critical infrastructure, law enforcement

### Limited Risk Systems (Article 50)
- 3 questions covering transparency obligations
- Includes: chatbots, emotion recognition, deepfakes

### Assessment Logic
- **Any "Yes" to Prohibited** → Unacceptable Risk
- **Any "Yes" to High Risk** → High Risk (if no Unacceptable)
- **Any "Yes" to Limited** → Limited Risk (if no higher risk)
- **All "No" answers** → Minimal Risk

## 🎨 Design Philosophy

### Visual Identity
- **Professional**: Corporate-grade aesthetics suitable for enterprise use
- **Distinctive**: Custom Manrope typography, refined color palette
- **Accessible**: High contrast ratios, clear hierarchy
- **Responsive**: Works on desktop, tablet, and mobile

### Color Palette
- **Primary**: Deep blue (#1e40af) - Trust, regulation, stability
- **Danger**: Red (#dc2626) - Prohibited systems, critical alerts
- **Warning**: Amber (#f59e0b) - High-risk systems
- **Success**: Green (#10b981) - Compliant systems
- **Info**: Indigo (#6366f1) - Informational content

### Typography
- **Display**: Manrope (800 weight) - Headers and titles
- **Body**: Manrope (400-600) - Content and UI
- **Mono**: JetBrains Mono - Code and technical content

## 🔒 Security Considerations

### Data Privacy
- **SQLite database**: All data stored locally
- **No external data sharing**: Except AI analysis API calls
- **User control**: Full export and delete capabilities

### Production Recommendations
1. **Use PostgreSQL**: Replace SQLite for multi-user deployments
2. **Add authentication**: Implement user login and role-based access
3. **HTTPS only**: Deploy behind reverse proxy with SSL
4. **API rate limiting**: Prevent abuse of AI analysis endpoint
5. **Audit logging**: Track all risk assessments and changes

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create board → Should appear in sidebar
- [ ] Add solution → Should appear in board table
- [ ] Run survey → Should update Risk (Survey) column
- [ ] Run AI analysis → Should update Risk (AI) column with rationale
- [ ] Check KPIs → Should reflect current data
- [ ] Export CSV → Should download file
- [ ] Export JSON → Should download file
- [ ] Delete solution → Should remove from board and update KPIs
- [ ] Delete board → Should remove board and all solutions

### API Testing
```bash
# Test board creation
curl -X POST http://localhost:5000/boards \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Board"}'

# Test solution creation
curl -X POST http://localhost:5000/boards/1/solutions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test AI",
    "description": "Test description",
    "user_role": "Provider"
  }'

# Test KPI endpoint
curl http://localhost:5000/kpi
```

## 📝 Future Enhancements

### Short-term
- [ ] Import functionality (CSV/JSON upload)
- [ ] User authentication and multi-tenancy
- [ ] Detailed compliance reports (PDF generation)
- [ ] Email notifications for high-risk detections
- [ ] Audit trail of all assessments

### Long-term
- [ ] Integration with document management systems
- [ ] Automated periodic re-assessment
- [ ] Compliance workflow management
- [ ] Template library for common AI use cases
- [ ] API for third-party integrations
- [ ] Multi-language support

## 🤝 Contributing

This is a proof-of-concept built for demonstration purposes. For production use:

1. Implement proper user authentication
2. Add comprehensive test coverage
3. Set up CI/CD pipeline
4. Add database migrations (Alembic)
5. Implement proper error handling
6. Add request validation
7. Set up monitoring and logging

## 📄 License

MIT License - Feel free to use for commercial or personal projects

## 🔗 References

- [EU AI Act Official Text](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689)
- [EU AI Act Compliance Checker](https://artificialintelligenceact.eu/fr/evaluation/verificateur-de-conformite-a-l-acte-de-l-ai-de-l-ue/)
- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)

## 💡 About

Built as a proof-of-concept to demonstrate EU AI Act compliance tracking capabilities. 

**Tech Lead Philosophy**: KISS (Keep It Simple, Stupid) and DRY (Don't Repeat Yourself) principles throughout. Clean code, clear structure, production-ready architecture.

---

Made with ❤️ for EU AI Act Compliance# ai-compli
