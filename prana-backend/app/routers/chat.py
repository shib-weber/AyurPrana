from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app.models import ChatMessage, User
from app.core.security import get_current_user

router = APIRouter(prefix="/chat", tags=["Direct Messaging Chat"])

@router.get("/{other_user_id}", response_model=list)
def get_messages(other_user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    messages = db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == current_user.id) & (ChatMessage.receiver_id == other_user_id)) |
        ((ChatMessage.sender_id == other_user_id) & (ChatMessage.receiver_id == current_user.id))
    ).order_by(ChatMessage.timestamp.asc()).all()

    return [
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "message": m.message,
            "timestamp": m.timestamp.strftime("%Y-%m-%d %H:%M")
        }
        for m in messages
    ]

@router.post("/", response_model=dict)
def send_message(msg_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    receiver_id = msg_data.get("receiver_id")
    message_text = msg_data.get("message")

    if not receiver_id or not message_text:
        raise HTTPException(status_code=400, detail="Receiver and message are required")

    new_msg = ChatMessage(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        message=message_text,
        timestamp=datetime.utcnow()
    )
    db.add(new_msg)
    db.commit()
    return {"status": "success", "message": "Message sent"}