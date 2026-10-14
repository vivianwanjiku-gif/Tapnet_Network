"""Backend implementation for payment controller."""

from services.payment_service import create_payment, get_my_payments


def add_payment():
    return create_payment()


def get_payments():
    return get_my_payments()
