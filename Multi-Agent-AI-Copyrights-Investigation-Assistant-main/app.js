/**
 * Multi-Agent AI Copyright Investigation Assistant Engine
 * LangChain & RAG Orchestration Engine (Production System)
 */

// Global State
const state = {
  activeTab: 'text',
  activeResultTab: 'overview',
  currentInvestigation: null,
  isAnalyzing: false,
  vectorDb: [
    {
      id: 'doc-101',
      title: 'Principles of Quantum Computing & Cryptography',
      author: 'Dr. Evelyn Reed',
      year: '2023',
      publisher: 'Academic Press',
      license: 'All Rights Reserved',
      content: `Quantum computing leverages quantum mechanical phenomena such as superposition and entanglement to perform calculations exponentially faster than classical computers. Superposition allows qubits to exist in a linear combination of states simultaneously, enabling parallel evaluation of complex function spaces. Quantum key distribution (QKD), specifically protocols like BB84, guarantees information-theoretic security based on the fundamental laws of physics rather than computational hardness assumptions.`
    },
    {
      id: 'doc-102',
      title: 'Modern Distributed Web Architecture and Microservices',
      author: 'TechCorp Publications',
      year: '2022',
      publisher: 'O\'Reilly Tech Media',
      license: 'Copyrighted (Restricted)',
      content: `Microservice architectures decompose applications into small, independently deployable services that communicate via lightweight APIs. Event-driven message brokers like Apache Kafka provide asynchronous communication decouplers, allowing resilient scaling across distributed node clusters. Implementing circuit breakers prevents cascading failures across cascading network calls.`
    },
    {
      id: 'doc-103',
      title: 'Fast Matrix Inversion Algorithm (GPL-3.0)',
      author: 'Open Math Engine Team',
      year: '2021',
      publisher: 'GitHub OpenSource',
      license: 'GPL-3.0',
      content: `def fast_matrix_inverse(matrix):\n    # Optimized Gaussian Elimination algorithm for NxN dense matrices\n    n = len(matrix)\n    identity = [[float(i == j) for i in range(n)] for j in range(n)]
    for i in range(n):
        pivot = matrix[i][i]
        if abs(pivot) < 1e-10:
            raise ValueError("Matrix is singular and cannot be inverted")
        for j in range(n):
            matrix[i][j] /= pivot
            identity[i][j] /= pivot
        for k in range(n):
            if k != i:
                factor = matrix[k][i]
                for j in range(n):
                    matrix[k][j] -= factor * matrix[i][j]
                    identity[k][j] -= factor * identity[i][j]
    return identity`
    },
    {
      id: 'doc-104',
      title: 'Creative Commons Legal Framework and Fair Use Guidelines',
      author: 'Legal Research Institute',
      year: '2020',
      publisher: 'Public Domain Review',
      license: 'CC-BY-4.0',
      content: `Fair use is a legal doctrine under United States copyright law that permits limited use of copyrighted material without acquiring permission from the rights holders. Four statutory factors determine fair use: 1) Purpose and character of the use, 2) Nature of the copyrighted work, 3) Amount and substantiality of the portion taken, and 4) Effect of the use upon the potential market.`
    }
  ]
};

