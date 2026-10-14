"""Payment routes.

Live M-Pesa STK Push and Airtel Money (IntaSend) run in the website API
under /api/payments. This Flask blueprint no longer marks a payment complete
on its own.
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.payment_controller import add_payment, get_payments

payments_bp = Blueprint("payments", __name__)


@payments_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    return add_payment()


@payments_bp.route("/", methods=["GET"])
@jwt_required()
def my_payments():
    return get_payments()
