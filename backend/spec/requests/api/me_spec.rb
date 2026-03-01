# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::Me", type: :request do
  let(:user) { create(:user, email: "test@example.com") }

  describe "GET /api/me" do
    context "未ログインの場合" do
      it "401 Unauthorizedを返すこと" do
        get "/api/me"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "ログイン済みの場合" do
      it "プロファイルがない場合は、ダミープロファイルを含むユーザー情報を返すこと" do
        get "/api/me", headers: auth_headers(user), as: :json

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["email"]).to eq(user.email)
        expect(json["profile"]["name"]).to eq("No Name")
      end

      it "プロファイルが存在する場合は、実際のプロファイルを含むユーザー情報を返すこと" do
        create(:profile, user: user, name: "My Name")
        get "/api/me", headers: auth_headers(user), as: :json

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["email"]).to eq(user.email)
        expect(json["profile"]["name"]).to eq("My Name")
      end
    end
  end

  describe "PATCH /api/me" do
    context "ログイン済みの場合" do
      it "プロファイルが存在しなかった場合、新規作成しつつ更新されること" do
        expect do
          patch "/api/me",
                params: {
                  user: { email: "new@example.com" },
                  profile: { name: "New Name" }
                },
                headers: auth_headers(user), as: :json
        end.to change(Profile, :count).by(1)

        expect(response).to have_http_status(:ok)
        user.reload
        expect(user.email).to eq("new@example.com")
        expect(user.profile.name).to eq("New Name")
      end

      it "既存のプロファイルを更新すること" do
        create(:profile, user: user, name: "Old Name")

        expect do
          patch "/api/me",
                params: {
                  user: { email: "newer@example.com" },
                  profile: { name: "New Name" }
                },
                headers: auth_headers(user), as: :json
        end.not_to change(Profile, :count)

        expect(response).to have_http_status(:ok)
        user.reload
        expect(user.email).to eq("newer@example.com")
        expect(user.profile.name).to eq("New Name")
      end

      it "バリデーションに失敗した場合は422 Unprocessable Entityを返すこと" do
        patch "/api/me",
              params: {
                user: { email: "invalid" }
              },
              headers: auth_headers(user), as: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
