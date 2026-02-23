# frozen_string_literal: true

module Api
  class AuthController < ApplicationController
    # ログイン時に認証をスキップ
    skip_before_action :authenticate_user!, only: %i[login refresh]

    # POST /api/auth/login
    def login
      user = User.find_by(email: params[:email].to_s.downcase)
      if user&.authenticate(params[:password])
        # JWTアクセストークン発行 (15分有効)
        access_token = JwtToken.encode(user_id: user.id)

        # リフレッシュトークン発行 (30日有効、DB保存)
        refresh_token = user.refresh_tokens.create!

        render json: {
          access_token: access_token,
          refresh_token: refresh_token.token,
          user: { id: user.id, email: user.email }
        }, status: :ok
      else
        render json: { error: I18n.t("auth.errors.invalid_credentials") }, status: :unauthorized
      end
    end

    # POST /api/auth/refresh
    # アクセストークンの期限が切れた際、リフレッシュトークンを使って再発行する
    def refresh
      # 有効かつ期限内のリフレッシュトークンを検索
      token_record = RefreshToken.active.find_by(token: params[:refresh_token])

      if token_record
        # 新しいアクセストークンのみ発行
        new_access_token = JwtToken.encode(user_id: token_record.user_id)
        render json: { access_token: new_access_token }, status: :ok
      else
        render json: { error: I18n.t("auth.errors.session_expired") }, status: :unauthorized
      end
    end

    # DELETE /api/auth/logout
    def logout
      # 送信されたリフレッシュトークンを失効させる
      token_record = RefreshToken.find_by(token: params[:refresh_token])
      token_record.revoke! if token_record

      head :no_content
    end
  end
end
