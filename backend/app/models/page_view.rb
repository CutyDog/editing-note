# frozen_string_literal: true
# rbs_inline: enabled

# == Schema Information
#
# Table name: page_views
#
#  id             :bigint           not null, primary key
#  last_viewed_at :datetime         not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  page_id        :bigint           not null
#  user_id        :bigint           not null
#
# Indexes
#
#  index_page_views_on_page_id              (page_id)
#  index_page_views_on_user_id              (user_id)
#  index_page_views_on_user_id_and_page_id  (user_id,page_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (page_id => pages.id)
#  fk_rails_...  (user_id => users.id)
#
class PageView < ApplicationRecord
  belongs_to :user
  belongs_to :page

  validates :user_id, presence: true
  validates :page_id, presence: true
  validates :last_viewed_at, presence: true
end
