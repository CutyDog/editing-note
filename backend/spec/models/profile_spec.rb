# == Schema Information
#
# Table name: profiles
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_profiles_on_user_id  (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Profile, type: :model do
  describe 'validations' do
    it '有効な属性を持つ場合は有効であること' do
      profile = build(:profile)
      expect(profile).to be_valid
    end

    it '名前がない場合は無効であること' do
      profile = build(:profile, name: nil)
      expect(profile).not_to be_valid
    end

    it 'ユーザーがない場合は無効であること' do
      profile = build(:profile, user: nil)
      expect(profile).not_to be_valid
    end
  end

  describe 'associations' do
    it '1つのユーザーにのみ属すること' do
      user = create(:user)
      create(:profile, user:)
      duplicate_profile = build(:profile, user:)
      expect(duplicate_profile).not_to be_valid
    end
  end
end
