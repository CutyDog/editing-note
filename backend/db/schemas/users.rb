create_table "users", force: :cascade do |t|
  t.string "email", null: false
  t.string "password_digest", null: false

  t.timestamps

  t.index [ "email" ], unique: true
end
