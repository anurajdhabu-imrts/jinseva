import re

from sqlalchemy import select
from sqlalchemy.orm import Session


def generate_code(
    db: Session, model, column, prefix: str, pad: int = 3, start: int = 1
) -> str:
    """Generate the next human-friendly code for a model, e.g. "EVT-101".

    Looks at the highest existing numeric suffix on `column` for rows whose code
    starts with `prefix` and returns prefix + zero-padded(next). Falls back to
    `start` when the table is empty.
    """
    rows = db.scalars(select(column).where(column.like(f"{prefix}%"))).all()
    highest = start - 1
    pattern = re.compile(rf"^{re.escape(prefix)}(\d+)$")
    for value in rows:
        match = pattern.match(value or "")
        if match:
            highest = max(highest, int(match.group(1)))
    nxt = max(highest + 1, start)
    return f"{prefix}{nxt:0{pad}d}"
