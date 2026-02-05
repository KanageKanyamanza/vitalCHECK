
import re
import json
import os
import sys

# Ce script extrait les questions ET tente d'inférer des options de réponses personnalisées
# basées sur le contexte de la question en utilisant des mots-clés simples.

html_file = r"d:\UBB\vitalCHECK\questions_secteurs.html"
output_dir = r"d:\UBB\vitalCHECK\server\data\questions"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

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

# --- HELPER: generate_options_for_question ---
# Cette fonction analyse le texte de la question pour proposer des réponses + contextuelles
def generate_options_for_question(text):
    text_lower = text.lower()
    
    # 1. Fréquence / Régularité
    if any(x in text_lower for x in ["régulièrement", "fréquence", "souvent", "mensuellement", "quotidiennement"]):
        return [
            {"label": "Jamais / Rarement", "score": 0},
            {"label": "Parfois / Irrégulier", "score": 1},
            {"label": "Systématiquement / Régulier", "score": 3}
        ]
        
    # 2. Existence / Documentation (Avez-vous, existe-t-il...)
    if any(x in text_lower for x in ["avez-vous", "existe-t-il", "disposez-vous", "possédez-vous"]):
        return [
            {"label": "Non / Inexistant", "score": 0},
            {"label": "Partiel / En cours d'élaboration", "score": 1},
            {"label": "Oui / Complet et documenté", "score": 3}
        ]
        
    # 3. Mesure / Analyse (Suivez-vous, analysez-vous, mesurez-vous)
    if any(x in text_lower for x in ["suivez-vous", "analysez-vous", "mesurez-vous", "calculez-vous"]):
        return [
            {"label": "Non / Au feeling", "score": 0},
            {"label": "Quelques indicateurs simples", "score": 1},
            {"label": "Oui / Tableaux de bord précis", "score": 3}
        ]
        
    # 4. Utilisation d'outils (Utilisez-vous...)
    if "utilisez-vous" in text_lower:
        return [
            {"label": "Non / Manuellement", "score": 0},
            {"label": "Outils basiques (Excel...)", "score": 1},
            {"label": "Outils dédiés / Automatisé", "score": 3}
        ]
        
    # 5. Conformité (Normes, RGPD, légal)
    if any(x in text_lower for x in ["normes", "rgpd", "légal", "conformité", "règlement"]):
        return [
            {"label": "Non conforme / Ignoré", "score": 0},
            {"label": "Partiellement conforme", "score": 1},
            {"label": "Entièrement conforme et audité", "score": 3}
        ]
        
    # 6. Formation (Formez-vous, formation) - Stricter check using regex to avoid "transformation"
    if re.search(r'\bform(ation|é|er|ez)', text_lower):
        return [
            {"label": "Aucune formation", "score": 0},
            {"label": "Formation sur le tas / Informelle", "score": 1},
            {"label": "Plan de formation structuré", "score": 3}
        ]

    # 7. Stratégie / Futur (Envisagez-vous, Prévoyez-vous)
    if any(x in text_lower for x in ["envisagez-vous", "prévoyez-vous", "planifiez-vous", "comptez-vous"]):
        return [
            {"label": "Non / Pas à l'ordre du jour", "score": 0},
            {"label": "En réflexion / À l'étude", "score": 1},
            {"label": "Oui / Projet lancé ou réalisé", "score": 3}
        ]

    # Default generic
    return [
        {"label": "Non / Pas du tout", "score": 0},
        {"label": "Partiellement / Moyennement", "score": 1},
        {"label": "Oui / Tout à fait", "score": 3}
    ]

# Read file content fully
with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find all sector sections
sector_blocks = re.split(r'<div class="sector-section\s+([^"]+)">', html_content)
blocks = sector_blocks[1:]

for i in range(0, len(blocks), 2):
    raw_cls = blocks[i].strip().split()[0]
    content = blocks[i+1]
    
    sector_key = sectors_map.get(raw_cls)
    if not sector_key:
        print(f"Warning: Unknown sector class {raw_cls}")
        continue
    
    # Split content by pillar cards
    pillar_chunks = re.split(r'<div class="pillar-card">', content)[1:]
    
    pillars_data = []
    for idx, chunk in enumerate(pillar_chunks):
        if idx >= len(pillar_ids): break
        
        pid = pillar_ids[idx]
        
        # Extract pillar head name
        m_head = re.search(r'<div class="pillar-head">.*?\. (.*?)</div>', chunk)
        p_name = m_head.group(1).strip() if m_head else f"Pillar {idx+1}"
        
        # Extract questions
        q_texts = re.findall(r'<div class="question-item">(.*?)</div>', chunk, re.DOTALL)
        
        formatted_qs = []
        for q_idx, q_text in enumerate(q_texts):
            # Clean text
            clean_q = re.sub(r'\s+', ' ', q_text).strip()
            clean_q = re.sub(r'<[^>]+>', '', clean_q)
            
            # Generate smart options based on question text
            smart_options = generate_options_for_question(clean_q)
            
            formatted_qs.append({
                "id": f"{sector_key}_{pid}_{q_idx+1}",
                "text": clean_q,
                "options": smart_options
            })
            
        pillars_data.append({
            "id": pid,
            "name": p_name,
            "questions": formatted_qs,
            "recommendations": recommendations_map.get(pid, {})
        })
    
    sector_data = {
        "pillars": pillars_data,
        "scoring": {
            "thresholds": {"red": [0, 39], "amber": [40, 69], "green": [70, 100]},
            "logic": "Scores des questions (0, 1, 3) convertis en pourcentage par pilier."
        }
    }
    
    # Write to sector file
    file_path = os.path.join(output_dir, f"{sector_key}.js")
    js_content = "module.exports = " + json.dumps(sector_data, indent=2, ensure_ascii=False) + ";"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Written sector: {sector_key} with {len(pillars_data)} pillars")

# Generate index.js
index_lines = []
for skey in sectors_map.values():
    index_lines.append(f"  {skey}: require('./{skey}'),")

index_content = "module.exports = {\n" + "\n".join(index_lines) + "\n};"
with open(os.path.join(output_dir, "index.js"), 'w', encoding='utf-8') as f:
    f.write(index_content)