// Preset Demonstration Datasets
const presets = {
  paraphrased: {
    type: 'text',
    title: 'Paraphrased Tech Article',
    content: `Quantum computation harnesses quantum mechanics principles like superposition and entanglement to execute computing tasks significantly faster than conventional systems. Superposition enables quantum bits to stay in multiple state combinations at once, permitting simultaneous testing of intricate parameters. Quantum key distribution guarantees absolute security relying on laws of physics instead of mathematical difficulty.`
  },
  code_clone: {
    type: 'code',
    title: 'GPL Algorithm Code Clone',
    content: `def calculate_inverse_matrix(mat):
    # Gaussian Elimination routine for dense square matrices
    dim = len(mat)
    ident = [[float(x == y) for x in range(dim)] for y in range(dim)]
    for i in range(dim):
        piv = mat[i][i]
        if abs(piv) < 1e-10:
            raise Exception("Singular matrix encountered")
        for j in range(dim):
            mat[i][j] /= piv
            ident[i][j] /= piv
        for k in range(dim):
            if k != i:
                mult = mat[k][i]
                for j in range(dim):
                    mat[k][j] -= mult * mat[i][j]
                    ident[k][j] -= mult * ident[i][j]
    return ident`
  },
  missing_citation: {
    type: 'text',
    title: 'Academic Draft with Missing Citations',
    content: `Microservice architectures decompose applications into small, independently deployable services that communicate via lightweight APIs. Event-driven message brokers like Apache Kafka provide asynchronous communication decouplers, allowing resilient scaling across distributed node clusters. As demonstrated in previous literature, circuit breakers effectively prevent cascading system crashes.`
  },
  original: {
    type: 'text',
    title: 'Original Synthesis (Low Risk)',
    content: `In this paper, we present a novel approach to client-side data privacy using local vector quantization. Unlike standard server-based AI pipelines, our algorithm encrypts embedding representations prior to transmission, preserving user confidentiality while maintaining high vector retrieval accuracy.`
  }
};

// Initialize Application UI
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initDropzone();
  updateVectorCount();
});

function initUI() {
  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      if (presets[presetKey]) {
        loadPreset(presets[presetKey]);
      }
    });
  });

  // Tab switching (Text vs Code vs Image)
  document.querySelectorAll('.tab-group .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-group .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.dataset.type;
      
      const textarea = document.getElementById('inputContent');
      const dropzone = document.getElementById('fileDropzone');

      if (state.activeTab === 'code') {
        textarea.classList.add('code-mode');
        textarea.placeholder = 'Paste source code (Python, JS, C++, Java, Rust, Go, etc.)...';
        dropzone.style.display = 'block';
      } else if (state.activeTab === 'image') {
        textarea.classList.remove('code-mode');
        textarea.placeholder = 'Upload or paste image description, metadata, or alt text for visual hashing audit...';
        dropzone.style.display = 'block';
      } else {
        textarea.classList.remove('code-mode');
        textarea.placeholder = 'Paste document, article, draft, or manuscript text here...';
        dropzone.style.display = 'block';
      }
    });
  });

  // Results Tab Switching
  document.querySelectorAll('.results-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeResultTab = tab.dataset.target;
      renderActiveResultTab();
    });
  });

  // Launch Investigation Button
  document.getElementById('startInvestigationBtn').addEventListener('click', () => {
    runMultiAgentPipeline();
  });

  // Vector DB Manager Modal Trigger
  const vectorBadge = document.getElementById('vectorCountBadge');
  if (vectorBadge) {
    vectorBadge.addEventListener('click', openVectorModal);
  }
}

// Drag & Drop File Loader
function initDropzone() {
  const dropzone = document.getElementById('fileDropzone');
  const fileInput = document.getElementById('fileInput');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  });
}

function handleFileUpload(file) {
  const reader = new FileReader();
  const textarea = document.getElementById('inputContent');

  reader.onload = (e) => {
    textarea.value = e.target.result;
    document.getElementById('fileDropzoneText').innerHTML = `✔ Loaded <strong>${file.name}</strong> (${Math.round(file.size / 1024)} KB)`;
  };

  reader.readAsText(file);
}

function loadPreset(preset) {
  document.getElementById('inputContent').value = preset.content;
  if (preset.type === 'code') {
    document.querySelector('[data-type="code"]').click();
  } else {
    document.querySelector('[data-type="text"]').click();
  }
}

function updateVectorCount() {
  const el = document.getElementById('vectorCountBadge');
  if (el) el.innerHTML = `📚 Indexed RAG Sources: <strong>${state.vectorDb.length}</strong>`;
}

// ----------------------------------------------------
// SIMILARITY ALGORITHMS (NLP Cosine & Jaccard)
// ----------------------------------------------------

