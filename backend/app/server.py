from pathlib import Path
from fastapi.responses import HTMLResponse

import orjson
from fastapi import FastAPI, Form, HTTPException, Request, UploadFile
from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware


from app.api import router as api_router
from app.upload import ingest_runnable

app = FastAPI(title="KirchnerRobertGPTs API")

origins = [
    "http://localhost:5173",
    "https://mango-mud-046feb603.4.azurestaticapps.net",
]

# Load environment variables from .env file
# load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get root of app, used to point to directory containing static files
ROOT = Path(__file__).parent.parent


app.include_router(api_router)


@app.post("/ingest", description="Upload files to the given assistant.")
def ingest_files(files: list[UploadFile], config: str = Form(...)) -> None:
    """Ingest a list of files."""
    config = orjson.loads(config)
    return ingest_runnable.batch([file.file for file in files], config)


app.mount("", StaticFiles(directory=str(ROOT / "ui"), html=True), name="ui")


@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc: HTTPException):
    # serve index.html for all 404s see https://stackoverflow.com/questions/76527355/fastapi-catch-all-route-put-after-root-route-mount-doesnt-get-hit
    return HTMLResponse(
        Path(str(ROOT / "ui" / "index.html")).read_text(), status_code=200
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8100)
