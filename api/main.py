from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Session, Field, SQLModel, create_engine, select
# from . import models  from . import database
from .models import *
from .database import *
from contextlib import asynccontextmanager


connection_string = str(SECRET_KEY).replace("postgresql", "postgresql+psycopg2")
engine = create_engine(
    connection_string, connect_args={"sslmode": "require"}, pool_recycle=300
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating tables..")
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


def get_session():
    with Session(engine) as session:
        yield session


@app.post("/api/create", response_model=TodoTABLE)
async def create_todo(
    requestt: TodoTABLE, session: Annotated[Session, Depends(get_session)]
):
    # with Session(engine) as session:
    todo =TodoTABLE(
        title=requestt.title,
        description=requestt.description,
        completed=requestt.completed,
    )
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo


@app.get("/api/todo")
async def get_all_todos(session: Annotated[Session, Depends(get_session)]):

    todos_query = session.exec(select(TodoTABLE)).all()
    return todos_query


@app.get("/api/todo/{todo_id}")
async def get_todos_by_id(
    todo_id: int, session: Annotated[Session, Depends(get_session)]
):
    todos = session.exec(select(TodoTABLE).where(TodoTABLE.id == todo_id)).first()
    return todos

    # todos_query = session.get(models.TodoTABLE, todo_id)
    # return todos_query


# @app.get("/done")
# def list_done_todos():
#     with Session() as sess:
#     todos_query = sess.(models.TodoTABLE)
#     done_todos_query = todos_query.filter(models.TodoTABLE.completed == True)
#     return done_todos_query.all()


@app.patch("/api/update/{id}")
async def update_todo(
    id: int,
    update: Todoupdate,
    session: Annotated[Session, Depends(get_session)],
):

    try:
        todo_query = session.get(
            TodoTABLE, id
        )  # whole model class will be equal to id of todo to update

        if not todo_query:
            raise HTTPException(status_code=404, detail="Blog not found")

        if update.title is not None:
            todo_query.title = update.title

        if update.description is not None:
            todo_query.description = update.description

        if update.completed is not None:
            todo_query.completed = update.completed

        session.add(todo_query)
        session.commit()
        session.refresh(todo_query)
        return {"todo updated": id}
    except Exception as e:
        session.rollback()
        return {"error": str(e)}
    finally:
        session.close()


@app.delete("/api/delete/{id}")
async def delete_todo(id: int, session: Annotated[Session, Depends(get_session)]):

    try:
        todo_query = session.get(TodoTABLE, id)
        if not todo_query:
            return {"message": "Todo not found"}

        session.delete(todo_query)
        session.commit()
        return {"todo deleted": id}
    except Exception as e:
        session.rollback()
        return {"error": str(e)}
    finally:
        session.close()
