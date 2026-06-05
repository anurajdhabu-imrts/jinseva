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
