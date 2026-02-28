# == Schema Information
#
# Table name: pages
#
#  id         :bigint           not null, primary key
#  content    :jsonb
#  position   :integer          default(0)
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  parent_id  :bigint
#  user_id    :bigint           not null
#
# Indexes
#
#  index_pages_on_parent_id  (parent_id)
#  index_pages_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => pages.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :page do
    user
    title { "My Note Page" }
    content { [{ type: "paragraph", children: [{ text: "Hello Notion!" }] }] }
    position { 0 }

    trait :with_parent do
      association :parent, factory: :page
    end
  end
end
