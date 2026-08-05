import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"), override=False)


class Settings:
    def __init__(self) -> None:
        self.DATABASE_URL = os.getenv("DATABASE_URL")
        if not self.DATABASE_URL:
            raise RuntimeError("DATABASE_URL is required and must be configured in environment variables.")

        if self.DATABASE_URL.startswith("postgresql+asyncpg://"):
            pass
        elif self.DATABASE_URL.startswith("postgresql://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

        self.APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
        self.APP_PORT = int(os.getenv("APP_PORT", "8000"))
        self.DEBUG = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
