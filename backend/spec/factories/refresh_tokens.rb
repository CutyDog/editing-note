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
FactoryBot.define do
  factory :refresh_token do
    user
    token { SecureRandom.urlsafe_base64(64) }
    expires_at { 30.days.from_now }
    revoked_at { nil }
  end
end
