from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from models import db, Board, Solution
from ai_service import analyze_risk_with_llm
import csv
import io

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# --- ROUTES ---

@app.route('/boards', methods=['GET', 'POST'])
def handle_boards():
    if request.method == 'POST':
        data = request.json
        new_board = Board(name=data['name'])
        db.session.add(new_board)
        db.session.commit()
        return jsonify({'id': new_board.id, 'name': new_board.name, 'created_at': new_board.created_at.isoformat()}), 201
    
    boards = Board.query.all()
    return jsonify([{
        'id': b.id, 
        'name': b.name, 
        'created_at': b.created_at.isoformat(),
        'solution_count': len(b.solutions)
    } for b in boards])

@app.route('/boards/<int:board_id>', methods=['DELETE'])
def delete_board(board_id):
    board = Board.query.get_or_404(board_id)
    db.session.delete(board)
    db.session.commit()
    return jsonify({'message': 'Board deleted'}), 200

@app.route('/boards/<int:board_id>/solutions', methods=['GET', 'POST'])
def handle_solutions(board_id):
    board = Board.query.get_or_404(board_id)
    
    if request.method == 'POST':
        data = request.json
        new_sol = Solution(
            board_id=board_id,
            name=data['name'],
            description=data['description'],
            user_role=data.get('user_role', 'Not specified')
        )
        db.session.add(new_sol)
        db.session.commit()
        return jsonify(new_sol.to_dict()), 201

    solutions = Solution.query.filter_by(board_id=board_id).all()
    return jsonify([s.to_dict() for s in solutions])

@app.route('/solutions/<int:sol_id>', methods=['DELETE'])
def delete_solution(sol_id):
    solution = Solution.query.get_or_404(sol_id)
    db.session.delete(solution)
    db.session.commit()
    return jsonify({'message': 'Solution deleted'}), 200

@app.route('/solutions/<int:sol_id>/survey', methods=['POST'])
def update_survey(sol_id):
    data = request.json
    sol = Solution.query.get_or_404(sol_id)
    sol.risk_survey = data['risk_level']
    sol.survey_details = data.get('details', '')
    db.session.commit()
    return jsonify(sol.to_dict())

@app.route('/boards/<int:board_id>/analyze', methods=['POST'])
def trigger_analysis(board_id):
    board = Board.query.get_or_404(board_id)
    solutions = Solution.query.filter_by(board_id=board_id).all()
    
    updated_count = 0
    errors = []
    
    for sol in solutions:
        if sol.risk_ai in ["Pending", "Error", None]:
            try:
                risk, rationale = analyze_risk_with_llm(
                    sol.name, 
                    sol.description, 
                    sol.user_role
                )
                sol.risk_ai = risk
                sol.ai_rationale = rationale
                updated_count += 1
            except Exception as e:
                sol.risk_ai = "Error"
                sol.ai_rationale = str(e)
                errors.append(f"{sol.name}: {str(e)}")
            
    db.session.commit()
    
    response = {
        "message": f"Analysis complete. Updated {updated_count} solutions.",
        "updated": updated_count,
        "total": len(solutions)
    }
    
    if errors:
        response["errors"] = errors
    
    return jsonify(response)

@app.route('/kpi', methods=['GET'])
def get_kpis():
    total = Solution.query.count()
    total_boards = Board.query.count()
    
    # Count by AI analysis
    high_risk_ai = Solution.query.filter(Solution.risk_ai == 'High').count()
    unacceptable_ai = Solution.query.filter(Solution.risk_ai == 'Unacceptable').count()
    limited_ai = Solution.query.filter(Solution.risk_ai == 'Limited').count()
    minimal_ai = Solution.query.filter(Solution.risk_ai == 'Minimal').count()
    
    # Count by Survey
    high_risk_survey = Solution.query.filter(Solution.risk_survey == 'High').count()
    unacceptable_survey = Solution.query.filter(Solution.risk_survey == 'Unacceptable').count()
    limited_survey = Solution.query.filter(Solution.risk_survey == 'Limited').count()
    minimal_survey = Solution.query.filter(Solution.risk_survey == 'Minimal').count()
    
    return jsonify({
        "total_solutions": total,
        "total_boards": total_boards,
        "ai_analysis": {
            "high": high_risk_ai,
            "unacceptable": unacceptable_ai,
            "limited": limited_ai,
            "minimal": minimal_ai
        },
        "survey": {
            "high": high_risk_survey,
            "unacceptable": unacceptable_survey,
            "limited": limited_survey,
            "minimal": minimal_survey
        }
    })

@app.route('/boards/<int:board_id>/kpi', methods=['GET'])
def get_board_kpis(board_id):
    board = Board.query.get_or_404(board_id)
    solutions = Solution.query.filter_by(board_id=board_id).all()
    
    total = len(solutions)
    
    # Count by AI analysis
    high_risk_ai = sum(1 for s in solutions if s.risk_ai == 'High')
    unacceptable_ai = sum(1 for s in solutions if s.risk_ai == 'Unacceptable')
    limited_ai = sum(1 for s in solutions if s.risk_ai == 'Limited')
    minimal_ai = sum(1 for s in solutions if s.risk_ai == 'Minimal')
    
    # Count by Survey
    high_risk_survey = sum(1 for s in solutions if s.risk_survey == 'High')
    unacceptable_survey = sum(1 for s in solutions if s.risk_survey == 'Unacceptable')
    limited_survey = sum(1 for s in solutions if s.risk_survey == 'Limited')
    minimal_survey = sum(1 for s in solutions if s.risk_survey == 'Minimal')
    
    return jsonify({
        "board_name": board.name,
        "total_solutions": total,
        "ai_analysis": {
            "high": high_risk_ai,
            "unacceptable": unacceptable_ai,
            "limited": limited_ai,
            "minimal": minimal_ai
        },
        "survey": {
            "high": high_risk_survey,
            "unacceptable": unacceptable_survey,
            "limited": limited_survey,
            "minimal": minimal_survey
        }
    })

@app.route('/boards/<int:board_id>/export/csv', methods=['GET'])
def export_csv(board_id):
    board = Board.query.get_or_404(board_id)
    solutions = Solution.query.filter_by(board_id=board_id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        'Solution Name', 'Description', 'User Role', 
        'Risk (Survey)', 'Survey Details',
        'Risk (AI Analysis)', 'AI Rationale'
    ])
    
    # Data
    for s in solutions:
        writer.writerow([
            s.name, s.description, s.user_role,
            s.risk_survey, s.survey_details or '',
            s.risk_ai, s.ai_rationale or ''
        ])
    
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = f"attachment; filename={board.name}_export.csv"
    response.headers["Content-type"] = "text/csv"
    return response

@app.route('/boards/<int:board_id>/export/json', methods=['GET'])
def export_json(board_id):
    board = Board.query.get_or_404(board_id)
    solutions = Solution.query.filter_by(board_id=board_id).all()
    
    data = {
        "board_name": board.name,
        "export_date": board.created_at.isoformat(),
        "solutions": [s.to_dict() for s in solutions]
    }
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)