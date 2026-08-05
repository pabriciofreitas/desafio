import os
import asyncio
import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def main():
    url = os.getenv('DATABASE_URL')
    print('DATABASE_URL set?', bool(url))
    conn = await asyncpg.connect(url)
    print('OK')
    await conn.close()

asyncio.run(main())
