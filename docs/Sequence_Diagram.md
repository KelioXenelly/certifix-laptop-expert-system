sequenceDiagram
autonumber
actor User
participant NextJS as Next.js (Frontend & Logic)
participant Supabase as Supabase (PostgreSQL)

    User->>NextJS: Opens Consultation Page
    NextJS->>Supabase: Fetch Knowledge Base (Decision Tree Rules, Symptoms, CF Weights)
    Supabase-->>NextJS: Return full Knowledge Base JSON

    Note over NextJS: 🌳 DECISION TREE + FORWARD CHAINING BEGINS
    NextJS->>NextJS: Starts at Root Node of the first valid Rule
    NextJS-->>User: Displays Question 1

    loop Decision Tree Traversal
        User->>NextJS: Answers "Ya" or "Tidak"
        NextJS->>NextJS: If "Ya": next symptom. If "Tidak": skip branch & jump to next Rule
        NextJS-->>User: Displays Next Question dynamically (no redundancy)
    end

    Note over NextJS: 🧮 CF CALCULATION
    NextJS->>NextJS: Calculates final percentage using Certainty Factor Formula

    NextJS->>Supabase: Insert result to diagnosis_history table
    Supabase-->>NextJS: Confirm insert success
    NextJS-->>User: Displays Diagnosis Results & Solutions (in %)
