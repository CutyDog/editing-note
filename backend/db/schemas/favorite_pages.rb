create_table "favorite_pages", force: :cascade do |t|
  t.references "user", null: false, foreign_key: true
  t.references "page", null: false, foreign_key: true

  t.timestamps

  t.index %w[user_id page_id], unique: true
end
