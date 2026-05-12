const questionsData = {
  pillars: [
    {
      id: "finance",
      name: "Finance & Cash Flow",
      questions: [
        {
          id: "f1",
          text: "Do you have up-to-date financial statements (P&L, Balance Sheet, Cash Flow)?",
          options: [
            { label: "No records", score: 0, recommendation: "Implement a basic accounting system to track your income and expenses monthly." },
            { label: "Basic records, not updated", score: 1, recommendation: "Update your financial records and ensure they reflect your current business state." },
            { label: "Updated quarterly", score: 2 },
            { label: "Updated monthly", score: 3 }
          ]
        },
        {
          id: "f2",
          text: "How many months of cash reserves can your business cover?",
          options: [
            { label: "< 1 month", score: 0, recommendation: "Build an emergency fund to cover at least 3 months of operating expenses." },
            { label: "1–3 months", score: 1, recommendation: "Analyze your cash burn rate and identify areas where you can reduce fixed costs." },
            { label: "3–6 months", score: 2 },
            { label: "> 6 months", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Separate personal and business finances immediately to avoid legal and tax complications.",
          "Set up a simple bookkeeping system using tools like QuickBooks or even a structured spreadsheet."
        ],
        amber: [
          "Build a 3–6 month cash flow forecast to anticipate potential shortfalls.",
          "Track receivables more closely and follow up on overdue payments within 24 hours of the due date."
        ],
        green: [
          "Explore funding options for growth and expansion into new markets.",
          "Use financial dashboards to monitor your profitability and efficiency in real-time."
        ]
      }
    },
    {
      id: "operations",
      name: "Operations & Processes",
      questions: [
        {
          id: "o1",
          text: "Are your business processes documented?",
          options: [
            { label: "Not at all", score: 0, recommendation: "Start by documenting your top 3 most critical business processes (e.g., sales, fulfillment)." },
            { label: "Some processes only", score: 1, recommendation: "Expand your documentation to cover administrative and support processes." },
            { label: "Most processes documented", score: 2 },
            { label: "Fully standardized & automated", score: 3 }
          ]
        },
        {
          id: "o2",
          text: "How do you monitor operational efficiency?",
          options: [
            { label: "No monitoring", score: 0, recommendation: "Define at least two key performance indicators (KPIs) to track your daily operations." },
            { label: "Ad-hoc checks", score: 1, recommendation: "Establish a weekly review meeting to analyze your performance against targets." },
            { label: "Regular reviews", score: 2 },
            { label: "Data-driven KPIs", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Document at least your core processes to reduce dependency on key individuals.",
          "Identify and eliminate the biggest bottleneck currently slowing down your production or service delivery."
        ],
        amber: [
          "Standardize workflows and implement simple visual management tools.",
          "Train your entire staff on the documented processes to ensure consistency."
        ],
        green: [
          "Automate repetitive tasks using modern software tools (e.g., Zapier, CRM workflows).",
          "Focus on continuous improvement (Kaizen) to maintain your competitive edge."
        ]
      }
    },
    {
      id: "sales",
      name: "Sales & Marketing",
      questions: [
        {
          id: "s1",
          text: "How do you generate leads/customers?",
          options: [
            { label: "Mostly word of mouth", score: 0, recommendation: "Diversify your lead generation by launching a basic social media or email marketing campaign." },
            { label: "Some irregular marketing", score: 1, recommendation: "Create a consistent marketing calendar to stay in front of your prospects every week." },
            { label: "Structured campaigns (social, email, etc.)", score: 2 },
            { label: "Integrated sales + marketing strategy with KPIs", score: 3 }
          ]
        },
        {
          id: "s2",
          text: "Do you track customer retention and lifetime value?",
          options: [
            { label: "No", score: 0, recommendation: "Start tracking why customers leave and implement a basic follow-up process for lost leads." },
            { label: "Basic tracking (spreadsheets)", score: 1, recommendation: "Calculate your Customer Acquisition Cost (CAC) to ensure your marketing spend is profitable." },
            { label: "Regular monitoring", score: 2 },
            { label: "Advanced analytics + CRM system", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Define your Ideal Customer Profile (ICP) to focus your marketing efforts where they matter most.",
          "Set up a basic digital presence (Google Business Profile) to increase your local visibility."
        ],
        amber: [
          "Launch structured marketing campaigns and measure their ROI systematically.",
          "Track leads in a CRM (even a free one) to ensure no prospect falls through the cracks."
        ],
        green: [
          "Optimize customer lifetime value through upselling and cross-selling strategies.",
          "Invest in brand authority through thought leadership and high-quality content marketing."
        ]
      }
    },
    {
      id: "people",
      name: "People & HR",
      questions: [
        {
          id: "p1",
          text: "Do you have clear job descriptions and performance reviews?",
          options: [
            { label: "No", score: 0, recommendation: "Create clear job descriptions for every role to align expectations and improve accountability." },
            { label: "Partial / informal", score: 1, recommendation: "Formalize your performance reviews to provide constructive feedback and goal setting." },
            { label: "Regular reviews for key roles", score: 2 },
            { label: "Systematic across all staff", score: 3 }
          ]
        },
        {
          id: "p2",
          text: "Do you invest in staff training & development?",
          options: [
            { label: "Never", score: 0, recommendation: "Identify one core skill gap in your team and provide targeted training this quarter." },
            { label: "Occasionally", score: 1, recommendation: "Develop a simple annual training plan for each employee to foster growth." },
            { label: "Annual training plan", score: 2 },
            { label: "Continuous training program", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Define roles and responsibilities clearly to avoid confusion and double-work.",
          "Establish regular one-on-one meetings between managers and their team members."
        ],
        amber: [
          "Introduce a structured onboarding process for new hires to speed up their productivity.",
          "Implement basic HR policies to protect both the company and the employees."
        ],
        green: [
          "Build a leadership pipeline by identifying and mentoring high-potential employees.",
          "Implement employee engagement surveys to proactively address culture and retention."
        ]
      }
    },
    {
      id: "strategy",
      name: "Strategy & Governance",
      questions: [
        {
          id: "st1",
          text: "Do you have a documented business strategy/plan?",
          options: [
            { label: "None", score: 0, recommendation: "Draft a simple one-page business plan outlining your vision, mission, and 3 key goals." },
            { label: "Informal ideas only", score: 1, recommendation: "Formalize your strategy into a written document and share it with your key team members." },
            { label: "Written plan, not regularly updated", score: 2 },
            { label: "Clear, updated plan with monitoring", score: 3 }
          ]
        },
        {
          id: "st2",
          text: "How often does leadership review business performance?",
          options: [
            { label: "Never", score: 0, recommendation: "Start holding a monthly management meeting to review financial and operational results." },
            { label: "Occasionally", score: 1, recommendation: "Standardize your management meetings with a fixed agenda and clear action items." },
            { label: "Quarterly", score: 2 },
            { label: "Monthly", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Define your core competitive advantage: Why should customers buy from you instead of others?",
          "Set 3-5 high-level targets for the next 12 months to give your business clear direction."
        ],
        amber: [
          "Hold quarterly strategy reviews to adjust your plan based on market changes.",
          "Develop a set of strategic KPIs that go beyond just financial numbers (e.g., customer satisfaction)."
        ],
        green: [
          "Set up an external advisory board to get objective perspectives on your business strategy.",
          "Implement scenario planning to prepare for potential market disruptions or opportunities."
        ]
      }
    },
    {
      id: "technology",
      name: "Technology & Digital Readiness",
      questions: [
        {
          id: "t1",
          text: "What role does technology play in your business?",
          options: [
            { label: "Very limited", score: 0, recommendation: "Adopt a basic cloud-based accounting and CRM system to modernize your operations." },
            { label: "Basic (emails, spreadsheets)", score: 1, recommendation: "Integrate your tools (e.g., email and CRM) to reduce manual data entry." },
            { label: "Core systems in place (accounting, CRM, ERP)", score: 2 },
            { label: "Advanced digital tools integrated across functions", score: 3 }
          ]
        },
        {
          id: "t2",
          text: "Do you have a cybersecurity/data protection policy?",
          options: [
            { label: "None", score: 0, recommendation: "Implement mandatory 2-factor authentication (MFA) for all business accounts immediately." },
            { label: "Basic informal practices", score: 1, recommendation: "Formalize your security practices into a written policy and train your staff on it." },
            { label: "Formal policy, not enforced", score: 2 },
            { label: "Fully implemented + staff trained", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Implement regular, automated data backups to protect against hardware failure or cyberattacks.",
          "Train your staff on basic cybersecurity hygiene (e.g., identifying phishing emails)."
        ],
        amber: [
          "Audit your current software stack and consolidate redundant tools to save costs.",
          "Develop a digital roadmap to gradually upgrade your systems over the next 12-24 months."
        ],
        green: [
          "Explore how Artificial Intelligence (AI) can automate your workflows or improve customer service.",
          "Implement a 'Zero Trust' security architecture to protect your most sensitive business data."
        ]
      }
    },
    {
      id: "risks",
      name: "Risks & Compliance",
      questions: [
        {
          id: "rc1",
          text: "Do you have a formal system for identifying and tracking risks (operational, financial, legal)?",
          options: [
            { label: "No mechanism, entirely reactive management", score: 0, recommendation: "Create a simple 'Risk Register' to list and prioritize the top 5 threats to your business." },
            { label: "Some risks identified informally", score: 1, recommendation: "Formalize your risk assessment into a monthly review process with your leadership team." },
            { label: "Risks identified + partial documents or procedures", score: 2 },
            { label: "Complete system: mapping, regular monitoring, mitigation plans", score: 3 }
          ]
        },
        {
          id: "rc2",
          text: "Does your company comply with legal, tax and regulatory requirements applicable to your sector?",
          options: [
            { label: "No compliance ensured / risk of sanctions", score: 0, recommendation: "Perform an urgent compliance audit to identify any legal or tax liabilities." },
            { label: "Basic but irregular compliance", score: 1, recommendation: "Establish a compliance calendar to ensure all tax filings and renewals are done on time." },
            { label: "Generally compliant but without formal audit", score: 2 },
            { label: "Full compliance + regular controls/audits + up-to-date documentation", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Consult with a legal or tax expert to ensure your business foundation is fully compliant with local laws.",
          "Identify and document the most critical 'single point of failure' in your business and create a backup plan."
        ],
        amber: [
          "Develop a formal risk mitigation plan for your top 3 identified risks.",
          "Schedule regular internal compliance checks to avoid costly fines or legal issues."
        ],
        green: [
          "Obtain relevant ISO or industry-specific certifications to build trust with larger clients.",
          "Implement a comprehensive business continuity plan (BCP) to handle major disruptions."
        ]
      }
    },
    {
      id: "branding",
      name: "Branding & Packaging",
      questions: [
        {
          id: "bp1",
          text: "Is your visual identity (logo, colors, tone) consistent and used uniformly?",
          options: [
            { label: "Identity non-existent or inconsistent", score: 0, recommendation: "Develop a basic 'Brand Style Guide' to ensure consistent use of your logo and colors." },
            { label: "Basic graphic elements, inconsistency in usage", score: 1, recommendation: "Update all your customer-facing materials (website, cards, emails) to match your current branding." },
            { label: "Clear visual identity applied to most materials", score: 2 },
            { label: "Professional branding, consistent, applied everywhere", score: 3 }
          ]
        },
        {
          id: "bp2",
          text: "Does your packaging meet market standards (quality, information, readability, attractiveness, compliance)?",
          options: [
            { label: "Packaging absent / non-compliant", score: 0, recommendation: "Review the regulatory packaging requirements for your industry and update your design accordingly." },
            { label: "Basic packaging, unattractive or incomplete", score: 1, recommendation: "Invest in better packaging materials or design to improve the 'unboxing' experience for customers." },
            { label: "Functional and compliant packaging, improvable", score: 2 },
            { label: "Professional packaging, attractive, compliant with sector standards", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Define your core brand values: What do you want customers to feel when they interact with your company?",
          "Create a professional logo that reflects your company's mission and appeals to your target audience."
        ],
        amber: [
          "Harmonize your branding across all social media and digital channels for a more professional image.",
          "Ask for customer feedback on your packaging to identify areas for improvement in design or functionality."
        ],
        green: [
          "Develop a premium packaging strategy to differentiate your product in a crowded market.",
          "Tell your brand story more effectively through your website and marketing materials to build an emotional connection."
        ]
      }
    },
    {
      id: "export",
      name: "Export Readiness",
      questions: [
        {
          id: "er1",
          text: "Does your company have the documentation, certifications and standards necessary to export?",
          options: [
            { label: "No steps taken", score: 0, recommendation: "Research the specific export certifications required for your product in your top 3 target countries." },
            { label: "Documents or standards partially gathered", score: 1, recommendation: "Engage an export consultant or agency to help complete your international documentation." },
            { label: "Documentation largely complete / certification in progress", score: 2 },
            { label: "Complete documentation + certifications obtained", score: 3 }
          ]
        },
        {
          id: "er2",
          text: "Has your company assessed and prepared logistics, export packaging, and target markets?",
          options: [
            { label: "No preparation work", score: 0, recommendation: "Identify one priority international market and research its local competition and pricing." },
            { label: "Interest expressed but no structured analysis", score: 1, recommendation: "Develop a basic international logistics plan, including potential freight forwarding partners." },
            { label: "Partial analysis: logistics, packaging or target markets", score: 2 },
            { label: "Complete preparation: logistics, export standards, market analysis, prospecting", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Evaluate the 'Export Potential' of your current products: Are they viable in other markets without major changes?",
          "Research the customs duties and trade barriers for your product in potential target regions."
        ],
        amber: [
          "Develop a dedicated export strategy and allocate a specific budget for international marketing.",
          "Establish partnerships with local distributors or agents in your primary target international market."
        ],
        green: [
          "Implement a 'Global by Design' approach for new products to simplify future international expansions.",
          "Set up regional distribution hubs to reduce shipping times and costs for international customers."
        ]
      }
    }
  ],
  scoring: {
    thresholds: {
      red: [0, 39],
      amber: [40, 69],
      green: [70, 100]
    },
    logic: "Average question scores × 25 = pillar score. Overall score = mean of all pillar scores."
  }
};

module.exports = questionsData;
