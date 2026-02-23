# frozen_string_literal: true

class JwtToken
  # JWT署名用の秘密鍵。Railsのsecret_key_baseを使用。
  SECRET_KEY = Rails.application.credentials.secret_key_base

  # ペイロードをエンコードしてJWTを発行
  # @param payload [Hash] ユーザーIDなどを含める
  # @param exp [ActiveSupport::Duration, Time] 有効期限 (デフォルト 15分)
  def self.encode(payload, exp = 15.minutes.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  # JWTをデコードしてペイロードを取得
  # @param token [String] JWT文字列
  # @return [HashWithIndifferentAccess, nil] デコード成功時はペイロード、失敗時はnil
  def self.decode(token)
    body = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(body)
  rescue JWT::DecodeError
    nil
  end
end
