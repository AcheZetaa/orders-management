from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional


class ProductCreate(BaseModel):
    name: str
    unit_price: Decimal


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    unit_price: Optional[Decimal] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    unit_price: Decimal
    is_deleted: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
