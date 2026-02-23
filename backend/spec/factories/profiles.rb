FactoryBot.define do
  factory :profile do
    user
    name { "テストユーザー" }
  end
end
