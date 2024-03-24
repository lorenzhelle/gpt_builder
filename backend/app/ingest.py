"""Code to ingest blob into a vectorstore.

Code is responsible for taking binary data, parsing it and then indexing it
into a vector store.

This code should be agnostic to how the blob got generated; i.e., it does not
know about server/uploading etc.
"""

from typing import List

from app import storage
from langchain.text_splitter import TextSplitter
from langchain_community.document_loaders import Blob
from langchain_community.document_loaders.base import BaseBlobParser
from langchain_core.documents import Document
from langchain_core.vectorstores import VectorStore


def _update_document_metadata(
    document: Document, namespace: str, filename: str
) -> None:
    """Mutation in place that adds a namespace to the document metadata."""
    document.metadata["namespace"] = namespace
    document.metadata["filename"] = filename


def _save_doc_id_to_assistant(doc_id: str, assistant_id: str) -> None:
    """Save the doc ID to the assistant."""
    storage.put_doc_id_to_assistant(doc_id, assistant_id)


# PUBLIC API


def ingest_blob(
    blob: Blob,
    parser: BaseBlobParser,
    text_splitter: TextSplitter,
    vectorstore: VectorStore,
    namespace: str,
    filename: str = "unknown",
    *,
    batch_size: int = 100,
) -> List[str]:
    """Ingest a document into the vectorstore."""
    docs_to_index = []
    ids = []
    for document in parser.lazy_parse(blob):
        docs = text_splitter.split_documents([document])
        for doc in docs:
            _update_document_metadata(doc, namespace, filename=filename)
        docs_to_index.extend(docs)

        if len(docs_to_index) >= batch_size:
            ids.extend(vectorstore.add_documents(docs_to_index))
            docs_to_index = []

    if docs_to_index:
        ids.extend(vectorstore.add_documents(docs_to_index))

    # save the doc ids to the assistant
    for doc_id in ids:
        _save_doc_id_to_assistant(doc_id, namespace)

    return ids
