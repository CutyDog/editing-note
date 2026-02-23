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
require 'rails_helper'

RSpec.describe RefreshToken, type: :model do
  describe 'token generation' do
    it '新規作成時に自動的にトークンが生成されること' do
      token = create(:refresh_token, token: nil)
      expect(token.token).to be_present
    end

    it '新規作成時に有効期限が設定されること' do
      token = create(:refresh_token, expires_at: nil)
      expect(token.expires_at).to be_present
      expect(token.expires_at).to be > Time.current
    end
  end

  describe '#usable?' do
    it '有効期限内で失効していない場合はtrueを返すこと' do
      token = build(:refresh_token, expires_at: 1.day.from_now, revoked_at: nil)
      expect(token.usable?).to be true
    end

    it '有効期限切れの場合はfalseを返すこと' do
      token = build(:refresh_token, expires_at: 1.day.ago)
      expect(token.usable?).to be false
    end

    it '失効(revoked)している場合はfalseを返すこと' do
      token = build(:refresh_token, revoked_at: Time.current)
      expect(token.usable?).to be false
    end
  end

  describe '#revoke!' do
    it 'トークンを失効させることができること' do
      token = create(:refresh_token)
      token.revoke!
      expect(token.revoked_at).to be_present
      expect(token.usable?).to be false
    end
  end

  describe 'scopes' do
    describe '.active' do
      it '有効なトークンのみを返すこと' do
        active = create(:refresh_token)
        create(:refresh_token, revoked_at: Time.current) # 失効済み
        create(:refresh_token, expires_at: 1.day.ago)   # 期限切れ

        expect(RefreshToken.active).to include(active)
        expect(RefreshToken.active.count).to eq(1)
      end
    end
  end
end
