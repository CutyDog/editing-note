# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Auth', type: :request do
  let(:user) { create(:user) }
  let(:password) { 'password123' }

  describe 'POST /api/auth/login' do
    let(:url) { '/api/auth/login' }
    let(:params) do
      {
        email: user.email,
        password: password
      }
    end

    context '有効な認証情報の場合' do
      it '200 OKとトークンを返すこと' do
        post url, params: params, as: :json
        expect(response).to have_http_status(:ok)
        expect(json['access_token']).to be_present
        expect(json['refresh_token']).to be_present
        expect(json['user']['email']).to eq(user.email)
      end
    end

    context '無効な認証情報の場合' do
      it '401 Unauthorizedを返すこと' do
        post url, params: params.merge(password: 'wrong_password'), as: :json
        expect(response).to have_http_status(:unauthorized)
        expect(json['error']).to be_present
      end
    end
  end

  describe 'POST /api/auth/refresh' do
    let(:url) { '/api/auth/refresh' }
    let(:refresh_token) { create(:refresh_token, user: user) }

    context '有効なリフレッシュトークンの場合' do
      it '200 OKと新しいアクセストークンを返すこと' do
        post url, params: { refresh_token: refresh_token.token }, as: :json
        expect(response).to have_http_status(:ok)
        expect(json['access_token']).to be_present
      end
    end

    context '期限切れまたは無効なリフレッシュトークンの場合' do
      it '401 Unauthorizedを返すこと' do
        post url, params: { refresh_token: 'invalid_token' }, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/auth/logout' do
    let(:url) { '/api/auth/logout' }
    let(:refresh_token) { create(:refresh_token, user: user) }
    let(:access_token) { JwtToken.encode(user_id: user.id) }

    it '204 No Contentを返し、リフレッシュトークンを失効させること' do
      delete url, params: { refresh_token: refresh_token.token }, headers: { Authorization: "Bearer #{access_token}" }, as: :json
      expect(response).to have_http_status(:no_content)
      expect(refresh_token.reload.revoked_at).to be_present
    end
  end
end
