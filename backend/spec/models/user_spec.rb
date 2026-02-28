# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it '有効な属性を持つ場合は有効であること' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'emailがない場合は無効であること' do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
    end

    it 'emailが重複している場合は無効であること' do
      create(:user, email: 'test@example.com')
      user = build(:user, email: 'test@example.com')
      expect(user).not_to be_valid
    end

    it '不正な形式のemailの場合は無効であること' do
      user = build(:user, email: 'invalid_email')
      expect(user).not_to be_valid
    end
  end

  describe 'normalizations' do
    it 'emailが小文字に変換され、空白が除去されること' do
      user = create(:user, email: '  User@Example.COM  ')
      expect(user.email).to eq('user@example.com')
    end
  end

  describe 'password authentication' do
    let(:user) { create(:user, password: 'password123') }

    it '正しいパスワードで認証に成功すること' do
      expect(user.authenticate('password123')).to eq(user)
    end

    it '間違ったパスワードで認証に失敗すること' do
      expect(user.authenticate('wrong_password')).to be_falsey
    end
  end

  describe 'associations' do
    it 'profileを持つことができること' do
      user = create(:user, :with_profile)
      expect(user.profile).to be_present
    end

    it '削除時に紐づくトークンも削除されること' do
      user = create(:user)
      create(:refresh_token, user: user)
      expect { user.destroy }.to change(RefreshToken, :count).by(-1)
    end

    it '削除時に紐づくページも削除されること' do
      user = create(:user)
      create(:page, user: user)
      expect { user.destroy }.to change(Page, :count).by(-1)
    end
  end
end
