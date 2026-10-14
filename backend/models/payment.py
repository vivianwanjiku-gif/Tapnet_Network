"""Define payment records and their relationship to user accounts."""

from datetime import datetime

from extensions import db


# Represent a payment made by a user.
class Payment(db.Model):
    __tablename__ = "payments"

    # Primary key used to identify this row.
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # Foreign key linking this record to its account owner.
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Amount received for this payment.
    amount = db.Column(
        db.Float,
        nullable=False
    )

    # Payment channel used for this transaction.
    # Values: mpesa | airtel
    payment_method = db.Column(
        db.String(50),
        nullable=False
    )

    # Unique external or internal payment reference.
    transaction_id = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    # Current lifecycle state of this record.
    # Values: pending | successful | failed | cancelled | refunded
    status = db.Column(
        db.String(20),
        nullable=False,
        default="pending"
    )

    # ---- New fields for gateway integration ----

    # Provider-side reference:
    #   M-Pesa -> CheckoutRequestID
    #   Airtel Money via IntaSend -> invoice id
    provider_ref = db.Column(
        db.String(200),
        nullable=True
    )

    # Kept so existing databases still match this model.
    checkout_url = db.Column(
        db.Text,
        nullable=True
    )

    # Payer phone for mobile-money methods.
    phone = db.Column(
        db.String(20),
        nullable=True
    )

    # Package being purchased (nullable for manual records).
    package_id = db.Column(
        db.Integer,
        db.ForeignKey("packages.id"),
        nullable=True
    )

    # Subscription created after successful payment.
    subscription_id = db.Column(
        db.Integer,
        db.ForeignKey("subscriptions.id"),
        nullable=True
    )

    # When the payment reached a terminal state.
    completed_at = db.Column(
        db.DateTime,
        nullable=True
    )

    # Once True, the record must never change again.
    is_locked = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    # Resolve the account that owns this payment through user_id.
    user = db.relationship(
        "User",
        backref=db.backref(
            "payments",
            lazy=True
        )
    )

    # Provide a concise identifier when this model instance is displayed.
    def __repr__(self):
        return f"<Payment {self.transaction_id}>"
