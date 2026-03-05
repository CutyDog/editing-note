# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::FavoritePages", type: :request do
  let(:user) { create(:user) }
  let(:page) { create(:page, user:) }

  describe "POST /api/pages/:page_id/favorite" do
    context "未ログインの場合" do
      it "401 Unauthorizedを返すこと" do
        post "/api/pages/#{page.id}/favorite"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "ログイン済みの場合" do
      it "お気に入りに登録でき、201 Createdを返すこと" do
        expect {
          post "/api/pages/#{page.id}/favorite", headers: auth_headers(user), as: :json
        }.to change(FavoritePage, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it "すでにお気に入り済みでも冪等に201 Createdを返すこと" do
        create(:favorite_page, user: user, page: page)

        expect {
          post "/api/pages/#{page.id}/favorite", headers: auth_headers(user), as: :json
        }.not_to change(FavoritePage, :count)

        expect(response).to have_http_status(:created)
      end

      it "他のユーザーのページはお気に入り登録できないこと" do
        other_page = create(:page, user: create(:user))

        post "/api/pages/#{other_page.id}/favorite", headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE /api/pages/:page_id/favorite" do
    context "未ログインの場合" do
      it "401 Unauthorizedを返すこと" do
        delete "/api/pages/#{page.id}/favorite"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "ログイン済みの場合" do
      it "お気に入りを解除でき、204 No Contentを返すこと" do
        create(:favorite_page, user: user, page: page)

        expect {
          delete "/api/pages/#{page.id}/favorite", headers: auth_headers(user), as: :json
        }.to change(FavoritePage, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end

      it "お気に入り未登録でも冪等に204 No Contentを返すこと" do
        expect {
          delete "/api/pages/#{page.id}/favorite", headers: auth_headers(user), as: :json
        }.not_to change(FavoritePage, :count)

        expect(response).to have_http_status(:no_content)
      end

      it "他のユーザーのページは解除できないこと" do
        other_page = create(:page, user: create(:user))

        delete "/api/pages/#{other_page.id}/favorite", headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
