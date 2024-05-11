from starlette.config import Config
from starlette.datastructures import Secret


try:
    config = Config(".env")
except FileNotFoundError:
    print("Path of the file is not found")
    config = Config("")  # Define config with an empty Config object if file not found

SECRET_KEY = config("DATABASE_URL", cast=Secret)
