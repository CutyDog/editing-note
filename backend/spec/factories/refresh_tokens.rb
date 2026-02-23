FactoryBot.define do
  factory :refresh_token do
    user
    token { SecureRandom.urlsafe_base64(64) }
    expires_at { 30.days.from_now }
    revoked_at { nil }
  end
end
