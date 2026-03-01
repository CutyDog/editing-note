# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Pages', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  describe 'GET /api/pages' do
    context '認証済みの場合' do
      before do
        create_list(:page, 3, user: user)
        create(:page, user: other_user) # 他ユーザーのページ
      end

      it '200 OKと自分のページ一覧のみを返すこと' do
        get '/api/pages', headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:ok)
        expect(json.length).to eq(3)
      end

      context 'qパラメータが指定された場合' do
        before do
          user.pages.first.update!(title: 'React Navigation')
          user.pages.second.update!(title: 'Vue Notes')
        end

        it '検索クエリにマッチするページのみを返すこと' do
          get '/api/pages?q=react', headers: auth_headers(user), as: :json
          expect(response).to have_http_status(:ok)
          expect(json.length).to eq(1)
          expect(json.first['title']).to eq('React Navigation')
        end
      end
    end

    context '未認証の場合' do
      it '401 Unauthorizedを返すこと' do
        get '/api/pages', as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/pages/:id' do
    let(:page) { create(:page, user: user) }

    context '自分のページの場合' do
      it '200 OKとページの詳細を返すこと' do
        get "/api/pages/#{page.id}", headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:ok)
        expect(json['id']).to eq(page.id)
        expect(json['title']).to eq(page.title)
      end
    end

    context '他ユーザーのページの場合' do
      let(:other_page) { create(:page, user: other_user) }

      it '404 Not Foundを返すこと' do
        get "/api/pages/#{other_page.id}", headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /api/pages' do
    let(:params) { { page: { title: '新しいページ' } } }

    context '有効なパラメータの場合' do
      it '201 Createdとページを返すこと' do
        expect {
          post '/api/pages', params: params, headers: auth_headers(user), as: :json
        }.to change(Page, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json['title']).to eq('新しいページ')
      end
    end

    context 'titleが255文字以上の場合' do
      let(:params) { { page: { title: 'a' * 256 } } }

      it '422 Unprocessable Entityを返すこと' do
        post '/api/pages', params: params, headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH /api/pages/:id' do
    let(:page) { create(:page, user: user, title: '旧タイトル') }

    context '自分のページの場合' do
      it '200 OKとタイトルが更新されること' do
        patch "/api/pages/#{page.id}", params: { page: { title: '新タイトル' } }, headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:ok)
        expect(json['title']).to eq('新タイトル')
      end
    end

    context '他ユーザーのページの場合' do
      let(:other_page) { create(:page, user: other_user) }

      it '404 Not Foundを返すこと' do
        patch "/api/pages/#{other_page.id}", params: { page: { title: '改ざん' } }, headers: auth_headers(user), as: :json
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE /api/pages/:id' do
    let!(:page) { create(:page, user: user) }

    context '自分のページの場合' do
      it '204 No Contentを返しページが削除されること' do
        expect {
          delete "/api/pages/#{page.id}", headers: auth_headers(user), as: :json
        }.to change(Page, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context '他ユーザーのページの場合' do
      let!(:other_page) { create(:page, user: other_user) }

      it '404 Not Foundを返しページが削除されないこと' do
        expect {
          delete "/api/pages/#{other_page.id}", headers: auth_headers(user), as: :json
        }.not_to change(Page, :count)
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
