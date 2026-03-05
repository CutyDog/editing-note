# frozen_string_literal: true

create_table :page_views, force: :cascade do |t|
  t.references :user, null: false, foreign_key: true
  t.references :page, null: false, foreign_key: true
  t.datetime :last_viewed_at, null: false

  t.timestamps

  t.index [ :user_id, :page_id ], unique: true
end
