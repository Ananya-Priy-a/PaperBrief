def build_prompt(context_chunks, question, mode, level):

    context_text = "\n\n".join(
        [f"(Page {c['metadata']['page']} | {c['metadata']['section']})\n{c['text']}"
         for c in context_chunks]
    )

    base_instruction = """
You are a strict research assistant.
Use ONLY the provided context.
If answer not found, respond exactly: "Not available in document."
Cite page numbers.
Return structured JSON only.
Ensure every field in the JSON is filled if information exists in context.
"""

    # LEVEL LOGIC
    level_lower = level.lower()
    if level_lower in ["10 year old", "child", "beginner"]:
        level_instruction = """
Explain in very simple words.
Avoid technical terms.
Use short sentences.
Use analogies.
Make it easy enough for a 10 year old.
For key concepts, provide a simple explanation for each term in full sentences.
"""
    elif level_lower in ["college student", "undergraduate", "student"]:
        level_instruction = """
Explain clearly with moderate technical depth.
Define important terms.
Keep it academically accurate.
Assume basic background knowledge.
For key concepts, list each term with a clear explanation in complete sentences.
Do not leave any explanations blank.
"""
    elif level_lower in ["researcher", "expert", "phd"]:
        level_instruction = """
Explain with full technical depth.
Use formal academic language.
Include equations if present.
Discuss assumptions and limitations.
Be precise and rigorous.
For key concepts, provide detailed explanations, examples, and references to pages.
"""
    else:
        level_instruction = "Explain clearly and appropriately. Provide explanations for all key concepts."

    # Mode logic
    if mode == "equation":
        task = "Explain equations step by step with variable meanings."
    elif mode == "analysis":
        task = "Provide detailed paper analysis including strengths and weaknesses."
    else:
        task = "Answer normally with structured explanation."

    return f"""
{base_instruction}

LEVEL INSTRUCTION:
{level_instruction}

TASK:
{task}

CONTEXT:
{context_text}

QUESTION:
{question}

Return JSON with:
{{
  "main_idea": "",
  "key_concepts": [{{"concept": "", "explanation": ""}}],
  "equations_explained": "",
  "real_world_example": "",
  "simple_summary": ""
}}
"""
