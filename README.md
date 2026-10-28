# ⚖️ Multi-Agent AI Copyright Investigation Assistant

### Intelligent Copyright Analysis Using RAG, Semantic Search & Collaborative AI Agents

An AI-powered copyright investigation assistant designed to analyze submitted content, retrieve semantically related reference materials, assess potential similarities, examine attribution and licensing information, and organize findings into an evidence-based investigation report.

The project combines a modern investigation dashboard with a multi-stage AI workflow concept to make copyright analysis more structured, transparent, and easier to review.

## 📸 Application Preview

![Multi-Agent AI Copyright Assistant Dashboard](docs/screenshots/copyright-assistant-dashboard.png)

*Dashboard preview showing the investigation input suite, seven-stage workflow, semantic search results, licensing information, similarity scores, and investigation report interface.*

> **Setup:** Save your dashboard screenshot at `docs/screenshots/copyright-assistant-dashboard.png` in the repository. Create the folders if they do not exist. GitHub will display the image automatically.

## 🎯 Problem Statement

Evaluating whether a piece of content resembles existing copyrighted material can require reviewing multiple documents, searching reference sources, comparing passages, examining licensing terms, and documenting evidence.

Manual investigation can be time-consuming and difficult to organize consistently.

This project explores an AI-assisted workflow that brings these tasks together in a unified interface, helping users identify potentially relevant sources and review copyright-related evidence more efficiently.

## 💡 Key Features

- **Multi-Agent Investigation Workflow:** A seven-stage interface covering content analysis, retrieval, similarity matching, citation checks, legal knowledge review, risk assessment, and report generation.
- **RAG-Based Reference Retrieval:** Organizes relevant reference materials for retrieval during an investigation.
- **Semantic Similarity Analysis:** Displays similarity scores to help identify potentially related content.
- **Multiple Input Modes:** Interface options for text/manuscript analysis, source code investigation, and image auditing.
- **Citation and Attribution Review:** Supports examination of source attribution and licensing information.
- **Legal Knowledge and Risk Review:** Organizes licensing, legal-framework, and potential-risk indicators for further examination.
- **Investigation Report Interface:** Includes a dedicated area for presenting findings in Markdown format.
- **Custom Reference Sources:** Provides an interface for adding reference materials to the investigation.
- **Configurable Search Settings:** Includes similarity-threshold and retrieval top-K controls.
- **Interactive Dashboard:** Presents investigation stages, retrieved sources, and results in a consolidated workspace.

*Feature note: The dashboard presents these workflow stages. Actual AI inference, document indexing, image analysis, and backend integrations depend on the implementation configured in the project.*

## 🖥️ Sample Application Output

The following values are taken from the displayed dashboard screenshot. They illustrate the current interface and should not be interpreted as independently validated copyright findings.
<img width="959" height="472" alt="Screenshot 2026-10-28 115615" src="https://github.com/user-attachments/assets/220e6ad0-e25c-4d8f-8741-143be6fb9f81" />
![Uploading output.png…]()



### 1. Investigation Pipeline

The dashboard presents seven stages:

1. Content and entity extraction
2. RAG reference search
3. Similarity matching
4. Citation verification
5. Legal knowledge review
6. Risk assessment
7. Report generation

### 2. Retrieved Reference Sources

| Document ID | Reference title | Displayed similarity |
|---|---|---:|
| doc-103 | Fast Matrix Inversion Algorithm (GPL-3.0) | 32% |
| doc-101 | Principles of Quantum Computing & Cryptography | 3% |
| doc-104 | Creative Commons Legal Framework and Fair Use Guidelines | 1% |
| doc-102 | Modern Distributed Web Architecture and Microservices | 0% |

*These are sample records displayed in the dashboard. Their similarity percentages are illustrative interface outputs, not proof of infringement.*

### 3. Investigation Dashboard

The interface provides dedicated views for:

- Overview and risk meter
- Passage match comparison
- Retrieved RAG sources
- Citation and fair-use audit
- Investigation report in Markdown