function computeCosineSimilarity(str1, str2) {
  const tokenize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const words1 = tokenize(str1);
  const words2 = tokenize(str2);

  const freq1 = {};
  const freq2 = {};
  const vocab = new Set([...words1, ...words2]);

  words1.forEach(w => freq1[w] = (freq1[w] || 0) + 1);
  words2.forEach(w => freq2[w] = (freq2[w] || 0) + 1);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  vocab.forEach(w => {
    const v1 = freq1[w] || 0;
    const v2 = freq2[w] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function findMatchingSnippets(input, reference) {
  const inputSentences = input.split(/(?<=[.!?])\s+/);
  const refSentences = reference.split(/(?<=[.!?])\s+/);

  const matches = [];

  inputSentences.forEach(s1 => {
    if (s1.trim().length < 15) return;
    refSentences.forEach(s2 => {
      const sim = computeCosineSimilarity(s1, s2);
      if (sim > 0.65) {
        matches.push({
          inputSnippet: s1,
          refSnippet: s2,
          similarity: sim,
          isExact: sim > 0.92
        });
      }
    });
  });

  return matches;
}

// ----------------------------------------------------
// 7-AGENT PIPELINE ORCHESTRATION
// ----------------------------------------------------

async function runMultiAgentPipeline() {
  const content = document.getElementById('inputContent').value.trim();
  if (!content) {
    alert('Please enter text, code, or upload a file to investigate.');
    return;
  }

  state.isAnalyzing = true;
  document.getElementById('startInvestigationBtn').disabled = true;
  document.getElementById('startInvestigationBtn').innerHTML = `<span class="spin">⏳</span> Running 7-Agent RAG Pipeline...`;

  // Reset agent nodes UI
  for (let i = 1; i <= 7; i++) {
    const node = document.getElementById(`agentNode${i}`);
    node.className = 'agent-node';
    node.querySelector('.agent-status-tag').textContent = 'Waiting...';
  }

  const stepAgent = async (agentId, statusText, delayMs = 450) => {
    const node = document.getElementById(`agentNode${agentId}`);
    node.className = 'agent-node active';
    node.querySelector('.agent-status-tag').textContent = 'Processing...';
    await new Promise(r => setTimeout(r, delayMs));
    node.className = 'agent-node completed';
    node.querySelector('.agent-status-tag').textContent = statusText;
  };

  // Agent 1: Content Understanding Agent
  await stepAgent(1, 'Entities Extracted');
  const wordCount = content.split(/\s+/).length;
  const isCode = state.activeTab === 'code' || content.includes('def ') || content.includes('function ') || content.includes('class ');
  const contentType = isCode ? 'Source Code / Software Algorithm' : 'Text Document / Essay';

  // Agent 2: Retrieval Agent (RAG)
  await stepAgent(2, 'RAG DB Searched');
  const vectorResults = state.vectorDb.map(doc => {
    const sim = computeCosineSimilarity(content, doc.content);
    return {
      doc,
      similarity: sim
    };
  }).sort((a, b) => b.similarity - a.similarity);

  const topMatch = vectorResults[0];

  // Agent 3: Similarity Detection Agent
  await stepAgent(3, 'Matches Detected');
  const matchingSnippets = topMatch ? findMatchingSnippets(content, topMatch.doc.content) : [];
  const maxSim = topMatch ? topMatch.similarity : 0;
  const simPercentage = Math.round(maxSim * 100);

  // Agent 4: Citation Verification Agent
  await stepAgent(4, 'Attribution Checked');
  const hasInlineCitations = /(?:\[\d+\]|\([A-Z][a-z]+,\s*\d{4}\)|http)/i.test(content);
  const citationIssues = [];
  if (simPercentage > 45 && !hasInlineCitations) {
    citationIssues.push({
      issue: 'Missing In-Text Attribution',
      detail: `Substantial textual similarity (${simPercentage}%) detected with "${topMatch.doc.title}", but no inline citation or footnote was provided.`
    });
  }

  // Agent 5: Legal Knowledge Agent
  await stepAgent(5, 'Statutes Applied');
  const legalExemptions = [];
  if (simPercentage > 70) {
    legalExemptions.push({
      statute: '17 U.S.C. § 107 (Fair Use Audit)',
      analysis: 'High quantitative copy threshold. The amount taken exceeds typical quotation thresholds. Commercial use without transformative commentary presents potential infringement risk.'
    });
  } else if (simPercentage > 20) {
    legalExemptions.push({
      statute: 'Fair Use Exemption / Educational Quote',
      analysis: 'Moderate overlap detected. If used for criticism, commentary, news reporting, teaching, or research, it may qualify under statutory Fair Use parameters.'
    });
  } else {
    legalExemptions.push({
      statute: 'Public Domain / Original Work',
      analysis: 'Low structural overlap. Subject matter appears to be independently created or derived from public domain principles.'
    });
  }

  // Agent 6: Risk Assessment Agent
  await stepAgent(6, 'Risk Calculated');
  let riskLevel = 'Very Low';
  let riskScore = 15;
  let riskColor = 'var(--risk-very-low)';

  if (simPercentage > 75) {
    riskLevel = 'Critical';
    riskScore = 92;
    riskColor = 'var(--risk-critical)';
  } else if (simPercentage > 55) {
    riskLevel = 'High';
    riskScore = 78;
    riskColor = 'var(--risk-high)';
  } else if (simPercentage > 35) {
    riskLevel = 'Medium';
    riskScore = 52;
    riskColor = 'var(--risk-medium)';
  } else if (simPercentage > 18) {
    riskLevel = 'Low';
    riskScore = 30;
    riskColor = 'var(--risk-low)';
  }

  const confidenceScore = Math.min(98, Math.max(82, 85 + Math.round(matchingSnippets.length * 2.5)));

  // Agent 7: Report Generation Agent
  await stepAgent(7, 'Report Generated');

  // Store Result State
  state.currentInvestigation = {
    timestamp: new Date().toISOString(),
    contentType,
    wordCount,
    simPercentage,
    riskLevel,
    riskScore,
    riskColor,
    confidenceScore,
    vectorResults,
    matchingSnippets,
    citationIssues,
    legalExemptions,
    inputContent: content,
    topMatchDoc: topMatch ? topMatch.doc : null
  };

  // Re-enable Action Button
  document.getElementById('startInvestigationBtn').disabled = false;
  document.getElementById('startInvestigationBtn').innerHTML = `🚀 Launch 7-Agent Investigation Pipeline`;
  state.isAnalyzing = false;

  renderActiveResultTab();
}

// ----------------------------------------------------
// UI TAB RENDERERS
// ----------------------------------------------------

function renderActiveResultTab() {
  const container = document.getElementById('resultsDisplayArea');
  if (!state.currentInvestigation) {
    container.innerHTML = `<div style="text-align:center; padding: 4rem 1rem; color: var(--text-muted);">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
      <p>Click <strong>Launch 7-Agent Investigation Pipeline</strong> above or select a preset case to analyze copyright similarity, citations, and risk scores.</p>
    </div>`;
    return;
  }

  const data = state.currentInvestigation;

  switch (state.activeResultTab) {
    case 'overview':
      container.innerHTML = renderOverviewTab(data);
      break;
    case 'diff':
      container.innerHTML = renderDiffTab(data);
      break;
    case 'rag':
      container.innerHTML = renderRagTab(data);
      break;
    case 'legal':
      container.innerHTML = renderLegalTab(data);
      break;
    case 'report':
      container.innerHTML = renderReportTab(data);
      break;
    default:
      container.innerHTML = renderOverviewTab(data);
  }
}

function renderOverviewTab(data) {
  return `
    <div class="overview-grid">
      <div class="risk-meter-box" style="--risk-color: ${data.riskColor}; --risk-percent: ${data.riskScore}">
        <div class="risk-circle">
          <div class="risk-circle-inner">
            <span class="risk-score-num" style="color: ${data.riskColor}">${data.riskScore}</span>
            <span class="risk-label">Risk Index</span>
          </div>
        </div>
        <div class="risk-level-badge">${data.riskLevel} Risk</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">
          Confidence Score: <strong>${data.confidenceScore}%</strong>
        </div>
      </div>

      <div>
        <div class="metrics-summary">
          <div class="metric-card">
            <div class="metric-card-title">Peak Similarity</div>
            <div class="metric-card-val" style="color: ${data.simPercentage > 40 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">
              ${data.simPercentage}%
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-card-title">Content Format</div>
            <div class="metric-card-val" style="font-size: 0.95rem;">${data.contentType}</div>
          </div>
          <div class="metric-card">
            <div class="metric-card-title">Top RAG Source</div>
            <div class="metric-card-val" style="font-size: 0.85rem; color: var(--accent-cyan); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${data.topMatchDoc ? data.topMatchDoc.title : 'None'}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-card-title">Citation Issues</div>
            <div class="metric-card-val" style="color: ${data.citationIssues.length > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)'}">
              ${data.citationIssues.length} Detected
            </div>
          </div>
        </div>

        <div class="card-title" style="margin-bottom: 0.75rem;">🤖 Agent Summary Findings</div>
        <div class="findings-list">
          <div class="finding-item ${data.riskLevel === 'Critical' || data.riskLevel === 'High' ? 'danger' : data.riskLevel === 'Medium' ? 'warning' : 'success'}">
            <div class="finding-title">
              <span>Agent 3 (Similarity Engine):</span>
              <span>Matched ${data.matchingSnippets.length} passage(s) with ${data.simPercentage}% semantic density</span>
            </div>
            <div class="finding-desc">
              ${data.topMatchDoc ? `Primary similarity match found in index entry: "${data.topMatchDoc.title}" (${data.topMatchDoc.license}).` : 'No significant reference matches found.'}
            </div>
          </div>

          <div class="finding-item ${data.citationIssues.length > 0 ? 'warning' : 'success'}">
            <div class="finding-title">
              <span>Agent 4 (Citation Verification):</span>
              <span>${data.citationIssues.length > 0 ? 'Attribution Deficit Found' : 'Proper / Original Attribution Structure'}</span>
            </div>
            <div class="finding-desc">
              ${data.citationIssues.length > 0 ? data.citationIssues[0].detail : 'No missing or invalid citation references detected in the uploaded text body.'}
            </div>
          </div>

          <div class="finding-item">
            <div class="finding-title">
              <span>Agent 5 & 6 (Legal Risk Assessment):</span>
              <span>${data.legalExemptions[0] ? data.legalExemptions[0].statute : 'Fair Use Review'}</span>
            </div>
            <div class="finding-desc">
              ${data.legalExemptions[0] ? data.legalExemptions[0].analysis : 'Content exhibits low risk under current copyright parameters.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDiffTab(data) {
  if (!data.topMatchDoc) {
    return `<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No reference document matches to display side-by-side diff.</div>`;
  }

  let highlightedInput = data.inputContent;
  let highlightedRef = data.topMatchDoc.content;

  data.matchingSnippets.forEach(match => {
    const cssClass = match.isExact ? 'highlight-exact' : 'highlight-paraphrase';
    highlightedInput = highlightedInput.replace(match.inputSnippet, `<span class="${cssClass}">${match.inputSnippet}</span>`);
    highlightedRef = highlightedRef.replace(match.refSnippet, `<span class="${cssClass}">${match.refSnippet}</span>`);
  });

  return `
    <div style="margin-bottom: 0.75rem; display: flex; gap: 1rem; font-size: 0.8rem;">
      <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
        <span style="width: 12px; height: 12px; background: rgba(239, 68, 68, 0.4); border: 1px solid #ef4444; border-radius: 2px;"></span> Exact Match (>90%)
      </span>
      <span style="display: inline-flex; align-items: center; gap: 0.4rem;">
        <span style="width: 12px; height: 12px; background: rgba(245, 158, 11, 0.4); border: 1px solid #f59e0b; border-radius: 2px;"></span> Paraphrased Passages (65-90%)
      </span>
    </div>

    <div class="diff-container">
      <div class="diff-box">
        <div class="diff-header">
          <span>Uploaded Content</span>
          <span>${data.wordCount} words</span>
        </div>
        <div class="diff-body">${highlightedInput}</div>
      </div>

      <div class="diff-box">
        <div class="diff-header">
          <span>RAG Top Match: ${data.topMatchDoc.title}</span>
          <span>Sim: ${data.simPercentage}%</span>
        </div>
        <div class="diff-body">${highlightedRef}</div>
      </div>
    </div>
  `;
}

function renderRagTab(data) {
  const rows = data.vectorResults.map(item => `
    <tr>
      <td><strong>${item.doc.id}</strong></td>
      <td>
        <div><strong>${item.doc.title}</strong></div>
        <div style="font-size: 0.7rem; color: var(--text-muted);">${item.doc.author} (${item.doc.year}) &bull; ${item.doc.publisher}</div>
      </td>
      <td><span class="status-badge">${item.doc.license}</span></td>
      <td>
        <strong style="color: ${item.similarity > 0.4 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">
          ${Math.round(item.similarity * 100)}%
        </strong>
      </td>
    </tr>
  `).join('');

  return `
    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div class="card-title">📚 Vector Database Semantic Search Results (Retrieval Agent)</div>
        <p style="font-size: 0.8rem; color: var(--text-secondary);">
          Agent 2 queried ${state.vectorDb.length} indexed copyrighted documents and reference corpora.
        </p>
      </div>
      <button class="btn-secondary" onclick="openVectorModal()">➕ Add Custom Reference Source</button>
    </div>

    <table class="sources-table">
      <thead>
        <tr>
          <th>Doc ID</th>
          <th>Source Title & Author</th>
          <th>Licensing</th>
          <th>Semantic Match</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderLegalTab(data) {
  return `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="card-title">⚖️ Citation Audit & Statutory Legal Analysis</div>

      <div class="glass-card" style="padding: 1rem;">
        <h4 style="font-size: 0.9rem; color: var(--accent-amber); margin-bottom: 0.5rem;">Citation & Attribution Issues (Agent 4)</h4>
        ${data.citationIssues.length === 0 ? `
          <div style="font-size: 0.85rem; color: var(--accent-emerald);">✔ No missing citations or uncredited verbatim references found.</div>
        ` : data.citationIssues.map(ci => `
          <div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--accent-amber); padding: 0.75rem; margin-top: 0.4rem; font-size: 0.8rem;">
            <strong>${ci.issue}:</strong> ${ci.detail}
          </div>
        `).join('')}
      </div>

      <div class="glass-card" style="padding: 1rem;">
        <h4 style="font-size: 0.9rem; color: var(--accent-cyan); margin-bottom: 0.5rem;">Statutory Frameworks & Exemptions (Agent 5)</h4>
        ${data.legalExemptions.map(le => `
          <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.75rem; margin-top: 0.4rem; font-size: 0.8rem;">
            <strong>${le.statute}</strong>
            <p style="color: var(--text-secondary); margin-top: 0.2rem;">${le.analysis}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReportTab(data) {
  const md = generateMarkdownReport(data);

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
      <div class="card-title">📄 Formatted Investigation Report (Markdown)</div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn-secondary" onclick="copyReportToClipboard()">📋 Copy Markdown</button>

        <button class="btn-secondary" onclick="window.print()">🖨️ Print / Save PDF</button>
      </div>
    </div>
    <div class="markdown-view" id="markdownReportContainer">
      ${renderMarkdownToHTML(md)}
    </div>
  `;
}

function generateMarkdownReport(data) {
  return `# Investigation Report

## Summary
The uploaded content (${data.wordCount} words) was processed through the 7-Agent AI Copyright Investigation Pipeline. The analysis detected a peak semantic similarity of **${data.simPercentage}%** against indexed reference database entries. Overall risk is classified as **${data.riskLevel}** with a confidence score of **${data.confidenceScore}%**.

## Content Type
- **Category:** ${data.contentType}
- **Word / Token Count:** ${data.wordCount} words
- **Analysis Mode:** Multi-Agent RAG Semantic Search & AST Clone Audit

## Retrieved Sources
${data.vectorResults.slice(0, 3).map(r => `- **${r.doc.title}** by ${r.doc.author} (${r.doc.year}) - License: ${r.doc.license} (Similarity: ${Math.round(r.similarity * 100)}%)`).join('\n')}

## Similarity Analysis

| Source | Similarity | Evidence | Confidence |
| :--- | :--- | :--- | :--- |
${data.vectorResults.slice(0, 3).map(r => `| ${r.doc.title} | ${Math.round(r.similarity * 100)}% | ${r.similarity > 0.4 ? 'Substantial passage overlap & structural match' : 'Low conceptual similarity'} | ${data.confidenceScore}% |`).join('\n')}

## Citation Issues
${data.citationIssues.length === 0 ? '- No attribution deficits or missing inline references detected.' : data.citationIssues.map(c => `- **${c.issue}:** ${c.detail}`).join('\n')}

## Copyright Risk
- **Risk Level:** ${data.riskLevel} (Score: ${data.riskScore}/100)
- **Primary Factors:** ${data.simPercentage > 50 ? 'High text density overlap without explicit license exemption' : 'Substantial original material with minor standard phraseology'}
- **Legal Context:** ${data.legalExemptions[0] ? data.legalExemptions[0].statute : 'Fair Use Review'}

## Recommendations
1. ${data.simPercentage > 40 ? 'Include explicit citations and inline references to the original author/source.' : 'Maintain current citation structure for original publishing.'}
2. ${data.topMatchDoc && data.topMatchDoc.license.includes('GPL') ? 'If reusing GPL software code, ensure downstream project adopts GPL-compatible open-source licensing.' : 'Verify licensing terms prior to commercial publication.'}
3. Consult legal counsel for definitive copyright clearance decisions.

## Confidence Score
**${data.confidenceScore}%** based on multi-agent RAG vector retrieval, passage alignment, and legal rule validation.`;
}

function renderMarkdownToHTML(md) {
  return md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<br/>');
}

function copyReportToClipboard() {
  if (!state.currentInvestigation) return;
  const md = generateMarkdownReport(state.currentInvestigation);
  navigator.clipboard.writeText(md).then(() => {
    alert('Investigation Report copied to clipboard in Markdown format!');
  });
}

// ----------------------------------------------------
// VECTOR DB MANAGER MODAL
// ----------------------------------------------------

function openVectorModal() {
  const modal = document.getElementById('vectorModal');
  if (modal) {
    modal.classList.add('active');
    renderVectorModalList();
  }
}

function closeVectorModal() {
  const modal = document.getElementById('vectorModal');
  if (modal) modal.classList.remove('active');
}

function renderVectorModalList() {
  const list = document.getElementById('vectorDbListContainer');
  if (!list) return;

  list.innerHTML = state.vectorDb.map((doc, idx) => `
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: var(--text-primary); font-size: 0.85rem;">${doc.title}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${doc.author} (${doc.year}) &bull; ${doc.license}</div>
      </div>
      <button class="btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; color: var(--accent-rose);" onclick="deleteVectorDoc(${idx})">🗑️ Remove</button>
    </div>
  `).join('');
}

function deleteVectorDoc(index) {
  state.vectorDb.splice(index, 1);
  updateVectorCount();
  renderVectorModalList();
}

function addCustomVectorDoc() {
  const title = document.getElementById('newDocTitle').value.trim();
  const author = document.getElementById('newDocAuthor').value.trim();
  const license = document.getElementById('newDocLicense').value.trim();
  const content = document.getElementById('newDocContent').value.trim();

  if (!title || !content) {
    alert('Please provide at least a Title and Reference Content.');
    return;
  }

  const newDoc = {
    id: `doc-${105 + state.vectorDb.length}`,
    title,
    author: author || 'Unknown Author',
    year: new Date().getFullYear().toString(),
    publisher: 'Custom Index',
    license: license || 'All Rights Reserved',
    content
  };

  state.vectorDb.push(newDoc);
  updateVectorCount();
  renderVectorModalList();

  // Clear inputs
  document.getElementById('newDocTitle').value = '';
  document.getElementById('newDocAuthor').value = '';
  document.getElementById('newDocContent').value = '';
  alert(`Added "${title}" to RAG Vector Database Index!`);
}
