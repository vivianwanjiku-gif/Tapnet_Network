"""Record and list payments belonging to the signed-in user."""

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity

from models.payment import Payment


# Convert a payment model into a JSON-ready response shape.
def payment_to_dict(payment):
    return {
        "id": payment.id,
        "user_id": payment.user_id,
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "transaction_id": payment.transaction_id,
        "status": payment.status,
        "created_at": payment.created_at.isoformat()
    }


# Refuse to record a completed payment without a provider confirmation.
def create_payment():
    return jsonify({
        "message": (
            "Payments are confirmed by Safaricom or IntaSend. "
            "Start one from the website at /api/payments/initiate."
        )
    }), 501


# Return the authenticated user’s payments in newest-first order.
def get_my_payments():
    user_id = get_jwt_identity()

    payments = Payment.query.filter_by(
        user_id=int(user_id)
    ).order_by(
        Payment.created_at.desc()
    ).all()

    return jsonify({
        "payments": [
            payment_to_dict(payment)
            for payment in payments
        ]
    }), 200
