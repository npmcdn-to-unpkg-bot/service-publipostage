#
# Create three tables, the books table, the authors table, and the authors_books table.
#
#require_relative "../database.rb"
class CreatePublipostageTable < Sequel::Migration

    # For the up we want to create the three tables.
    def up
        # Create the books table with a primary key and a title.
        DB.create_table(:publipostage) do
            primary_key :id
            String :descriptif, :unique=>true
            String :destinataires
            String :user_id
        end
    end

    # For the down we want to remove the three tables.
    def down
        DB.drop_table(:publipostage)
        DB.drop_table(:authors)
    end
end
