"""Email delivery via SMTP (Gmail-friendly).

Configure SMTP_* in the backend .env. SMTP_PASSWORD must be a Gmail
*App Password* (not the account login password).
"""

from __future__ import annotations

import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr

from app.core.config import settings


class EmailNotConfigured(RuntimeError):
    pass


def _build_message(to: str, subject: str, html: str, text: str | None) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((settings.smtp_from_name, settings.mail_from))
    msg["To"] = to
    msg.set_content(text or "Please open this email in an HTML-capable client.")
    msg.add_alternative(html, subtype="html")
    return msg


def _connect() -> smtplib.SMTP:
    if not settings.email_enabled:
        raise EmailNotConfigured(
            "Email is not configured. Set SMTP_USER and SMTP_PASSWORD in apps/backend/.env."
        )
    context = ssl.create_default_context()
    server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20)
    server.ehlo()
    server.starttls(context=context)
    server.ehlo()
    # Gmail app passwords are shown with spaces; SMTP wants them stripped.
    server.login(settings.smtp_user, settings.smtp_password.replace(" ", ""))
    return server


def send_email(to: str, subject: str, html: str, text: str | None = None) -> None:
    """Send a single email. Raises on failure."""
    with _connect() as server:
        server.send_message(_build_message(to, subject, html, text))


def send_bulk(
    recipients: list[str], subject: str, html: str, text: str | None = None
) -> tuple[int, list[str]]:
    """Send the same email to many recipients over one connection.

    Returns (sent_count, errors). Each recipient gets an individual message so
    addresses are never exposed to one another.
    """
    if not recipients:
        return 0, []
    sent = 0
    errors: list[str] = []
    with _connect() as server:
        for addr in recipients:
            try:
                server.send_message(_build_message(addr, subject, html, text))
                sent += 1
            except Exception as exc:  # noqa: BLE001 — collect & continue
                errors.append(f"{addr}: {exc}")
    return sent, errors


def receipt_html(d: dict) -> str:
    """Marathi देणगी पावती (donation receipt) email body. `d` is Donation.to_dict()."""
    donor = "अनामिक देणगीदार" if d.get("anonymous") else d.get("donor", "")
    rows = [
        ("पावती क्र.", d.get("receipt", "")),
        ("दिनांक", d.get("date", "")),
        ("ध. श्री. / सौ.", donor),
        ("देणगी प्रकार", d.get("type", "")),
        ("देयक पद्धत", d.get("method", "")),
    ]
    row_html = "".join(
        f'<tr><td style="padding:6px 0;color:#888;">{k}</td>'
        f'<td style="padding:6px 0;text-align:right;font-weight:600;">{v}</td></tr>'
        for k, v in rows
    )
    amount = f"₹ {int(d.get('amount', 0)):,}"
    return f"""\
<!doctype html>
<html>
  <body style="margin:0;background:#fffaf0;font-family:'Noto Sans',Arial,Helvetica,sans-serif;color:#1a1b22;">
    <div style="max-width:600px;margin:0 auto;padding:14px;background:#c8102e;">
      <div style="border:2px solid #c8102e;background:#fffaf0;padding:22px;">
        <div style="text-align:center;">
          <div style="font-size:24px;font-weight:bold;color:#a90e26;">समस्त दिगंबर जैन समाज, मांगूर</div>
          <div style="font-size:13px;color:#016b34;font-weight:bold;">ता. निपाणी, &nbsp; जि. बेळगाव</div>
          <div style="display:inline-block;margin-top:8px;padding:3px 18px;border-radius:999px;background:#016b34;color:#fff;font-weight:bold;">देणगी पावती</div>
        </div>
        <div style="text-align:center;margin:18px 0;">
          <div style="font-size:12px;color:#a85f02;">देणगी रक्कम</div>
          <div style="font-size:38px;font-weight:bold;color:#c8102e;">{amount}</div>
        </div>
        <table style="width:100%;font-size:14px;border-collapse:collapse;">{row_html}</table>
        <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
        <p style="font-size:13px;">इतकी रक्कम आपणाकडून मिळाली.</p>
        <p style="text-align:right;font-size:22px;font-weight:bold;color:#c8102e;margin:4px 0;">धन्यवाद!</p>
        <p style="font-size:11px;color:#888;">ही पावती संगणकाद्वारे तयार केली आहे. — श्री जिनालय</p>
      </div>
    </div>
  </body>
</html>"""


def announcement_html(title: str, message: str, image_url: str = "") -> str:
    """A simple branded HTML body for announcement emails."""
    safe_msg = (message or "").replace("\n", "<br/>")
    img_block = (
        f'<img src="{image_url}" alt="" '
        f'style="width:100%;max-width:600px;border-radius:12px;margin:16px 0;" />'
        if image_url
        else ""
    )
    return f"""\
<!doctype html>
<html>
  <body style="margin:0;background:#f3ede2;font-family:Arial,Helvetica,sans-serif;color:#1a1b22;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#c8102e;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0;">
        <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.85;">Shree Jinalaya</div>
        <div style="font-size:20px;font-weight:bold;margin-top:4px;">{title}</div>
      </div>
      <div style="background:#ffffff;padding:20px;border-radius:0 0 12px 12px;">
        {img_block}
        <p style="font-size:15px;line-height:1.6;">{safe_msg}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="font-size:12px;color:#888;">Jai Jinendra 🙏 — sent from the Shree Jinalaya temple management system.</p>
      </div>
    </div>
  </body>
</html>"""
