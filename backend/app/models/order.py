from sqlalchemy import Column, Integer, String, Date, Float, Enum
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
    date = Column(Date, nullable=False)
    num_products = Column(Integer, default=0)
    final_price = Column(Float, default=0.0)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
