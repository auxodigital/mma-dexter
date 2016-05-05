"""document word count

Revision ID: 3ac1923eb5b3
Revises: 41b4133d687e
Create Date: 2016-05-05 10:53:34.837605

"""

# revision identifiers, used by Alembic.
revision = '3ac1923eb5b3'
down_revision = '41b4133d687e'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('documents', sa.Column('word_count', sa.Integer(), nullable=True))
    op.execute("""UPDATE documents
    SET word_count =
      char_length(trim(replace(replace(replace(replace(text, "\\t", " "), "\\n", " "), "  ", " "), "  ", " "))) -
      char_length(replace(trim(replace(replace(replace(replace(text, "\\t", " "), "\\n", " "), "  ", " "), "  ", " ")), " ", "")) + 1
    WHERE 
      word_count IS NULL
      AND text IS NOT NULL
      AND char_length(trim(replace(replace(replace(replace(text, "\\t", " "), "\\n", " "), "  ", " "), "  ", " "))) > 0
    """)

    op.execute("""UPDATE documents
    SET word_count = 0
    WHERE word_count IS NULL AND text IS NOT NULL
    """)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('documents', 'word_count')
    ### end Alembic commands ###
