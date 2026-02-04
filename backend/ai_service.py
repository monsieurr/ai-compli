import json

# Comprehensive EU AI Act Context based on official documentation
EU_AI_ACT_CONTEXT = """
THE EU AI ACT CLASSIFICATION RULES (Regulation EU 2024/1689):

1. PROHIBITED AI SYSTEMS (Article 5 - Unacceptable Risk):
   - AI systems that deploy subliminal techniques to materially distort behavior causing harm
   - AI systems that exploit vulnerabilities of specific groups (age, disability) causing harm
   - Social scoring by public authorities leading to detrimental treatment
   - Real-time remote biometric identification in publicly accessible spaces for law enforcement (with exceptions)
   - Biometric categorization systems to infer sensitive attributes (race, political opinions, religion, etc.)
   - Emotion recognition in workplace and educational institutions (with exceptions for medical/safety)
   - Scraping facial images from internet/CCTV to create facial recognition databases

2. HIGH-RISK AI SYSTEMS (Annex III):
   a) Biometrics: Remote biometric identification, biometric categorization, emotion recognition
   b) Critical Infrastructure: Management and operation of road traffic, water, gas, electricity, heating
   c) Education/Vocational Training: Assessment and evaluation, monitoring, detecting plagiarism
   d) Employment: Recruitment, screening, evaluation, promotion, monitoring, termination decisions
   e) Essential Services: Creditworthiness assessment, risk assessment for insurance, emergency response dispatch
   f) Law Enforcement: Individual risk assessment, polygraphs, evaluation of evidence reliability, migration/asylum/border control management
   g) Justice and Democracy: Assisting judicial research, influencing elections or voting behavior

3. LIMITED RISK AI SYSTEMS (Article 50 - Transparency Obligations):
   - AI systems intended to interact directly with natural persons (chatbots, virtual assistants)
   - Emotion recognition systems (must inform users)
   - Biometric categorization systems (must inform users)
   - AI-generated or manipulated content (deep fakes, synthetic media) - must be clearly labeled

4. MINIMAL RISK AI SYSTEMS:
   - Spam filters
   - AI-enabled video games
   - Inventory management systems
   - Recommendation systems (e-commerce, content)
   - Translation tools
   - Most other AI applications not covered above

KEY DEFINITIONS:
- Provider: Natural or legal person that develops an AI system or has it developed with a view to placing it on the market or putting it into service under its own name or trademark
- Deployer: Any natural or legal person using an AI system under its authority (the actual user/operator)
- Distributor: Any natural or legal person in the supply chain (other than provider or importer) that makes an AI system available
- User: Any natural or legal person using an AI system
"""

def analyze_risk_with_llm(solution_name, description, user_role="Not specified"):
    """
    Analyzes AI system risk using Claude API (available in artifacts).
    In production, this could be replaced with any LLM endpoint.
    """
    
    prompt = f"""You are an expert EU AI Act Compliance Officer with deep knowledge of Regulation (EU) 2024/1689.

CONTEXT - EU AI ACT CLASSIFICATION RULES:
{EU_AI_ACT_CONTEXT}

ANALYZE THIS AI SYSTEM:
Name: {solution_name}
Description: {description}
User Role: {user_role}

TASK:
1. Carefully determine the Risk Level based STRICTLY on the EU AI Act categories above
2. Provide a clear, professional rationale citing specific articles/categories
3. Consider the user's role (Provider, Deployer, User, Distributor) in your assessment

IMPORTANT:
- Be precise and cite specific EU AI Act provisions
- If the system could fall into multiple categories, choose the HIGHEST risk level
- Consider both the technology AND its application/purpose
- Distinguish between similar systems (e.g., chatbots are "Limited" risk, but chatbots for recruitment are "High" risk)

OUTPUT FORMAT (JSON only, no markdown):
{{
  "risk_level": "Unacceptable|High|Limited|Minimal",
  "rationale": "Clear explanation citing specific EU AI Act articles/annexes and why this classification applies"
}}"""

    try:
        # Using Claude API available in artifacts context
        # This uses the authentication already configured
        import requests
        
        response = requests.post("https://api.anthropic.com/v1/messages", 
            headers={
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1000,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        )
        
        if response.status_code != 200:
            return "Error", f"API Error: {response.status_code}"
        
        data = response.json()
        
        # Extract text from response
        text_content = ""
        for block in data.get("content", []):
            if block.get("type") == "text":
                text_content += block.get("text", "")
        
        # Parse JSON from response
        # Remove markdown code blocks if present
        text_content = text_content.strip()
        if text_content.startswith("```"):
            lines = text_content.split("\n")
            text_content = "\n".join(lines[1:-1])
        
        result = json.loads(text_content)
        
        return result.get("risk_level", "Error"), result.get("rationale", "No rationale provided")
        
    except Exception as e:
        print(f"LLM Error: {e}")
        return "Error", f"Analysis failed: {str(e)}"