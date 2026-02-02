from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.order import Order
from app.schemas.order import OrderResponse

router = APIRouter()


@router.get("/", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    return orders
