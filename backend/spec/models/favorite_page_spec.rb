# frozen_string_literal: true

# == Schema Information
#
# Table name: favorite_pages
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  page_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_favorite_pages_on_page_id              (page_id)
#  index_favorite_pages_on_user_id              (user_id)
#  index_favorite_pages_on_user_id_and_page_id  (user_id,page_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (page_id => pages.id)
#  fk_rails_...  (user_id => users.id)
#
require "rails_helper"

RSpec.describe FavoritePage, type: :model do
  describe "バリデーション" do
    let(:user) { create(:user) }
    let(:page) { create(:page, user: user) }

    context "同一ユーザーが同じページを重複してお気に入り登録しようとした場合" do
      before { create(:favorite_page, user: user, page: page) }

      it "バリデーションエラーになること" do
        duplicate = build(:favorite_page, user: user, page: page)
        expect(duplicate).not_to be_valid
        expect(duplicate.errors[:user_id]).to be_present
      end
    end

    context "異なるユーザーが同じページをお気に入り登録した場合" do
      let(:other_user) { create(:user) }

      it "正常に保存できること" do
        create(:favorite_page, user: user, page: page)
        other_favorite = build(:favorite_page, user: other_user, page: page)
        expect(other_favorite).to be_valid
      end
    end
  end

  describe "アソシエーション" do
    it "pageを削除するとfavorite_pageも削除されること" do
      page = create(:page)
      create(:favorite_page, user: page.user, page: page)
      expect { page.destroy }.to change(FavoritePage, :count).by(-1)
    end

    it "userを削除するとfavorite_pageも削除されること" do
      user = create(:user)
      page = create(:page, user: user)
      create(:favorite_page, user: user, page: page)
      expect { user.destroy }.to change(FavoritePage, :count).by(-1)
    end
  end
end
