from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.order import Order
from app.schemas.order import OrderResponse, OrderCreate

router = APIRouter()


@router.get("/", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.is_deleted == False).all()
    return orders


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    order = Order(
        order_number=order_data.order_number,
        num_products=order_data.num_products,
        final_price=order_data.final_price,
        status=order_data.status,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.is_deleted = True
    db.commit()
    return None
