from sqlalchemy import Column, Integer, String, DateTime, Numeric, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "Pending"
    IN_PROGRESS = "InProgress"
    COMPLETED = "Completed"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_number = Column(String(50), nullable=False)
    date = Column(DateTime, nullable=False, default=func.now())
    num_products = Column(Integer, default=0)
    final_price = Column(Numeric(10, 2), default=0.00)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    items = relationship("OrderProduct", back_populates="order", cascade="all, delete-orphan")
