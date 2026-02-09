
import re
import json
import os

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

# Read file content fully
with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find all sector sections
# Regex to find <div class="sector-section [name]"> ... until next <div class="sector-section
# We can use finditer with a regex that looks for the start of sections
sector_blocks = re.split(r'<div class="sector-section\s+([^"]+)">', html_content)

# re.split will return [header, class1, content1, class2, content2, ...]
header_ignore = sector_blocks[0]
blocks = sector_blocks[1:]

for i in range(0, len(blocks), 2):
    raw_cls = blocks[i].strip().split()[0]
    content = blocks[i+1]
    
    sector_key = sectors_map.get(raw_cls)
    if not sector_key:
        print(f"Warning: Unknown sector class {raw_cls}")
        continue
    
    # Extract pillars and questions from this content
    # Find all <div class="pillar-card"> ... </div>
    # Actually, let's look for pillar heads and question items
    
    pillars_content = re.findall(r'<div class="pillar-card">(.*?)</div>\s*</div>', content, re.DOTALL)
    # Wait, splitting content by <div class="pillar-card"> is safer
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
            # Clean text: remove newlines, multiple spaces, HTML tags
            clean_q = re.sub(r'\s+', ' ', q_text).strip()
            clean_q = re.sub(r'<[^>]+>', '', clean_q)
            
            formatted_qs.append({
                "id": f"{sector_key}_{pid}_{q_idx+1}",
                "text": clean_q,
                "options": [
                    {"label": "Non / Insuffisant", "score": 0},
                    {"label": "Partiel / En cours", "score": 1},
                    {"label": "Oui / Maitrisé", "score": 3}
                ]
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

# Generate index.js in server/data/questions/
index_lines = []
for skey in sectors_map.values():
    index_lines.append(f"  {skey}: require('./{skey}'),")

index_content = "module.exports = {\n" + "\n".join(index_lines) + "\n};"
with open(os.path.join(output_dir, "index.js"), 'w', encoding='utf-8') as f:
    f.write(index_content)

print("Index file written.")
