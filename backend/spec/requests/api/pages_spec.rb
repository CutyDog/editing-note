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

      it '閲覧履歴(PageView)が記録されること' do
        expect {
          get "/api/pages/#{page.id}", headers: auth_headers(user), as: :json
        }.to change(PageView, :count).by(1)

        view = PageView.last
        expect(view.user).to eq(user)
        expect(view.page).to eq(page)
      end

      it '同じページを再度閲覧した場合、既存のレコードが更新されること' do
        create(:page_view, user: user, page: page, last_viewed_at: 1.day.ago)

        expect {
          get "/api/pages/#{page.id}", headers: auth_headers(user), as: :json
        }.not_to change(PageView, :count)

        view = PageView.find_by(user: user, page: page)
        expect(view.last_viewed_at).to be_within(1.second).of(Time.current)
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

  describe 'GET /api/pages/recent' do
    before do
      pages = create_list(:page, 5, user: user)
      # 閲覧順: page2, page4, page1 (新しい順)
      create(:page_view, user: user, page: pages[0], last_viewed_at: 3.hours.ago)
      create(:page_view, user: user, page: pages[1], last_viewed_at: 1.hour.ago)
      create(:page_view, user: user, page: pages[3], last_viewed_at: 2.hours.ago)

      # 他ユーザーの閲覧履歴
      create(:page_view, user: other_user, page: create(:page, user: other_user))
    end

    it '最近見たページを閲覧日時の降順で返すこと' do
      get '/api/pages/recent', headers: auth_headers(user), as: :json
      expect(response).to have_http_status(:ok)
      expect(json.length).to eq(3)
      expect(json[0]['id']).to eq(user.pages.second.id) # 1.hour.ago
      expect(json[1]['id']).to eq(user.pages.fourth.id) # 2.hours.ago
      expect(json[2]['id']).to eq(user.pages.first.id)  # 3.hours.ago
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
