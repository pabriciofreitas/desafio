import os
from functools import lru_cache
from urllib.parse import urlparse

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
        self.DATABASE_URL = os.getenv("DATABASE_URL")   
        self.DEBUG = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
