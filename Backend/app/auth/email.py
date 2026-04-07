import os
import random
import smtplib
from email.message import EmailMessage


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def send_otp_email(recipient_email: str, otp: str) -> None:
    sender_email = os.getenv("OTP_SENDER_EMAIL", "medislot.support@gmail.com")
    sender_password = os.getenv("OTP_SENDER_PASSWORD")
    smtp_host = os.getenv("OTP_SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("OTP_SMTP_PORT", "465"))

    if not sender_password:
        raise RuntimeError(
            "OTP_SENDER_PASSWORD is not configured. Add Gmail app password in Backend/.env"
        )

    message = EmailMessage()
    message["Subject"] = "Your MediSlot verification OTP"
    message["From"] = sender_email
    message["To"] = recipient_email
    message.set_content(
        f"Your MediSlot verification OTP is {otp}. It will expire in 10 minutes."
    )

    try:
        if smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port) as smtp:
                smtp.login(sender_email, sender_password)
                smtp.send_message(message)
            return

        with smtplib.SMTP(smtp_host, smtp_port) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(sender_email, sender_password)
            smtp.send_message(message)
    except smtplib.SMTPAuthenticationError as exc:
        raise RuntimeError(
            "Gmail rejected the OTP credentials. Use a valid Gmail App Password for the "
            "medislot.support@gmail.com account, and make sure 2-Step Verification is enabled."
        ) from exc
    except smtplib.SMTPException as exc:
        raise RuntimeError(f"SMTP failed while sending OTP email: {exc}") from exc