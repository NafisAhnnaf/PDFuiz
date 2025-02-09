import os
from langchain_community.document_loaders import TextLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_text_splitters import SentenceTransformersTokenTextSplitter
from langchain.schema.document import Document
from langchain_chroma import Chroma
from get_embedding import get_embedding_func

extracted_file_path = './output/output.txt'
# extracted_file_path = str(find_())

print("creating directory\n")
current_dir = os.path.dirname(os.path.abspath(__file__))
db_dir = os.path.join(current_dir, "db")
persistent_directory = os.path.join(db_dir, "chroma_db")
os.makedirs(persistent_directory, exist_ok=True)
embedding_function = get_embedding_func()

#loading document to memory
def load_docs():
    loader = TextLoader(extracted_file_path)
    return loader.load()

# docs = load_docs()
# print(docs)


#splitting document into chunks
def split_doc(documents: list[Document]):
    text_splitter = SentenceTransformersTokenTextSplitter(
        chunk_size = 1000,
        chunk_overlap = 100,
    )
    return text_splitter.split_documents(documents)

# chunks = split_doc(docs)
# print(chunks[0])


def initialize_chroma():
    """Initialize database only if it doesn't exist"""
    if os.path.exists(persistent_directory) and os.listdir(persistent_directory):
        print("Using existing Chroma database")
        return Chroma(
            persist_directory=persistent_directory,
            embedding_function=embedding_function
        )
    
    print("Creating new Chroma database")

    print("loading docs to memory")
    documents = load_docs()

    print("splitting documents")
    chunks = split_doc(documents)

    return Chroma.from_documents(
        documents=chunks,
        embedding=embedding_function,
        persist_directory=persistent_directory
    )

# Initialize database when module is imported
print("initializing chroma db")
db = initialize_chroma()

if __name__ == "__main__":
    # Optional: Force initialization when run directly
    print("Database initialization check complete")
