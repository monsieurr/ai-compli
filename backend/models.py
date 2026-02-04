from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    solutions = db.relationship('Solution', backref='board', lazy=True, cascade="all, delete-orphan")

class Solution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('board.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_role = db.Column(db.String(50), default="Not specified")  # Provider, Deployer, User, Distributor
    
    # Risk Columns
    risk_survey = db.Column(db.String(50), default="Pending")  # Unacceptable, High, Limited, Minimal
    survey_details = db.Column(db.Text, nullable=True)  # Details from survey responses
    risk_ai = db.Column(db.String(50), default="Pending")
    ai_rationale = db.Column(db.Text, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'user_role': self.user_role,
            'risk_survey': self.risk_survey,
            'survey_details': self.survey_details,
            'risk_ai': self.risk_ai,
            'ai_rationale': self.ai_rationale
        }