### 4. Example Investigation

**Input:** A source-code snippet or manuscript.

**Expected workflow:**

1. Extract relevant content and entities.
2. Retrieve potentially related reference documents.
3. Compare content using an appropriate similarity method.
4. Present relevant source metadata and attribution information.
5. Organize potential risks and findings for human review.
<img width="944" height="479" alt="workflow" src="https://github.com/user-attachments/assets/629c4f65-6aac-4e9a-8a29-6da7b316113c" />


The reliability of each step depends on the retrieval corpus, similarity method, configured AI models, and available backend services.

## 🏗️ System Architecture

The intended investigation flow is:

```text
User Input
    |
    v
Content Analysis
    |
    v
Reference Retrieval (RAG)
    |
    v
Semantic Similarity Matching
    |
    v
Citation & Attribution Review
    |
    v
Legal Knowledge Review
    |
    v
Risk Assessment
    |
    v
Investigation Report
```

The dashboard organizes these stages into a multi-agent workflow. Each stage represents a distinct investigation responsibility; whether it operates as an independent AI agent depends on the backend implementation.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Dashboard structure |
| CSS3 | Styling, layout, and responsive presentation |
| JavaScript | Interactive UI and investigation workflow |
| Python | PowerPoint presentation generation utility |
| RAG concepts | Reference retrieval and evidence organization |
| Semantic similarity | Comparing potentially related content |

**AI/ML integration:** Add the exact embedding model, vector database, LLM provider, orchestration framework, and backend framework here once you verify which are actually implemented.

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Visual Studio Code
- The VS Code Live Server extension

Python and `python-pptx` are needed only if you want to run the included PowerPoint-generation script.

### Installation

**1. Clone the repository**

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Multi-Agent-AI-Copyrights-Investigation-Assistant-main
```

**2. Open the project in VS Code**

```bash
code .
```

**3. Run the website**

Open `index.html`, right-click it, and select **Open with Live Server**.

Alternatively, if Python is installed, run the following from the directory containing `index.html`:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

**4. Generate the PowerPoint presentation (optional)**

Install the required dependency:

```bash
python -m pip install python-pptx
```

Run:

```bash
python make_ppt.py
```

The script generates or updates `Copyright_Investigation_Assistant_Presentation.pptx` in the project directory.

## 📁 Project Structure

```text
Multi-Agent-AI-Copyrights-Investigation-Assistant-main/
├── index.html
├── styles.css
├── app.js
├── hero.jpg
├── presentation.html
├── make_ppt.py
├── Copyright_Investigation_Assistant_Presentation.pptx
├── docs/
│   └── screenshots/
│       └── copyright-assistant-dashboard.png
└── README.md
```

## 🔍 Responsible Use and Limitations

- Similarity scores indicate potential textual or semantic relationships; they do not independently establish copyright infringement.
- Licensing and attribution information should be checked against reliable sources and the applicable license terms.
- Legal assessments depend on jurisdiction, context, and the facts of each case.
- Generated reports should be reviewed by a human before being relied upon.
- Claims about AI agents, vector search, model inference, image analysis, and external integrations should reflect the functionality actually implemented and tested.

This application is intended as an investigation-support tool, not a substitute for professional legal advice or a final legal determination.

## 🔮 Future Enhancements

- Integrate a verified embedding model and vector database.
- Implement independently testable investigation agents.
- Add passage-level matching with source evidence.
- Support document ingestion and reference-corpus management.
- Add evaluation datasets and retrieval-quality metrics.
- Generate downloadable reports with source references.
- Introduce authentication, investigation history, and audit logs.
- Evaluate the system against known examples and human-reviewed findings.

## 👩‍💻 Author

**SURYA PRAKASH P**

B.Tech.-Artificial Intelligence and Data Science

Interests: Artificial Intelligence, Machine Learning, Data Science, and AI application development.

*Built to explore how AI-assisted retrieval, similarity analysis, and structured investigation workflows can support copyright research.*
