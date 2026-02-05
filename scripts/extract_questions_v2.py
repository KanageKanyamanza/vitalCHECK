
import re
import json
import os

html_file = r"d:\UBB\vitalCHECK\questions_secteurs.html"
output_js_file = r"d:\UBB\vitalCHECK\server\data\questions-fr.js"

# Sectors mapping
sectors_map = {
    "tech": "technology",
    "commerce": "commerce",
    "services": "services",
    "manufacture": "manufacturing",
    "agriculture": "agriculture",
    "sante": "healthcare",
    "education": "education",
    "finance": "finance",
    "autre": "other"
}

# Pillar IDs
pillar_ids = [
    "finance", "operations", "sales", "people", 
    "strategy", "technology", "risks", "branding", "export"
]

recommendations_map = {
    "finance": {
        "red": ["Commencez à tenir des registres financiers mensuels.", "Séparez les finances personnelles et professionnelles."],
        "amber": ["Construisez un prévisionnel de trésorerie.", "Suivez de plus près les créances."],
        "green": ["Explorez les options de financement.", "Utilisez des tableaux de bord financiers."]
    },
    "operations": {
        "red": ["Documentez au moins vos processus de base.", "Identifiez les goulots d'étranglement."],
        "amber": ["Standardisez les flux de travail.", "Mettez en place des révisions régulières."],
        "green": ["Automatisez les processus.", "Implémentez des analyses avancées."]
    },
    "sales": {
        "red": ["Définissez clairement vos clients cibles.", "Mettez en place une présence numérique de base."],
        "amber": ["Lancez des campagnes marketing structurées.", "Suivez systématiquement les prospects."],
        "green": ["Optimisez la valeur vie client.", "Utilisez l'analyse de données."]
    },
    "people": {
        "red": ["Définissez clairement les rôles.", "Créez des descriptions de poste de base."],
        "amber": ["Introduisez des évaluations de performance.", "Développez des parcours de carrière."],
        "green": ["Construisez un pipeline de leadership.", "Implémentez un logiciel RH complet."]
    },
    "strategy": {
        "red": ["Rédigez un plan d'entreprise d'une page.", "Définissez vos avantages concurrentiels."],
        "amber": ["Tenez des révisions de performance trimestrielles.", "Développez des KPI stratégiques."],
        "green": ["Mettez en place un conseil consultatif.", "Implémentez la planification de scénarios."]
    },
    "technology": {
        "red": ["Adoptez des logiciels métier de base.", "Implémentez des sauvegardes régulières."],
        "amber": ["Sauvegardez régulièrement les données.", "Intégrez les systèmes métier."],
        "green": ["Intégrez des systèmes avancés (CRM + ERP).", "Explorez l'IA."]
    },
    "risks": {
        "red": ["Identifiez les principaux risques.", "Consultez les réglementations applicables."],
        "amber": ["Développez un processus de gestion des risques.", "Effectuez des audits réguliers."],
        "green": ["Implémentez un système complet de gestion des risques.", "Obtenez des certifications."]
    },
    "branding": {
        "red": ["Définissez votre identité de marque.", "Créez un logo de base."],
        "amber": ["Harmonisez votre branding.", "Améliorez la qualité du packaging."],
        "green": ["Créez une expérience de marque premium.", "Investissez dans un packaging innovant."]
    },
    "export": {
        "red": ["Évaluez le potentiel d'exportation.", "Renseignez-vous sur les réglementations."],
        "amber": ["Développez un plan d'exportation.", "Établissez des partenariats locaux."],
        "green": ["Implémentez une stratégie d'exportation complète.", "Créez une présence internationale."]
    }
}

final_data = {}

current_sector_key = None
current_pillars = []
current_questions = []
current_pillar_idx = -1
current_pillar_name = "Unknown"

# Regex
re_sector = re.compile(r'class="sector-section\s+([^"]+)"')
re_pillar_card = re.compile(r'class="pillar-card"')
re_pillar_head = re.compile(r'class="pillar-head">.*?\. (.*?)</div>')
re_question = re.compile(r'class="q-text">\s*(.*?)</div>')

def save_current_pillar():
    global current_questions, current_pillar_idx, current_pillar_name, current_pillars
    if current_pillar_idx >= 0 and current_pillar_idx < len(pillar_ids):
        pid = pillar_ids[current_pillar_idx]
        
        # Format questions
        formatted_qs = []
        for i, qt in enumerate(current_questions):
            formatted_qs.append({
                "id": f"{current_sector_key}_{pid}_{i+1}",
                "text": qt,
                "options": [
                    {"label": "Non / Insuffisant", "score": 0},
                    {"label": "Partiel / En cours", "score": 1},
                    {"label": "Oui / Maitrisé", "score": 3}
                ]
            })
            
        current_pillars.append({
            "id": pid,
            "name": current_pillar_name,
            "questions": formatted_qs,
            "recommendations": recommendations_map.get(pid, {})
        })
    current_questions = []

def save_current_sector():
    global current_sector_key, current_pillars
    if current_sector_key and current_pillars:
        final_data[current_sector_key] = {
            "pillars": current_pillars,
            "scoring": {
                "thresholds": {"red": [0, 39], "amber": [40, 69], "green": [70, 100]},
                "logic": "Scores 0,1,3 normalized."
            }
        }
    current_pillars = []

print("Reading HTML file...")
with open(html_file, 'r', encoding='utf-8') as f:
    for line in f:
        # Check sector
        m_sec = re_sector.search(line)
        if m_sec:
            # New sector
            # Save previous pillar and sector
            save_current_pillar()
            save_current_sector()
            
            raw_cls = m_sec.group(1).strip().split()[0] # take first class if multiple
            current_sector_key = sectors_map.get(raw_cls)
            if not current_sector_key:
                print(f"Warning: Unknown sector class {raw_cls}")
            
            current_pillar_idx = -1
            continue

        # Check pillar card start
        if re_pillar_card.search(line):
            save_current_pillar() # Save previous
            current_pillar_idx += 1
            current_pillar_name = f"Pillar {current_pillar_idx+1}"
            continue

        # Check pillar name
        m_head = re_pillar_head.search(line)
        if m_head:
            current_pillar_name = m_head.group(1).strip()
            continue
            
        # Check question
        m_q = re_question.search(line)
        if m_q:
            q_text = m_q.group(1).strip()
            # Clean HTML tags if any (basic)
            q_text = re.sub(r'<[^>]+>', '', q_text)
            current_questions.append(q_text)

# Save last items
save_current_pillar()
save_current_sector()

print(f"Extraction complete. Found {len(final_data)} sectors.")
for k, v in final_data.items():
    print(f"  - {k}: {len(v['pillars'])} pillars")

# Write JS
js_content = "const questionsDataFR = " + json.dumps(final_data, indent=2, ensure_ascii=False) + ";\n\nmodule.exports = questionsDataFR;"
with open(output_js_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("JS file written.")
