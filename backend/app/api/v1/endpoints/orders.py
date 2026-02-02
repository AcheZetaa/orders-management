from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from decimal import Decimal

from app.core.database import get_db
from app.models.order import Order, OrderStatus
from app.models.order_product import OrderProduct
from app.models.product import Product
from app.schemas.order import OrderResponse, OrderCreate, OrderUpdate, OrderDetailResponse, OrderItemResponse
from app.schemas.order_product import OrderProductCreate, OrderProductUpdate

router = APIRouter()


def recalculate_order_totals(order: Order, db: Session):
    items = db.query(OrderProduct).filter(OrderProduct.order_id == order.id).all()
    order.num_products = sum(item.quantity for item in items)
    order.final_price = sum(item.total_price for item in items)
    db.commit()


@router.get("/", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.is_deleted == False).all()
    return orders


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    order = Order(order_number=order_data.order_number)
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}", response_model=OrderDetailResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    items = db.query(OrderProduct).filter(OrderProduct.order_id == order_id).all()
    items_response = []
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        items_response.append(OrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            product_name=product.name if product else "Unknown",
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        ))
    return OrderDetailResponse(
        id=order.id,
        order_number=order.order_number,
        date=order.date,
        num_products=order.num_products,
        final_price=order.final_price,
        status=order.status,
        is_deleted=order.is_deleted,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=items_response
    )


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(order_id: int, order_data: OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == OrderStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot modify completed orders")
    for field, value in order_data.model_dump(exclude_unset=True).items():
        setattr(order, field, value)
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == OrderStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot delete completed orders")
    order.is_deleted = True
    db.commit()
    return None


@router.post("/{order_id}/items", response_model=OrderItemResponse, status_code=201)
def add_item_to_order(order_id: int, item_data: OrderProductCreate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == OrderStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot modify completed orders")
    product = db.query(Product).filter(Product.id == item_data.product_id, Product.is_deleted == False).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    existing = db.query(OrderProduct).filter(
        OrderProduct.order_id == order_id,
        OrderProduct.product_id == item_data.product_id
    ).first()
    if existing:
        existing.quantity += item_data.quantity
        existing.total_price = existing.unit_price * existing.quantity
        db.commit()
        db.refresh(existing)
        recalculate_order_totals(order, db)
        return OrderItemResponse(
            id=existing.id,
            product_id=existing.product_id,
            product_name=product.name,
            quantity=existing.quantity,
            unit_price=existing.unit_price,
            total_price=existing.total_price
        )
    item = OrderProduct(
        order_id=order_id,
        product_id=item_data.product_id,
        quantity=item_data.quantity,
        unit_price=product.unit_price,
        total_price=product.unit_price * item_data.quantity
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    recalculate_order_totals(order, db)
    return OrderItemResponse(
        id=item.id,
        product_id=item.product_id,
        product_name=product.name,
        quantity=item.quantity,
        unit_price=item.unit_price,
        total_price=item.total_price
    )


@router.put("/{order_id}/items/{item_id}", response_model=OrderItemResponse)
def update_item_in_order(order_id: int, item_id: int, item_data: OrderProductUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == OrderStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot modify completed orders")
    item = db.query(OrderProduct).filter(OrderProduct.id == item_id, OrderProduct.order_id == order_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item_data.quantity is not None:
        item.quantity = item_data.quantity
        item.total_price = item.unit_price * item.quantity
    db.commit()
    db.refresh(item)
    recalculate_order_totals(order, db)
    product = db.query(Product).filter(Product.id == item.product_id).first()
    return OrderItemResponse(
        id=item.id,
        product_id=item.product_id,
        product_name=product.name if product else "Unknown",
        quantity=item.quantity,
        unit_price=item.unit_price,
        total_price=item.total_price
    )


@router.delete("/{order_id}/items/{item_id}", status_code=204)
def remove_item_from_order(order_id: int, item_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == OrderStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot modify completed orders")
    item = db.query(OrderProduct).filter(OrderProduct.id == item_id, OrderProduct.order_id == order_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    recalculate_order_totals(order, db)
    return None
