# frozen_string_literal: true
# rbs_inline: enabled

module Authenticatable
  extend ActiveSupport::Concern

  # steep:ignore:start
  included do
    # デフォルトで認証を要求する
    before_action :authenticate_user!

    # 各コントローラーで current_user を参照可能にする
    attr_reader :current_user #: User
  end
  # steep:ignore:end

  private

  # 認証が必要なアクションの before_action として使用
  #: () -> void
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
