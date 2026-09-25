from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ChatMessage, User
from app.core.security import get_current_user

router = APIRouter(prefix="/chat", tags=["Direct Chat & Messaging"])

@router.get("/{other_user_id}", response_model=list)
def get_messages(other_user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Fixed: using recipient_id instead of receiver_id
    msgs = db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == current_user.id) & (ChatMessage.recipient_id == other_user_id)) |
        ((ChatMessage.sender_id == other_user_id) & (ChatMessage.recipient_id == current_user.id))
    ).order_by(ChatMessage.timestamp.asc()).all()

    return [
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "recipient_id": m.recipient_id,
            "message": m.message,
            "timestamp": m.timestamp.strftime("%H:%M:%S") if m.timestamp else ""
        }
        for m in msgs
    ]

@router.post("/", response_model=dict)
def send_message(msg_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recipient_id = msg_data.get("recipient_id") or msg_data.get("receiver_id")
    message_text = msg_data.get("message")

    if not recipient_id or not message_text:
        raise HTTPException(status_code=400, detail="Recipient ID and message content are required.")

    new_msg = ChatMessage(
        sender_id=current_user.id,
        recipient_id=recipient_id, # Fixed: using recipient_id
        message=message_text
    )
    db.add(new_msg)
    db.commit()
    
    return {"status": "success", "message": "Message sent successfully."}