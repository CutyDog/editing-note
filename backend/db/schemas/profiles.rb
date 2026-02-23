create_table "profiles", force: :cascade do |t|
  t.references "user", null: false, foreign_key: true, index: { unique: true }

  t.string "name", null: false

  t.timestamps
end
