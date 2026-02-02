from pydantic import BaseModel
from decimal import Decimal
from typing import Optional


class OrderProductCreate(BaseModel):
    product_id: int
    quantity: int


class OrderProductUpdate(BaseModel):
    quantity: Optional[int] = None


class OrderProductResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    class Config:
        from_attributes = True
