import os
from functools import lru_cache

from dotenv import load_dotenv

dotenv_paths = [
    os.path.join(os.path.dirname(__file__), "..", ".env"),
    os.path.join(os.path.dirname(__file__), "..", "..", ".env"),
    os.path.join(os.getcwd(), ".env"),
]
for path in dotenv_paths:
    if os.path.exists(path):
        load_dotenv(dotenv_path=path, override=False)
        break


class Settings:
    def __init__(self) -> None:
        self.DB_HOST = os.getenv("DB_HOST", "localhost")
        self.DB_PORT = int(os.getenv("DB_PORT", "5432"))
        self.DB_NAME = os.getenv("DB_NAME", "motoca_backoffice_db")
        self.DB_USER = os.getenv("DB_USER", "postgres")
        self.DB_PASSWORD = os.getenv("DB_PASSWORD", "admin")

        self.APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
        self.APP_PORT = int(os.getenv("APP_PORT", "8000"))
        self.DEBUG = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
