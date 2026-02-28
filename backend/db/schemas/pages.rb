create_table "pages", force: :cascade do |t|
  t.references "user", null: false, foreign_key: true
  t.references "parent", foreign_key: { to_table: :pages, column: :parent_id }

  t.string "title"
  t.jsonb "content", default: []
  t.integer "position", default: 0

  t.timestamps
end
