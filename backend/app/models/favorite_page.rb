# frozen_string_literal: true

# == Schema Information
#
# Table name: favorite_pages
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  page_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_favorite_pages_on_page_id              (page_id)
#  index_favorite_pages_on_user_id              (user_id)
#  index_favorite_pages_on_user_id_and_page_id  (user_id,page_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (page_id => pages.id)
#  fk_rails_...  (user_id => users.id)
#
class FavoritePage < ApplicationRecord
  belongs_to :user
  belongs_to :page

  validates :user_id, uniqueness: { scope: :page_id }
end
