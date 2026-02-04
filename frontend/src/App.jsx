import React, { useState, useEffect } from 'react';
import './main.css';

const API_URL = "http://localhost:5000";

// EU AI Act Survey Questions based on official documentation
const EU_AI_ACT_SURVEY = [
  {
    id: 'prohibited_1',
    question: 'Does this AI system deploy subliminal techniques to materially distort behavior in a manner that causes or is likely to cause physical or psychological harm?',
    category: 'Prohibited',
    riskIfYes: 'Unacceptable'
  },
  {
    id: 'prohibited_2',
    question: 'Does this AI system exploit vulnerabilities of specific groups (children, elderly, persons with disabilities) in a manner that causes or is likely to cause physical or psychological harm?',
    category: 'Prohibited',
    riskIfYes: 'Unacceptable'
  },
  {
    id: 'prohibited_3',
    question: 'Is this AI system used for social scoring by public authorities that leads to detrimental or unfavorable treatment?',
    category: 'Prohibited',
    riskIfYes: 'Unacceptable'
  },
  {
    id: 'prohibited_4',
    question: 'Does this AI system use real-time remote biometric identification in publicly accessible spaces for law enforcement purposes?',
    category: 'Prohibited',
    riskIfYes: 'Unacceptable',
    note: 'Exceptions exist for specific law enforcement purposes'
  },
  {
    id: 'prohibited_5',
    question: 'Does this AI system categorize individuals based on biometric data to infer sensitive attributes (race, political opinions, trade union membership, religious beliefs, sex life, or sexual orientation)?',
    category: 'Prohibited',
    riskIfYes: 'Unacceptable'
  },
  {
    id: 'prohibited_6',
    question: 'Is this AI system used for emotion recognition in the workplace or educational institutions?',
    category: 'Prohibited',
    riskIfYes: 'Unacceptable',
    note: 'Exceptions for medical or safety reasons'
  },
  {
    id: 'high_risk_1',
    question: 'Is this AI system used in critical infrastructure management (e.g., road traffic, water, gas, electricity supply)?',
    category: 'High Risk',
    riskIfYes: 'High'
  },
  {
    id: 'high_risk_2',
    question: 'Is this AI system used in education or vocational training for assessment, evaluation, monitoring students, or detecting plagiarism?',
    category: 'High Risk',
    riskIfYes: 'High'
  },
  {
    id: 'high_risk_3',
    question: 'Is this AI system used in employment decisions (recruitment, screening, evaluation, promotion, monitoring, or termination)?',
    category: 'High Risk',
    riskIfYes: 'High'
  },
  {
    id: 'high_risk_4',
    question: 'Is this AI system used for essential services like creditworthiness assessment, insurance risk assessment, or emergency response dispatch?',
    category: 'High Risk',
    riskIfYes: 'High'
  },
  {
    id: 'high_risk_5',
    question: 'Is this AI system used for law enforcement purposes (individual risk assessment, polygraphs, evidence evaluation, migration/asylum/border control)?',
    category: 'High Risk',
    riskIfYes: 'High'
  },
  {
    id: 'high_risk_6',
    question: 'Is this AI system used to assist judicial research or influence election/voting behavior?',
    category: 'High Risk',
    riskIfYes: 'High'
  },
  {
    id: 'limited_1',
    question: 'Does this AI system interact directly with people (chatbot, virtual assistant)?',
    category: 'Limited Risk',
    riskIfYes: 'Limited'
  },
  {
    id: 'limited_2',
    question: 'Does this AI system perform emotion recognition or biometric categorization (outside prohibited uses)?',
    category: 'Limited Risk',
    riskIfYes: 'Limited'
  },
  {
    id: 'limited_3',
    question: 'Does this AI system generate or manipulate content (deep fakes, synthetic media)?',
    category: 'Limited Risk',
    riskIfYes: 'Limited'
  }
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [globalKPI, setGlobalKPI] = useState({
    total_solutions: 0,
    total_boards: 0,
    ai_analysis: { high: 0, unacceptable: 0, limited: 0, minimal: 0 },
    survey: { high: 0, unacceptable: 0, limited: 0, minimal: 0 }
  });
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

  useEffect(() => {
    fetchBoards();
    fetchKPIs();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await fetch(`${API_URL}/boards`);
      const data = await res.json();
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const fetchKPIs = async () => {
    try {
      const res = await fetch(`${API_URL}/kpi`);
      const data = await res.json();
      setGlobalKPI(data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    }
  };

  const handleCreateBoard = async (name) => {
    try {
      await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      await fetchBoards();
      await fetchKPIs();
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Error creating board: ' + error.message);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await fetch(`${API_URL}/boards/${boardId}`, { method: 'DELETE' });
      await fetchBoards();
      await fetchKPIs();
      if (currentBoard?.id === boardId) {
        setView('dashboard');
        setCurrentBoard(null);
      }
      setBoardToDelete(null);
    } catch (error) {
      console.error('Error deleting board:', error);
      alert('Error deleting board: ' + error.message);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>🇪🇺 AI Act Compass</h1>
          <div className="subtitle">EU AI Regulation Compliance</div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div 
              className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
              onClick={() => setView('dashboard')}
            >
              <span className="nav-item-icon">📊</span>
              <span>Global Dashboard</span>
            </div>
          </div>
          
          {boards.length > 0 && (
            <div className="nav-section">
              <div className="nav-section-label">Boards ({boards.length})</div>
              {boards.map(b => (
                <div
                  key={b.id}
                  className={`nav-item ${currentBoard?.id === b.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentBoard(b);
                    setView('board');
                  }}
                >
                  <span className="nav-item-icon">#</span>
                  <span style={{ flex: 1 }}>{b.name}</span>
                  {b.solution_count > 0 && (
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {b.solution_count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="btn btn-primary w-full" 
            onClick={() => setShowCreateBoardModal(true)}
          >
            ➕ New Board
          </button>
        </div>
      </aside>

      <main className="content">
        <div className="content-inner">
          {view === 'dashboard' && (
            <Dashboard 
              kpi={globalKPI} 
              boards={boards} 
              onDeleteBoard={(id) => setBoardToDelete(id)}
            />
          )}
          {view === 'board' && currentBoard && (
            <BoardView 
              board={currentBoard} 
              onUpdate={() => {
                fetchBoards();
                fetchKPIs();
              }}
              onDeleteBoard={(id) => setBoardToDelete(id)}
            />
          )}
        </div>
      </main>

      {showCreateBoardModal && (
        <CreateBoardModal
          onClose={() => setShowCreateBoardModal(false)}
          onSuccess={(name) => {
            handleCreateBoard(name);
            setShowCreateBoardModal(false);
          }}
        />
      )}

      {boardToDelete && (
        <ConfirmDeleteModal
          title="Delete Board"
          message="Are you sure you want to delete this board? All solutions will be permanently removed."
          onConfirm={() => handleDeleteBoard(boardToDelete)}
          onCancel={() => setBoardToDelete(null)}
        />
      )}
    </div>
  );
}

function Dashboard({ kpi, boards, onDeleteBoard }) {
  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Global Overview</h2>
        <p className="page-subtitle">
          Track AI compliance across your organization
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Total Boards</div>
            <div className="kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              📋
            </div>
          </div>
          <div className="kpi-value">{kpi.total_boards}</div>
          <div className="kpi-description">Active compliance boards</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Total AI Solutions</div>
            <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              🤖
            </div>
          </div>
          <div className="kpi-value">{kpi.total_solutions}</div>
          <div className="kpi-description">Catalogued AI systems</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">High Risk (AI)</div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              ⚠️
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>
            {kpi.ai_analysis.high}
          </div>
          <div className="kpi-description">AI-detected high risk systems</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Unacceptable (AI)</div>
            <div className="kpi-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
              🚫
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>
            {kpi.ai_analysis.unacceptable}
          </div>
          <div className="kpi-description">Prohibited AI systems</div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">High Risk (Survey)</div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              📝
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>
            {kpi.survey.high}
          </div>
          <div className="kpi-description">Survey-identified high risk</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Unacceptable (Survey)</div>
            <div className="kpi-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
              ❌
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>
            {kpi.survey.unacceptable}
          </div>
          <div className="kpi-description">Survey-identified prohibited</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Limited Risk</div>
            <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              ℹ️
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#6366f1' }}>
            {kpi.ai_analysis.limited + kpi.survey.limited}
          </div>
          <div className="kpi-description">Transparency requirements</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-label">Minimal Risk</div>
            <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              ✅
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#10b981' }}>
            {kpi.ai_analysis.minimal + kpi.survey.minimal}
          </div>
          <div className="kpi-description">No special requirements</div>
        </div>
      </div>

      {boards.length > 0 && (
        <div className="mt-4">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>
            Your Boards
          </h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Board Name</th>
                  <th>Solutions</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {boards.map(board => (
                  <tr key={board.id}>
                    <td style={{ fontWeight: '600' }}>{board.name}</td>
                    <td>{board.solution_count} solutions</td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(board.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteBoard(board.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {boards.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">No boards yet</div>
          <div className="empty-state-description">
            Create your first board to start cataloguing AI solutions
          </div>
        </div>
      )}
    </div>
  );
}

function BoardView({ board, onUpdate, onDeleteBoard }) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [currentSolution, setCurrentSolution] = useState(null);
  const [boardKPI, setBoardKPI] = useState(null);
  const [solutionToDelete, setSolutionToDelete] = useState(null);
  const [analysisMessage, setAnalysisMessage] = useState('');

  useEffect(() => {
    if (board) {
      fetchSolutions();
      fetchBoardKPI();
    }
  }, [board]);

  const fetchSolutions = async () => {
    try {
      const res = await fetch(`${API_URL}/boards/${board.id}/solutions`);
      setSolutions(await res.json());
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const fetchBoardKPI = async () => {
    try {
      const res = await fetch(`${API_URL}/boards/${board.id}/kpi`);
      setBoardKPI(await res.json());
    } catch (error) {
      console.error('Error fetching board KPIs:', error);
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/boards/${board.id}/analyze`, { 
        method: 'POST' 
      });
      const data = await res.json();
      
      await fetchSolutions();
      await fetchBoardKPI();
      onUpdate();
      
      setAnalysisMessage(data.message + (data.errors ? '\n\nErrors:\n' + data.errors.join('\n') : ''));
    } catch (error) {
      console.error('Error running analysis:', error);
      setAnalysisMessage('Error running analysis: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const url = `${API_URL}/boards/${board.id}/export/${format}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleDeleteSolution = async (solutionId) => {
    try {
      await fetch(`${API_URL}/solutions/${solutionId}`, { method: 'DELETE' });
      await fetchSolutions();
      await fetchBoardKPI();
      onUpdate();
      setSolutionToDelete(null);
    } catch (error) {
      console.error('Error deleting solution:', error);
      alert('Error deleting solution: ' + error.message);
    }
  };

  const openSurvey = (solution) => {
    setCurrentSolution(solution);
    setShowSurveyModal(true);
  };

  return (
    <div>
      <div className="header-actions">
        <div>
          <h2 className="page-title">Board: {board.name}</h2>
          <p className="page-subtitle">{solutions.length} AI solutions catalogued</p>
        </div>
        <div className="actions-group">
          <button 
            className="btn btn-secondary" 
            onClick={() => handleExport('csv')}
          >
            📥 Export CSV
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => handleExport('json')}
          >
            📥 Export JSON
          </button>
          <button 
            className="btn btn-success" 
            onClick={handleRunAnalysis}
            disabled={loading || solutions.length === 0}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>⚡ Run AI Analysis</>
            )}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDeleteBoard(board.id)}
          >
            🗑️ Delete Board
          </button>
        </div>
      </div>

      {boardKPI && (
        <div className="kpi-grid mb-4">
          <div className="kpi-card">
            <div className="kpi-label">Total Solutions</div>
            <div className="kpi-value">{boardKPI.total_solutions}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">High Risk (AI)</div>
            <div className="kpi-value" style={{ color: '#f59e0b' }}>
              {boardKPI.ai_analysis.high}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">High Risk (Survey)</div>
            <div className="kpi-value" style={{ color: '#f59e0b' }}>
              {boardKPI.survey.high}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Unacceptable</div>
            <div className="kpi-value" style={{ color: '#dc2626' }}>
              {boardKPI.ai_analysis.unacceptable + boardKPI.survey.unacceptable}
            </div>
          </div>
        </div>
      )}

      {solutions.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Solution Name</th>
                <th width="25%">Description</th>
                <th>Role</th>
                <th>Risk (Survey)</th>
                <th>Risk (AI)</th>
                <th width="20%">AI Rationale</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {solutions.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '600' }}>{s.name}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {s.description}
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 8px', 
                      background: 'var(--bg-tertiary)',
                      borderRadius: '4px'
                    }}>
                      {s.user_role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.risk_survey}`}>
                      {s.risk_survey}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.risk_ai}`}>
                      {s.risk_ai}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.813rem', color: 'var(--text-secondary)' }}>
                    {s.ai_rationale || '-'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => openSurvey(s)}
                      >
                        📝 Survey
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setSolutionToDelete(s.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🤖</div>
          <div className="empty-state-title">No AI solutions yet</div>
          <div className="empty-state-description">
            Add your first AI solution to start compliance tracking
          </div>
        </div>
      )}

      <button 
        className="btn btn-primary mt-3" 
        onClick={() => setShowAddModal(true)}
      >
        ➕ Add AI Solution
      </button>

      {showAddModal && (
        <AddSolutionModal
          boardId={board.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchSolutions();
            fetchBoardKPI();
            onUpdate();
            setShowAddModal(false);
          }}
        />
      )}

      {showSurveyModal && currentSolution && (
        <SurveyModal
          solution={currentSolution}
          onClose={() => {
            setShowSurveyModal(false);
            setCurrentSolution(null);
          }}
          onSuccess={() => {
            fetchSolutions();
            fetchBoardKPI();
            onUpdate();
            setShowSurveyModal(false);
            setCurrentSolution(null);
          }}
        />
      )}

      {solutionToDelete && (
        <ConfirmDeleteModal
          title="Delete Solution"
          message="Are you sure you want to delete this solution?"
          onConfirm={() => handleDeleteSolution(solutionToDelete)}
          onCancel={() => setSolutionToDelete(null)}
        />
      )}

      {analysisMessage && (
        <MessageModal
          title="Analysis Complete"
          message={analysisMessage}
          onClose={() => setAnalysisMessage('')}
        />
      )}
    </div>
  );
}

function AddSolutionModal({ boardId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_role: 'Provider'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await fetch(`${API_URL}/boards/${boardId}/solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding solution:', error);
      alert('Error adding solution');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add AI Solution</h3>
          <p className="modal-subtitle">
            Catalogue a new AI system for compliance tracking
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Solution Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Recruitment Chatbot, Fraud Detection System"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe what this AI system does, its purpose, and how it's used..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <div className="form-help">
                Be specific about the AI's functionality and use cases
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Role *</label>
              <select
                className="form-select"
                value={formData.user_role}
                onChange={(e) => setFormData({ ...formData, user_role: e.target.value })}
              >
                <option value="Provider">Provider (developed/supply the AI)</option>
                <option value="Deployer">Deployer (operate/use the AI)</option>
                <option value="User">User (interact with the AI)</option>
                <option value="Distributor">Distributor (distribute the AI)</option>
              </select>
              <div className="form-help">
                Select your relationship with this AI system per EU AI Act definitions
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Solution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateBoardModal({ onClose, onSuccess }) {
  const [boardName, setBoardName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (boardName.trim()) {
      onSuccess(boardName.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Board</h3>
          <p className="modal-subtitle">
            Organize AI solutions by department, project, or squad
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Board Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Marketing Squad, HR Department, Engineering Team"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                autoFocus
                required
              />
              <div className="form-help">
                Choose a descriptive name that represents the scope of AI solutions
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!boardName.trim()}>
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <div className="alert alert-warning">
            <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>⚠️</span>
            <div>
              <strong>Warning:</strong> This action cannot be undone.
              <p style={{ marginTop: '8px', marginBottom: 0 }}>{message}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageModal({ title, message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <div className="alert alert-success">
            <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>✓</span>
            <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SurveyModal({ solution, onClose, onSuccess }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [riskAssessment, setRiskAssessment] = useState(null);

  const currentQuestion = EU_AI_ACT_SURVEY[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === EU_AI_ACT_SURVEY.length - 1;

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    // Check if this triggers a risk category
    if (answer === 'yes' && currentQuestion.riskIfYes) {
      // If we find a prohibited or high risk, we can determine the category
      if (currentQuestion.riskIfYes === 'Unacceptable') {
        setRiskAssessment({
          risk_level: 'Unacceptable',
          details: `Prohibited: ${currentQuestion.question}`
        });
      } else if (currentQuestion.riskIfYes === 'High' && (!riskAssessment || riskAssessment.risk_level !== 'Unacceptable')) {
        setRiskAssessment({
          risk_level: 'High',
          details: `High Risk: ${currentQuestion.question}`
        });
      } else if (currentQuestion.riskIfYes === 'Limited' && !riskAssessment) {
        setRiskAssessment({
          risk_level: 'Limited',
          details: `Limited Risk: ${currentQuestion.question}`
        });
      }
    }

    // Move to next question
    if (!isLastQuestion) {
      setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 300);
    }
  };

  const handleSubmit = async () => {
    // Determine final risk level
    const finalRisk = riskAssessment?.risk_level || 'Minimal';
    const details = riskAssessment?.details || 'No high-risk characteristics identified based on survey responses';

    try {
      await fetch(`${API_URL}/solutions/${solution.id}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          risk_level: finalRisk,
          details: details
        })
      });
      onSuccess();
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey');
    }
  };

  const progress = ((currentQuestionIndex + 1) / EU_AI_ACT_SURVEY.length) * 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h3 className="modal-title">EU AI Act Compliance Survey</h3>
          <p className="modal-subtitle">
            {solution.name} - Question {currentQuestionIndex + 1} of {EU_AI_ACT_SURVEY.length}
          </p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'var(--bg-tertiary)', 
            borderRadius: '2px',
            marginTop: '12px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              background: 'var(--primary)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div className="modal-body">
          {riskAssessment && (
            <div className={`alert ${
              riskAssessment.risk_level === 'Unacceptable' ? 'alert-danger' :
              riskAssessment.risk_level === 'High' ? 'alert-warning' :
              'alert-info'
            }`} style={{ marginBottom: '20px' }}>
              <strong>⚠️ Risk Detected:</strong> {riskAssessment.risk_level}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700',
              color: 'var(--text-muted)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {currentQuestion.category}
            </div>
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600',
              color: 'var(--text-primary)',
              lineHeight: '1.6'
            }}>
              {currentQuestion.question}
            </div>
            {currentQuestion.note && (
              <div style={{ 
                fontSize: '0.813rem',
                color: 'var(--text-muted)',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                Note: {currentQuestion.note}
              </div>
            )}
          </div>

          <div className="radio-group">
            <label className={`radio-option ${answers[currentQuestion.id] === 'yes' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="answer"
                value="yes"
                checked={answers[currentQuestion.id] === 'yes'}
                onChange={() => handleAnswer('yes')}
              />
              <div>
                <div className="radio-label">Yes</div>
                <div className="radio-description">
                  This applies to our AI system
                </div>
              </div>
            </label>

            <label className={`radio-option ${answers[currentQuestion.id] === 'no' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="answer"
                value="no"
                checked={answers[currentQuestion.id] === 'no'}
                onChange={() => handleAnswer('no')}
              />
              <div>
                <div className="radio-label">No</div>
                <div className="radio-description">
                  This does not apply to our AI system
                </div>
              </div>
            </label>

            <label className={`radio-option ${answers[currentQuestion.id] === 'unsure' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="answer"
                value="unsure"
                checked={answers[currentQuestion.id] === 'unsure'}
                onChange={() => handleAnswer('unsure')}
              />
              <div>
                <div className="radio-label">Unsure</div>
                <div className="radio-description">
                  I need more information to answer
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          
          {currentQuestionIndex > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              ← Previous
            </button>
          )}

          {isLastQuestion && answers[currentQuestion.id] && (
            <button className="btn btn-success" onClick={handleSubmit}>
              ✓ Submit Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}