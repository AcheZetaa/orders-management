from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional


class OrderStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "InProgress"
    COMPLETED = "Completed"


class OrderCreate(BaseModel):
    order_number: str
    num_products: int = 0
    final_price: Decimal = Decimal("0.00")
    status: OrderStatus = OrderStatus.PENDING


class OrderUpdate(BaseModel):
    order_number: Optional[str] = None
    num_products: Optional[int] = None
    final_price: Optional[Decimal] = None
    status: Optional[OrderStatus] = None


class OrderResponse(BaseModel):
    id: int
    order_number: str
    date: datetime
    num_products: int
    final_price: Decimal
    status: OrderStatus
    is_deleted: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
