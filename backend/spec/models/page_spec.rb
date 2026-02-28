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
require 'rails_helper'

RSpec.describe Page, type: :model do
  describe 'validations' do
    it '有効な属性を持つ場合は有効であること' do
      user = create(:user)
      page = build(:page, user:)
      expect(page).to be_valid
    end

    it 'userがない場合は無効であること' do
      page = build(:page, user: nil)
      expect(page).not_to be_valid
    end

    it 'titleが256文字以上の場合は無効であること' do
      page = build(:page, user: create(:user), title: 'a' * 256)
      expect(page).not_to be_valid
    end
  end

  describe 'associations' do
    let(:user) { create(:user) }
    let(:parent_page) { create(:page, user: user) }

    it '親ページを持つことができること' do
      child_page = create(:page, user: user, parent: parent_page)
      expect(child_page.parent).to eq(parent_page)
    end

    it '子ページを複数持つことができること' do
      create_list(:page, 3, user: user, parent: parent_page)
      expect(parent_page.children.count).to eq(3)
    end

    it '親ページを削除すると子ページも削除されること' do
      create(:page, user: user, parent: parent_page)
      expect { parent_page.destroy }.to change(Page, :count).by(-2)
    end
  end
end
