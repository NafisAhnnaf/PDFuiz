import os
import json
from pdf_to_text import pdf_ocr
from create_vector_db import initialize_chroma
from call_llm import query_rag

# json_file_path = os.path.join("uploads", "user_params.json")
json_file_path = './uploads/user_params.json'

# Read and parse the JSON file
try:
    with open(json_file_path, "r", encoding="utf-8") as file:
        user_params = json.load(file)
        
        # Extract total_question and question_type
        total_question = user_params.get("total_question")
        question_type = user_params.get("question_type")
        
        # Print the extracted values
        # print(f"Total Questions: {total_question}")
        # print(f"Question Type: {question_type}")

except FileNotFoundError:
    print(f"Error: The file {json_file_path} does not exist.")
except json.JSONDecodeError:
    print(f"Error: The file {json_file_path} contains invalid JSON.")
except Exception as e:
    print(f"An error occurred: {e}")

def move_pdfs(source_dir='./uploads', destination_dir='./completed'):
    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)

    # Iterate over all files in the source directory
    for filename in os.listdir(source_dir):
        # Check if the file is a PDF
        if filename.endswith('.pdf'):
            # Construct full file path
            source_file = os.path.join(source_dir, filename)
            destination_file = os.path.join(destination_dir, filename)
            
            # Move the file
            os.replace(source_file, destination_file)
            print(f'Moved: {filename}\n')

    print('The uploads directory has been cleared\n')


def main():
    pdf_ocr()
    initialize_chroma()
    query_rag(total_question, question_type)
    move_pdfs()

if __name__ == "__main__":
    main()
