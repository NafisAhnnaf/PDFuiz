import os
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from get_embedding import get_embedding_func

from get_embedding import get_embedding_func
from create_vector_db import db

load_dotenv()

template1 = """
Answer the question based only on the following context:

{context}

Generate {total_question} {question_type} based on the text. Follow these rules:
1. Each question must have 4 options
2. Clearly indicate the correct answer
3. Use exactly this JSON format:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "..."
    }}
  ]
}}
4. Output ONLY the JSON without any commentary or formatting marks like ```json
"""

template2 = """
Answer the question based only on the following context:

{context}

Generate {total_question} {question_type} based on the text. Follow these rules:
1. Each question must have 2 options. TRUE and FALSE
2. Clearly indicate the correct answer
3. Use exactly this JSON format:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["...", "..."],
      "answer": "..."
    }}
  ]
}}
4. Output ONLY the JSON without any commentary or formatting marks like ```json
"""


def query_rag(total_question: int, question_type: str):
    
    # Select the appropriate template based on question_type
    if question_type in ["rapidfire", "multiple choice question"]:
        PROMPT_TEMPLATE = template1
    elif question_type == "true-false":
        PROMPT_TEMPLATE = template2
    else:
        raise ValueError(f"Unsupported question type: {question_type}")
    
    # Define a default query text or fetch it programmatically
    query_text = "Only provide the required output"

    # Search the DB for relevant documents
    results = db.similarity_search_with_score(query_text, k=20)

    # Combine the context from the retrieved documents
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])

    # Format the prompt with context, total_question, and question_type
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(
        context=context_text,
        total_question=total_question,
        question_type=question_type
    )

    # Initialize the LLM (Google Gemini)
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.8)

    # Invoke the LLM with the prompt
    response_text = llm.invoke(prompt)

    # Print the response
    # print("Generated Questions and Answers:")
    # print(response_text.content)

    # return response_text

    output_dir = "./output"
    output_file_path = os.path.join(output_dir, "json_file.json")

    response_data = response_text.content

    # Write the data to a JSON file
    with open(output_file_path, "w", encoding="utf-8") as json_file:
        json.dump(response_data, json_file, indent=4)

    print(f"Response data saved to {output_file_path}")

    return response_text

# if __name__ == "__main__":
#     # Define the number of questions and the type of questions to generate
#     total_question = 10  # Change this value as needed
#     question_type = "multiple choice question"  # Change this value as needed

#     # Call the function to generate questions
#     query_rag(total_question, question_type)
