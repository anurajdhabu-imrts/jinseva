from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Absolute path to apps/backend/.env so it loads no matter the working directory
# (the npm dev:backend script runs uvicorn from the repo root).
_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    """Application configuration, loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=_ENV_FILE, env_file_encoding="utf-8", extra="ignore"
    )

    env: str = "development"
    port: int = 5000
    cors_origins: str = "http://localhost:3000,http://localhost:3001"

    database_url: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/temple_local_db"
    )

    jwt_secret: str = "dev-only-insecure-secret-change-me"
    jwt_expires_minutes: int = 60 * 24 * 7  # 7 days
    jwt_algorithm: str = "HS256"

    seed_admin_name: str = "Temple Admin"
    seed_admin_email: str = "admin@jinalaya.org"
    seed_admin_password: str = "ChangeMe@123"

    # ── Email (SMTP) ──────────────────────────────────────────────
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""          # full Gmail address
    smtp_password: str = ""      # Gmail App Password (16 chars, not the login password)
    smtp_from_name: str = "Shree Jinalaya"
    smtp_from_email: str = ""    # defaults to smtp_user when empty
    # Public origin used to turn relative "/uploads/..." image paths into
    # absolute URLs inside emails.
    public_api_url: str = "http://localhost:5000"

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_user and self.smtp_password)

    @property
    def mail_from(self) -> str:
        return self.smtp_from_email or self.smtp_user

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_prod(self) -> bool:
        return self.env.lower() in {"production", "prod"}


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
