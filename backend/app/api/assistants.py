from typing import Annotated, List, Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import BaseModel, Field

import app.storage as storage
from app.schema import Assistant, AssistantWithoutUserId, OpengptsUserId

router = APIRouter()

FEATURED_PUBLIC_ASSISTANTS = []


class AssistantPayload(BaseModel):
    """Payload for creating an assistant."""

    name: str = Field(..., description="The name of the assistant.")
    config: dict = Field(..., description="The assistant config.")
    public: bool = Field(default=False, description="Whether the assistant is public.")
    description: Optional[str] = Field(
        default="", description="The assistant description."
    )


AssistantID = Annotated[str, Path(description="The ID of the assistant.")]


@router.get("/")
def list_assistants(opengpts_user_id: OpengptsUserId) -> List[AssistantWithoutUserId]:
    """List all assistants for the current user."""
    return storage.list_assistants(opengpts_user_id)


@router.get("/public/")
def list_public_assistants(
    shared_id: Annotated[
        Optional[str], Query(description="ID of a publicly shared assistant.")
    ] = None,
) -> List[AssistantWithoutUserId]:
    """List all public assistants."""
    return storage.list_public_assistants(
        FEATURED_PUBLIC_ASSISTANTS + ([shared_id] if shared_id else [])
    )


@router.get("/{aid}")
def get_asistant(
    opengpts_user_id: OpengptsUserId,
    aid: AssistantID,
) -> Assistant:
    """Get an assistant by ID."""
    assistant = storage.get_assistant(opengpts_user_id, aid)

    if not assistant:
        raise HTTPException(status_code=404, detail="Assistant not found")
    return assistant


@router.get("/{aid}/files")
def get_assistant_files(
    aid: AssistantID,
) -> List[str]:
    """Get all filenames associated with an assistant."""
    files = storage.get_assistant_files(aid)
    return files


@router.delete("/{aid}/files/{filename}")
def delete_assistant_file(
    aid: AssistantID,
    filename: str,
) -> None:
    """Delete a file associated with an assistant."""
    return storage.delete_assistant_file(aid, filename)


@router.post("")
def create_assistant(
    opengpts_user_id: OpengptsUserId,
    payload: AssistantPayload,
) -> Assistant:
    """Create an assistant."""
    return storage.put_assistant(
        opengpts_user_id,
        str(uuid4()),
        name=payload.name,
        config=payload.config,
        public=payload.public,
        description=payload.description,
    )


@router.put("/{aid}")
def upsert_assistant(
    opengpts_user_id: OpengptsUserId,
    aid: AssistantID,
    payload: AssistantPayload,
) -> Assistant:
    """Create or update an assistant."""
    return storage.put_assistant(
        opengpts_user_id,
        aid,
        name=payload.name,
        config=payload.config,
        public=payload.public,
        description=payload.description,
    )


@router.delete("/{aid}")
def delete_assistant(
    opengpts_user_id: OpengptsUserId,
    aid: AssistantID,
) -> None:
    """Delete an assistant."""
    return storage.delete_assistant(opengpts_user_id, aid)
