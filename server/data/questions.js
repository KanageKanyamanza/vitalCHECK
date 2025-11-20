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
            { label: "No records", score: 0 },
            { label: "Basic records, not updated", score: 1 },
            { label: "Updated quarterly", score: 2 },
            { label: "Updated monthly", score: 3 }
          ]
        },
        {
          id: "f2",
          text: "How many months of cash reserves can your business cover?",
          options: [
            { label: "< 1 month", score: 0 },
            { label: "1–3 months", score: 1 },
            { label: "3–6 months", score: 2 },
            { label: "> 6 months", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Start keeping monthly financial records (P&L, Balance Sheet, Cash Flow).",
          "Separate personal and business finances to avoid confusion.",
          "Set up basic bookkeeping system or hire an accountant."
        ],
        amber: [
          "Build a 3–6 month cash flow forecast.",
          "Track receivables more closely and follow up on overdue payments.",
          "Review and optimize your pricing strategy."
        ],
        green: [
          "Explore funding options for growth and expansion.",
          "Use financial dashboards to monitor KPIs in real-time.",
          "Consider advanced financial planning and investment strategies."
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
            { label: "Not at all", score: 0 },
            { label: "Some processes only", score: 1 },
            { label: "Most processes documented", score: 2 },
            { label: "Fully standardized & automated", score: 3 }
          ]
        },
        {
          id: "o2",
          text: "How do you monitor operational efficiency?",
          options: [
            { label: "No monitoring", score: 0 },
            { label: "Ad-hoc checks", score: 1 },
            { label: "Regular reviews", score: 2 },
            { label: "Data-driven KPIs", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Document at least your core processes (sales, procurement, customer service).",
          "Identify bottlenecks in your current operations.",
          "Create simple checklists for key activities."
        ],
        amber: [
          "Standardize workflows and add simple KPIs.",
          "Implement regular operational reviews.",
          "Train staff on documented processes."
        ],
        green: [
          "Automate processes and consider ERP systems.",
          "Implement advanced analytics and predictive maintenance.",
          "Focus on continuous improvement and innovation."
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
            { label: "Mostly word of mouth", score: 0 },
            { label: "Some irregular marketing", score: 1 },
            { label: "Structured campaigns (social, email, etc.)", score: 2 },
            { label: "Integrated sales + marketing strategy with KPIs", score: 3 }
          ]
        },
        {
          id: "s2",
          text: "Do you track customer retention and lifetime value?",
          options: [
            { label: "No", score: 0 },
            { label: "Basic tracking (spreadsheets)", score: 1 },
            { label: "Regular monitoring", score: 2 },
            { label: "Advanced analytics + CRM system", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Define your target customers clearly.",
          "Set up basic digital presence (Google Business, social media).",
          "Create a simple marketing plan."
        ],
        amber: [
          "Launch structured marketing campaigns.",
          "Track leads systematically and measure conversion rates.",
          "Develop customer retention strategies."
        ],
        green: [
          "Optimize customer lifetime value and implement advanced CRM.",
          "Use data analytics for personalized marketing campaigns.",
          "Focus on customer experience and loyalty programs."
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
            { label: "No", score: 0 },
            { label: "Partial / informal", score: 1 },
            { label: "Regular reviews for key roles", score: 2 },
            { label: "Systematic across all staff", score: 3 }
          ]
        },
        {
          id: "p2",
          text: "Do you invest in staff training & development?",
          options: [
            { label: "Never", score: 0 },
            { label: "Occasionally", score: 1 },
            { label: "Annual training plan", score: 2 },
            { label: "Continuous training program", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Define roles and responsibilities clearly for all positions.",
          "Create basic job descriptions and expectations.",
          "Establish regular communication channels with staff."
        ],
        amber: [
          "Introduce regular performance reviews and training budget.",
          "Develop career development paths for key employees.",
          "Implement basic HR policies and procedures."
        ],
        green: [
          "Build leadership pipeline and succession planning.",
          "Implement comprehensive HR software and analytics.",
          "Focus on employee engagement and retention strategies."
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
            { label: "None", score: 0 },
            { label: "Informal ideas only", score: 1 },
            { label: "Written plan, not regularly updated", score: 2 },
            { label: "Clear, updated plan with monitoring", score: 3 }
          ]
        },
        {
          id: "st2",
          text: "How often does leadership review business performance?",
          options: [
            { label: "Never", score: 0 },
            { label: "Occasionally", score: 1 },
            { label: "Quarterly", score: 2 },
            { label: "Monthly", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Write down a one-page business plan (vision, goals, 12-month roadmap).",
          "Define your competitive advantages and market position.",
          "Set basic financial and operational targets."
        ],
        amber: [
          "Hold quarterly performance reviews and strategy updates.",
          "Develop key performance indicators (KPIs) for tracking progress.",
          "Create contingency plans for potential risks."
        ],
        green: [
          "Set up an advisory board and use strategic KPIs.",
          "Implement scenario planning and market analysis.",
          "Focus on long-term strategic partnerships and alliances."
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
            { label: "Very limited", score: 0 },
            { label: "Basic (emails, spreadsheets)", score: 1 },
            { label: "Core systems in place (accounting, CRM, ERP)", score: 2 },
            { label: "Advanced digital tools integrated across functions", score: 3 }
          ]
        },
        {
          id: "t2",
          text: "Do you have a cybersecurity/data protection policy?",
          options: [
            { label: "None", score: 0 },
            { label: "Basic informal practices", score: 1 },
            { label: "Formal policy, not enforced", score: 2 },
            { label: "Fully implemented + staff trained", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Adopt basic business software (accounting, POS, CRM).",
          "Implement regular data backups and basic security measures.",
          "Train staff on essential digital tools."
        ],
        amber: [
          "Backup data regularly and formalize cybersecurity basics.",
          "Integrate core business systems for better efficiency.",
          "Develop digital skills training programs for staff."
        ],
        green: [
          "Integrate advanced systems (CRM + ERP + analytics).",
          "Explore automation, AI, and emerging technologies.",
          "Implement comprehensive cybersecurity and data governance."
        ]
      }
    },
    {
      id: "risks",
      name: "Risks & Compliance",
      questions: [
        {
          id: "r1",
          text: "Risk management?",
          options: [
            { label: "No system", score: 0 },
            { label: "Some risks identified", score: 1 },
            { label: "Partial process", score: 2 },
            { label: "Complete system", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Identify the main risks of your business.",
          "Consult regulations applicable to your sector.",
          "Implement basic compliance measures."
        ],
        amber: [
          "Develop a formal risk management process.",
          "Conduct regular compliance audits.",
          "Document your compliance procedures."
        ],
        green: [
          "Implement a complete risk management system with continuous monitoring.",
          "Obtain relevant sector certifications.",
          "Establish a risk management committee."
        ]
      }
    },
    {
      id: "branding",
      name: "Branding & Packaging",
      questions: [
        {
          id: "b1",
          text: "Branding?",
          options: [
            { label: "No clear branding", score: 0 },
            { label: "Basic", score: 1 },
            { label: "Coherent", score: 2 },
            { label: "Professional", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Define your brand identity (values, mission, vision).",
          "Create a logo and basic visual elements.",
          "Develop a clear brand message."
        ],
        amber: [
          "Harmonize your branding across all communication channels.",
          "Improve your packaging quality.",
          "Develop a coherent visual identity."
        ],
        green: [
          "Create a premium and memorable brand experience.",
          "Invest in innovative and differentiating packaging.",
          "Develop a long-term brand strategy."
        ]
      }
    },
    {
      id: "export",
      name: "Export Readiness",
      questions: [
        {
          id: "e1",
          text: "Ready to export?",
          options: [
            { label: "No steps taken", score: 0 },
            { label: "Informal interest", score: 1 },
            { label: "Partial preparation", score: 2 },
            { label: "Complete process", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Assess the export potential of your products/services.",
          "Research regulatory requirements for export.",
          "Identify at least one potential target market."
        ],
        amber: [
          "Develop an export plan with priority markets.",
          "Establish local partnerships in target markets.",
          "Adapt your products/services to international market requirements."
        ],
        green: [
          "Implement a complete export strategy with multiple markets.",
          "Create a strong international presence with local partners.",
          "Develop international logistics and distribution capabilities."
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
