import os

from agent_executor.upload import IngestRunnable
from langchain_community.embeddings import AzureOpenAIEmbeddings
from langchain.schema.runnable import ConfigurableField
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores.redis import Redis


index_schema = {
    "tag": [{"name": "namespace"}],
}
vstore = Redis(
    redis_url=os.environ["REDIS_URL"],
    index_name="opengpts",
    embedding=AzureOpenAIEmbeddings(engine=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"]),
    index_schema=index_schema,
)


ingest_runnable = IngestRunnable(
    text_splitter=RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200),
    vectorstore=vstore,
).configurable_fields(
    assistant_id=ConfigurableField(
        id="assistant_id",
        annotation=str,
        name="Assistant ID",
    ),
)
