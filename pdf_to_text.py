import os
import glob
from google.cloud import documentai_v1 as documentai
from dotenv import load_dotenv
from google.api_core.client_options import ClientOptions

load_dotenv()

#finds the path of pdf file
def find_pdf():
    current_directory = os.getcwd()
    uploads_folder = os.path.join(current_directory, 'uploads')
    pdf_files = glob.glob(os.path.join(uploads_folder, '*.pdf'))
    
    if pdf_files:
        return pdf_files[0]
    else:
        return None

print("Scanning document\n")
def pdf_ocr():
    #project data
    PROJECT_ID = 'test-4b318'
    PROCESSOR_ID = '8b0eef160782ede0'
    FILE_PATH = find_pdf()
    MIME_TYPE = 'application/pdf'
    LOCATION = 'eu'

    if not FILE_PATH:
        print("No PDF file found in the 'uploads' folder.")
        return

    # Instantiates a client
    docai_client = documentai.DocumentProcessorServiceClient(
        client_options=ClientOptions(api_endpoint=f"{LOCATION}-documentai.googleapis.com")
    )

    # The full resource name of the processor, e.g.:
    # projects/project-id/locations/location/processor/processor-id
    # You must create new processors in the Cloud Console first
    RESOURCE_NAME = docai_client.processor_path(PROJECT_ID, LOCATION, PROCESSOR_ID)

    # Read the file into memory
    with open(FILE_PATH, "rb") as image:
        image_content = image.read()

    # Load Binary Data into Document AI RawDocument Object
    raw_document = documentai.RawDocument(content=image_content, mime_type=MIME_TYPE)

    print("Sending api call to documentAI\n")
    # Configure the process request
    request = documentai.ProcessRequest(name=RESOURCE_NAME, raw_document=raw_document)

    # Use the Document AI client to process the sample form
    result = docai_client.process_document(request=request)

    #output to file
    document_object = result.document
    # extracted_text = document_object.text
    output_folder = os.path.join(os.getcwd(), "output")
    output_file_path = os.path.join(output_folder, "output.txt")
    with open(output_file_path, "w", encoding="utf-8") as text_file:
        text_file.write(document_object.text)

    print(f"Extracted text saved to {output_file_path}")

