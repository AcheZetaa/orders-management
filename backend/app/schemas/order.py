from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional, List


class OrderStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "InProgress"
    COMPLETED = "Completed"


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    order_number: str


class OrderUpdate(BaseModel):
    order_number: Optional[str] = None
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


class OrderDetailResponse(OrderResponse):
    items: List[OrderItemResponse] = []
