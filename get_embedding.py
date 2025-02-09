from langchain_google_vertexai import VertexAIEmbeddings
from langchain_chroma import Chroma
import google_crc32c
from dotenv import load_dotenv

load_dotenv()

def get_embedding_func():
    embeddings = VertexAIEmbeddings(model_name="text-embedding-004")
    return embeddings
