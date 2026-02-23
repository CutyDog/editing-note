create_table "refresh_tokens", force: :cascade do |t|
  t.references "user", null: false, foreign_key: true

  t.string "token", null: false
  t.datetime "expires_at", null: false
  t.datetime "revoked_at"

  t.timestamps

  t.index [ "token" ], unique: true
  t.index [ "user_id", "revoked_at" ]
end
