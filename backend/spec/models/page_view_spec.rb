# frozen_string_literal: true

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
require "rails_helper"

RSpec.describe PageView, type: :model do
  describe "バリデーション" do
    let(:user) { create(:user) }
    let(:page) { create(:page, user: user) }

    it "有効なファクトリを持つこと" do
      expect(build(:page_view, user: user, page: page)).to be_valid
    end

    it "user_idが必須であること" do
      view = build(:page_view, user: nil)
      expect(view).not_to be_valid
      expect(view.errors[:user]).to be_present
    end

    it "page_idが必須であること" do
      view = build(:page_view, page: nil)
      expect(view).not_to be_valid
      expect(view.errors[:page]).to be_present
    end

    it "last_viewed_atが必須であること" do
      view = build(:page_view, last_viewed_at: nil)
      expect(view).not_to be_valid
      expect(view.errors[:last_viewed_at]).to be_present
    end

    it "user_idとpage_idの組み合わせがユニークであること" do
      create(:page_view, user: user, page: page)
      duplicate = build(:page_view, user: user, page: page)
      expect { duplicate.save!(validate: false) }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end

  describe "アソシエーション" do
    let(:user) { create(:user) }
    let(:page) { create(:page, user: user) }
    let(:view) { create(:page_view, user: user, page: page) }

    it "userに属していること" do
      expect(view.user).to eq(user)
    end

    it "pageに属していること" do
      expect(view.page).to eq(page)
    end
  end
end
