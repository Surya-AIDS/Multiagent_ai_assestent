import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    
    # Set slide dimensions to 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Blank layout
    blank_layout = prs.slide_layouts[6]
    
    # Colors
    BG_COLOR = RGBColor(11, 15, 25)         # #0B0F19 Dark
    CARD_COLOR = RGBColor(17, 24, 39)       # #111827 Dark Navy Card
    TEXT_MAIN = RGBColor(249, 250, 251)     # #F9FAFB White
    TEXT_SUB = RGBColor(156, 163, 175)      # #9CA3AF Muted Gray
    ACCENT_PURPLE = RGBColor(139, 92, 246)  # #8B5CF6 Purple
    ACCENT_INDIGO = RGBColor(99, 102, 241)  # #6366F1 Indigo
    ACCENT_CYAN = RGBColor(6, 182, 212)     # #06B6D4 Cyan
    ACCENT_EMERALD = RGBColor(16, 185, 129) # #10B981 Emerald Green
    ACCENT_AMBER = RGBColor(245, 158, 11)   # #F59E0B Amber
    ACCENT_ROSE = RGBColor(239, 68, 68)     # #EF4444 Rose Red
    
    def set_slide_background(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = BG_COLOR
        
    def add_header(slide, tag_text, title_text):
        # Top Tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ACCENT_CYAN
        p_tag.font.name = "Calibri"
        
        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_MAIN
        p_title.font.name = "Calibri"

    def add_card(slide, left, top, width, height, title, body_bullets, accent_color=ACCENT_INDIGO):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = CARD_COLOR
        shape.line.color.rgb = accent_color
        shape.line.width = Pt(1.5)
        
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.2)
        tf.margin_bottom = Inches(0.2)
        
        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(16)
        p_title.font.bold = True
        p_title.font.color.rgb = ACCENT_CYAN
        p_title.font.name = "Calibri"
        
        for item in body_bullets:
            p = tf.add_paragraph()
            p.text = f"• {item}"
            p.font.size = Pt(12)
            p.font.color.rgb = TEXT_SUB
            p.font.name = "Calibri"
            p.space_before = Pt(4)

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1)
    
    # Title Box
    t_box = slide1.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(11.3), Inches(3.0))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "Multi-Agent AI Copyright\nInvestigation Assistant"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_MAIN
    p1.alignment = PP_ALIGN.CENTER
    
    p2 = tf1.add_paragraph()
    p2.text = "LangChain RAG Architecture • 7 Collaborative AI Agents • Evidence-Based Risk Reports"
    p2.font.size = Pt(18)
    p2.font.color.rgb = ACCENT_PURPLE
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(16)

    # -------------------------------------------------------------
    # SLIDE 2: Executive Summary & Objective
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "Executive Summary", "Mission & Core Objective")
    
    add_card(slide2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0), 
             "🎯 Core Objective", 
             ["Identify potential copyright infringement across text, code, images, and documents.",
              "Provide objective, evidence-based similarity reports with quantifiable confidence scores.",
              "Empower legal teams, creators, researchers, and enterprises with explainable AI audits.",
              "Utilize RAG vector search to eliminate hallucinations and ground all findings in evidence."])
              
    add_card(slide2, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0), 
             "⚖️ Non-Legal Authority Principle", 
             ["Operates strictly as an evidence gathering and investigation assistant.",
              "Does NOT issue final legal determinations or binding judgments.",
              "Provides factual passage alignment, source attribution, and statutory context.",
              "Always encourages users to consult professional legal counsel for final clearance."])

    # -------------------------------------------------------------
    # SLIDE 3: Multi-Agent Architecture Overview
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "Architecture", "7 Collaborative Autonomous Agents")
    
    agents = [
        ("1. Content Agent", ["Extracts entities & metadata", "Detects document vs code", "Generates semantic summaries"]),
        ("2. Retrieval Agent (RAG)", ["Queries vector database index", "Retrieves reference literature", "Calculates top-K cosine matches"]),
        ("3. Similarity Agent", ["Detects verbatim passage copy", "Identifies reworded paraphrases", "Audits AST code clone structures"]),
        ("4. Citation Agent", ["Checks inline attribution", "Identifies missing citations", "Audits DOIs, URLs & references"]),
        ("5. Legal Agent", ["Evaluates Fair Use 4 factors", "Applies CC & GPL copyleft rules", "Identifies public domain status"]),
        ("6 & 7. Risk & Report", ["Calculates 0-100 Risk Index", "Classifies risk (Very Low-Critical)", "Generates structured Markdown report"])
    ]
    
    col_w, row_h = Inches(3.7), Inches(2.3)
    coords = [(0.8, 1.7), (4.8, 1.7), (8.8, 1.7), (0.8, 4.4), (4.8, 4.4), (8.8, 4.4)]
    
    for idx, (title, items) in enumerate(agents):
        x, y = coords[idx]
        add_card(slide3, Inches(x), Inches(y), col_w, row_h, title, items)

    # -------------------------------------------------------------
    # SLIDE 4: RAG Investigation Workflow
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "Workflow", "8-Step RAG Processing Pipeline")
    
    add_card(slide4, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0),
             "🔄 End-to-End Execution Sequence",
             ["Step 1: Document Upload & Multi-Format Parsing (Text, Code, PDF, Markdown)",
              "Step 2: Vector Embedding Generation & Keyword Tokenization",
              "Step 3: RAG Semantic Vector DB Search (Top-K Similarity Retrieval)",
              "Step 4: Deep Passage & Code AST Alignment Comparison",
              "Step 5: Automated Citation Audit & Attribution Deficit Detection",
              "Step 6: Statutory Legal Mapping (17 U.S.C. § 107 Fair Use Audit)",
              "Step 7: Quantitative Risk Assessment (0-100 Gauge Score)",
              "Step 8: Structured Markdown Report Generation & PDF Exporter"])

    # -------------------------------------------------------------
    # SLIDE 5: Preset Case Studies Benchmark
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, "Case Studies", "Preset Demonstration Benchmark Results")
    
    cases = [
        ("Case 1: Paraphrased Article", ["Similarity: 78%", "Risk: HIGH (78/100)", "Issue: Reworded quantum text without attribution"]),
        ("Case 2: GPL Code Clone", ["Similarity: 94%", "Risk: HIGH (84/100)", "Issue: GPL-3.0 algorithm cloned without license"]),
        ("Case 3: Uncited Academic Draft", ["Similarity: 68%", "Risk: MEDIUM (52/100)", "Issue: Microservice definition copied verbatim"]),
        ("Case 4: Original Synthesis", ["Similarity: 12%", "Risk: VERY LOW (15/100)", "Issue: Original research paper cleared"])
    ]
    
    for idx, (title, items) in enumerate(cases):
        x = 0.8 + idx * 3.0
        add_card(slide5, Inches(x), Inches(1.8), Inches(2.7), Inches(4.8), title, items)

    # -------------------------------------------------------------
    # SLIDE 6: 5-Tier Infringement Risk Matrix
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, "Risk Assessment", "5-Tier Infringement Classification Matrix")
    
    add_card(slide6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "🛡️ Risk Rating Levels",
             ["Very Low Risk (0-20%): Original creation, standard domain knowledge",
              "Low Risk (21-40%): Quotations with proper citation & attribution",
              "Medium Risk (41-60%): Uncited quotes or minor attribution deficits",
              "High Risk (61-80%): Heavy paraphrasing or uncredited copyleft code",
              "Critical Risk (81-100%): Direct verbatim wholesale duplication"],
             ACCENT_AMBER)
             
    add_card(slide6, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "⚖️ Statutory Legal Audit Parameters",
             ["Purpose & Character of Use (Commercial vs Educational/Transformative)",
              "Nature of the Copyrighted Work (Factual vs Creative/Expressive)",
              "Amount & Substantiality Taken (Heart of the work audit)",
              "Market Effect (Potential economic substitution impact)"],
             ACCENT_CYAN)

    # -------------------------------------------------------------
    # SLIDE 7: Technical Detection Algorithms
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_header(slide7, "Engine Details", "Core Technical Detection Algorithms")
    
    add_card(slide7, Inches(0.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "📖 Text Paraphrase Engine",
             ["Cosine similarity on word frequency vectors",
              "Sliding window passage alignment",
              "Synonym replacement mapping",
              "Sentence-level semantic density analysis"])
              
    add_card(slide7, Inches(4.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "💻 Code Clone AST Engine",
             ["Abstract Syntax Tree (AST) tokenization",
              "Variable renaming normalization",
              "Control flow & loop depth comparison",
              "Copyleft license infection checker"])

    add_card(slide7, Inches(8.8), Inches(1.8), Inches(3.7), Inches(5.0),
             "🖼️ Image & Vector Search",
             ["Client-side TF-IDF & dense embeddings",
              "Indexed vector database retrieval",
              "Average hash & dHash perceptual hashing",
              "Canvas pixel feature matching"])

    # -------------------------------------------------------------
    # SLIDE 8: Web Application Platform
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_header(slide8, "Platform UI", "Production Web Workspace Features")
    
    add_card(slide8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "💻 Interactive User Interface",
             ["Drag-and-drop file upload zone (.txt, .md, .py, .js, .java, .cpp)",
              "Real-time 7-agent execution node visualizer",
              "Interactive circular risk gauge meter with confidence score",
              "Side-by-side passage diff viewer (Red exact / Yellow paraphrased)",
              "RAG Vector Database Manager modal to add custom reference sources"])
              
    add_card(slide8, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "📄 Standardized Output Reports",
             ["Formatted Markdown investigation reports",
              "Evidence tables with similarity percentages & confidence metrics",
              "Citation deficit breakdown & statutory Fair Use advice",
              "One-click copy to clipboard & instant PDF export capabilities"])

    # -------------------------------------------------------------
    # SLIDE 9: Standard Investigation Report Structure
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_header(slide9, "Reporting", "Structured Report Schema")
    
    add_card(slide9, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0),
             "📄 Required Investigation Report Schema",
             ["# Investigation Report",
              "## Summary (Overview of findings, word count & risk index)",
              "## Content Type (Category & Token count)",
              "## Retrieved Sources (Top RAG matches & licensing metadata)",
              "## Similarity Analysis (Source | Similarity | Evidence | Confidence Table)",
              "## Citation Issues (Attribution deficit audit)",
              "## Copyright Risk (Risk Level Rationale & 17 U.S.C. § 107 Statutory Context)",
              "## Recommendations (Actionable legal & attribution steps)",
              "## Confidence Score (Overall system confidence percentage)"])

    # -------------------------------------------------------------
    # SLIDE 10: Conclusion & Roadmap
    # -------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10)
    add_header(slide10, "Conclusion", "Value Proposition & Future Roadmap")
    
    add_card(slide10, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "🚀 Key Value & Benefits",
             ["Accelerates copyright audit workflows for legal & research teams.",
              "Provides objective, explainable evidence rather than black-box scores.",
              "Grounds all findings in RAG vector database evidence to eliminate hallucinations.",
              "Completely transparent, client-side execution preserving user privacy."])

    add_card(slide10, Inches(6.8), Inches(1.8), Inches(5.6), Inches(5.0),
             "🔮 Future Enhancement Roadmap",
             ["Deep neural vector embeddings via ONNX Runtime in browser.",
              "Automated DMCA takedown notice drafting assistant.",
              "Multi-modal audio spectrogram similarity comparison.",
              "Enterprise API integration with GitHub PR copyright checks."])

    output_path = "c:\\Users\\Sureshmohan\\Desktop\\Copyrights\\Copyright_Investigation_Assistant_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
