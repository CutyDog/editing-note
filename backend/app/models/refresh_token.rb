# frozen_string_literal: true

# == Schema Information
#
# Table name: refresh_tokens
#
#  id         :bigint           not null, primary key
#  expires_at :datetime         not null
#  revoked_at :datetime
#  token      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_refresh_tokens_on_token                   (token) UNIQUE
#  index_refresh_tokens_on_user_id                 (user_id)
#  index_refresh_tokens_on_user_id_and_revoked_at  (user_id,revoked_at)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class RefreshToken < ApplicationRecord
  belongs_to :user

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  before_validation :set_token_and_expiry, on: :create

  scope :active, -> { where(revoked_at: nil).where("expires_at > ?", Time.current) }

  def revoke!
    update!(revoked_at: Time.current)
  end

  def revoked?
    revoked_at.present?
  end

  def expired?
    expires_at <= Time.current
  end

  def usable?
    !revoked? && !expired?
  end

  private

  def set_token_and_expiry
    self.token ||= SecureRandom.urlsafe_base64(64)
    self.expires_at ||= 30.days.from_now
  end
end
