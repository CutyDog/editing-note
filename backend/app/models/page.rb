# frozen_string_literal: true
# rbs_inline: enabled

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
class Page < ApplicationRecord
  belongs_to :user
  belongs_to :parent, class_name: "Page", optional: true
  has_many :children, class_name: "Page", foreign_key: :parent_id, dependent: :destroy
  has_many :favorite_pages, dependent: :destroy

  validates :user_id, presence: true
  validates :title, length: { maximum: 255 }

  # userのお気に入りに登録されているかどうかを返す。
  #: @param user [User]
  #: @return [Boolean]
  def favorited_by?(user)
    favorite_pages.any? { |fp| fp.user_id == user.id }
  end
end
