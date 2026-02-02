from datetime import date
from app.core.database import SessionLocal, engine, Base
from app.models.order import Order, OrderStatus

Base.metadata.create_all(bind=engine)

def seed_orders():
    db = SessionLocal()
    
    orders_data = [
        {
            "order_number": "ORD-001",
            "date": date(2026, 2, 1),
            "num_products": 3,
            "final_price": 150.50,
            "status": OrderStatus.PENDING
        },
        {
            "order_number": "ORD-002",
            "date": date(2026, 2, 2),
            "num_products": 5,
            "final_price": 299.99,
            "status": OrderStatus.IN_PROGRESS
        },
        {
            "order_number": "ORD-003",
            "date": date(2026, 1, 28),
            "num_products": 2,
            "final_price": 89.00,
            "status": OrderStatus.COMPLETED
        },
        {
            "order_number": "ORD-004",
            "date": date(2026, 2, 2),
            "num_products": 1,
            "final_price": 49.99,
            "status": OrderStatus.PENDING
        },
    ]
    
    try:
        existing = db.query(Order).count()
        if existing > 0:
            print(f"Database already has {existing} orders. Skipping seed.")
            return
        
        for order_data in orders_data:
            order = Order(**order_data)
            db.add(order)
        
        db.commit()
        print(f"Successfully added {len(orders_data)} orders!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_orders()
