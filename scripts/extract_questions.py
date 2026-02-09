
import re
import json

html_file = r"d:\UBB\vitalCHECK\questions_secteurs.html"
output_js_file = r"d:\UBB\vitalCHECK\server\data\questions-fr.js"

with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Sectors mapping (class name in HTML -> key in JS)
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

# Pillar mapping (Title in HTML -> ID in JS)
# We can match by partial title or order (1 to 9).
# Order is safer if reliable.
ids_by_order = [
    "finance",
    "operations",
    "sales",
    "people",
    "strategy",
    "technology",
    "risks",
    "branding",
    "export"
]

sections_pattern = re.compile(r'<div class="sector-section ([^"]+)">.*?<h2 class="sector-title">.*?</h2>(.*?)</div>\s*<div class="page-break">', re.DOTALL)
pillar_card_pattern = re.compile(r'<div class="pillar-card">(.*?)</div>', re.DOTALL)
question_pattern = re.compile(r'<div class="q-text">(.*?)</div>', re.DOTALL)
pillar_head_pattern = re.compile(r'<div class="pillar-head">(\d+)\. (.*?)</div>')

final_data = {}

# We need the existing recommendations structure, or we can copy it from the existing JS file.
# The user wants "ces questions ... adapter ici".
# I'll try to preserve existing recommendations if possible, or use generic ones if they vary per sector (HTML doesn't seem to have recommendations).
# I'll use a generic "recommendations" object for now as placeholders, or extract from current JS file.
# Let's read the current JS file to get the recommendations object.

current_js_content = ""
# Read current JS content manually is hard from python script without loading it. 
# But I can just hardcode the recommendations from the previous view_file since they seem generic enough 
# OR I can read the file in the script.

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

# Find all sector blocks
matches = sections_pattern.findall(html_content)

for sector_class, content in matches:
    if sector_class not in sectors_map:
        continue
    
    sector_key = sectors_map[sector_class]
    sector_pillars = []
    
    # Find pillar cards
    pillar_cards = pillar_card_pattern.findall(content)
    
    for i, card_content in enumerate(pillar_cards):
        if i >= 9: break # Should be 9 pillars
        
        pillar_id = ids_by_order[i]
        
        # Get Pillar Name
        head_match = pillar_head_pattern.search(card_content)
        pillar_name = head_match.group(2).strip() if head_match else f"Pillar {i+1}"
        
        # Get Questions
        questions = []
        q_matches = question_pattern.findall(card_content)
        
        for j, q_text in enumerate(q_matches):
            clean_text = re.sub(r'\s+', ' ', q_text).strip()
            
            # Create question object
            q_obj = {
                "id": f"{sector_key}_{pillar_id}_{j+1}",
                "text": clean_text,
                "options": [
                    {"label": "Non / Pas du tout", "score": 0},
                    {"label": "Partiel / En cours", "score": 1.5}, # Using 1.5 for partial if scale is 0-3? Or 0-1-2-3 map?
                    # The previous structure had 0, 1, 2, 3 scores (4 options).
                    # HTML has 3 options: Oui, Partiel, Non.
                    # Mapping to 0-3 scale: Non=0, Partiel=1.5, Oui=3?
                    # Or maybe 1, 2, 3? 
                    # Let's use: Non=0, Partiel=1, Oui=3? Or Non=0, Partiel=2, Oui=3?
                    # Let's stick to max 3.
                    # Option 1 (Non) -> 0
                    # Option 2 (Partiel) -> 1
                    # Option 3 (Oui) -> 3 
                    # Actually standard generic questions had 4 options 0,1,2,3.
                    # With 3 options, let's map to 0, 1, 3 to penalize partial? Or 0, 1.5, 3.
                    # Let's use 0, 1, 3 for simplicity or maybe {label "Non", score: 0}, {label "Partiel", score: 1}, {label "Oui", score: 3}.
                    # Wait, usually it is 0, 1, 2 for 3 options.
                    # But previous max score was 3. So to keep max score 100% comparable:
                    # Non -> 0
                    # Partiel -> 1.5 (or 2)
                    # Oui -> 3
                    {"label": "Oui / Complètement", "score": 3}
                ]
            }
            # Update options to match exactly "Oui", "Partiel", "Non" order from HTML visual but logical order for scoring:
            # HTML: Oui, Partiel, Non.
            # Usually we want increasing score orders in UI or does it matter?
            # Previous JSON has increasing scores 0 -> 3.
            # Let's put them in order of score: Non, Partiel, Oui.
            
            q_obj["options"] = [
                {"label": "Non / Insuffisant", "score": 0},
                {"label": "Partiel / En cours", "score": 1},
                {"label": "Oui / Maitrisé", "score": 3}
            ]
            questions.append(q_obj)
            
        pillar_obj = {
            "id": pillar_id,
            "name": pillar_name,
            "questions": questions,
            "recommendations": recommendations_map.get(pillar_id, {})
        }
        sector_pillars.append(pillar_obj)

    final_data[sector_key] = {
        "pillars": sector_pillars,
        "scoring": {
            "thresholds": {
                "red": [0, 39],
                "amber": [40, 69],
                "green": [70, 100]
            },
            "logic": "Scores des questions (0, 1, 3) convertis en pourcentage par pilier."
        }
    }

# Convert to JS file string
js_content = "const questionsDataFR = " + json.dumps(final_data, indent=2, ensure_ascii=False) + ";\n\nmodule.exports = questionsDataFR;"

with open(output_js_file, 'w', encoding='utf-8') as f:
    f.write(js_content)
    
print("Successfully generated questions-fr.js with sectors.")
