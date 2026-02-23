# frozen_string_literal: true

module Authenticatable
  extend ActiveSupport::Concern

  included do
    # 各コントローラーで current_user を参照可能にする
    attr_reader :current_user
  end

  private

  # 認証が必要なアクションの before_action として使用
  def authenticate_user!
    token = request.headers["Authorization"]&.split(" ")&.last
    payload = JwtToken.decode(token) if token

    # トークンが正しく、かつユーザーが存在する場合のみ成功
    if payload && (@current_user = User.find_by(id: payload[:user_id]))
      # 認証成功
    else
      render json: { error: I18n.t("auth.errors.unauthenticated") }, status: :unauthorized
    end
  end
end
