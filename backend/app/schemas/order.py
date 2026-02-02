from pydantic import BaseModel
from datetime import date
from enum import Enum


class OrderStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "InProgress"
    COMPLETED = "Completed"


class OrderResponse(BaseModel):
    id: int
    order_number: str
    date: date
    num_products: int
    final_price: float
    status: OrderStatus

    class Config:
        from_attributes = True
