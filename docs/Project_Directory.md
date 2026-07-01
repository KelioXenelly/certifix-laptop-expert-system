app/
├── layout.tsx # Main App Layout (Tailwind + MUI config)
├── page.tsx # Landing Page
├── consultation/  
│ ├── layout.tsx  
│ │ └── page.tsx # Input Name -> Dynamic Q&A UI
│ ├── result/  
│ │ └── page.tsx # Final CF Percentage & Solution Card
│ └── admin/ # Protected Route (Supabase Auth)
│ ├── login/page.tsx  
│ ├── dashboard/page.tsx  
│ ├── damages/page.tsx  
│ ├── symptoms/page.tsx  
│ └── rules/page.tsx  
├── components/
│ └── ui/ # Reusable MUI / Tailwind Components
├── lib/
│ ├── supabaseClient.ts # Supabase Connection
│ └── expertSystem/
│ ├── decisionTree.ts # Mapping logic
│ ├── forwardChaining.ts # Traversal inference logic
│ └── certaintyFactor.ts # CF combine math logic
└── types/
    └── index.ts # TypeScript interfaces for database schemas

supabase/
├── migrations/
│   └── 00000000000000_init_db.sql # Tabel Skema Database
└── seed.sql # Data Pakar Awal (Gejala, Kerusakan, Rules)
