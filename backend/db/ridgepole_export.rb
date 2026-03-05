# -*- mode: ruby -*-
# vi: set ft=ruby :
create_table "favorite_pages", force: :cascade do |t|
  t.datetime "created_at", null: false
  t.bigint "page_id", null: false
  t.datetime "updated_at", null: false
  t.bigint "user_id", null: false
  t.index ["page_id"], name: "index_favorite_pages_on_page_id"
  t.index ["user_id", "page_id"], name: "index_favorite_pages_on_user_id_and_page_id", unique: true
  t.index ["user_id"], name: "index_favorite_pages_on_user_id"
end

create_table "page_views", force: :cascade do |t|
  t.datetime "created_at", null: false
  t.datetime "last_viewed_at", null: false
  t.bigint "page_id", null: false
  t.datetime "updated_at", null: false
  t.bigint "user_id", null: false
  t.index ["page_id"], name: "index_page_views_on_page_id"
  t.index ["user_id", "page_id"], name: "index_page_views_on_user_id_and_page_id", unique: true
  t.index ["user_id"], name: "index_page_views_on_user_id"
end

create_table "pages", force: :cascade do |t|
  t.jsonb "content", default: []
  t.datetime "created_at", null: false
  t.bigint "parent_id"
  t.integer "position", default: 0
  t.string "title"
  t.datetime "updated_at", null: false
  t.bigint "user_id", null: false
  t.index ["parent_id"], name: "index_pages_on_parent_id"
  t.index ["user_id"], name: "index_pages_on_user_id"
end

create_table "profiles", force: :cascade do |t|
  t.datetime "created_at", null: false
  t.string "name", null: false
  t.datetime "updated_at", null: false
  t.bigint "user_id", null: false
  t.index ["user_id"], name: "index_profiles_on_user_id", unique: true
end

create_table "refresh_tokens", force: :cascade do |t|
  t.datetime "created_at", null: false
  t.datetime "expires_at", null: false
  t.datetime "revoked_at"
  t.string "token", null: false
  t.datetime "updated_at", null: false
  t.bigint "user_id", null: false
  t.index ["token"], name: "index_refresh_tokens_on_token", unique: true
  t.index ["user_id", "revoked_at"], name: "index_refresh_tokens_on_user_id_and_revoked_at"
  t.index ["user_id"], name: "index_refresh_tokens_on_user_id"
end

create_table "users", force: :cascade do |t|
  t.datetime "created_at", null: false
  t.string "email", null: false
  t.string "password_digest", null: false
  t.datetime "updated_at", null: false
  t.index ["email"], name: "index_users_on_email", unique: true
end

add_foreign_key "favorite_pages", "pages"
add_foreign_key "favorite_pages", "users"
add_foreign_key "page_views", "pages"
add_foreign_key "page_views", "users"
add_foreign_key "pages", "pages", column: "parent_id"
add_foreign_key "pages", "users"
add_foreign_key "profiles", "users"
add_foreign_key "refresh_tokens", "users"
