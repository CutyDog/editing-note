# frozen_string_literal: true

class JwtToken
  # ペイロードをエンコードしてJWTを発行
  # @param payload [Hash] ユーザーIDなどを含める
  # @param exp [ActiveSupport::Duration, Time] 有効期限 (デフォルト 15分)
  def self.encode(payload, exp = 15.minutes.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, secret_key)
  end

  # JWTをデコードしてペイロードを取得
  # @param token [String] JWT文字列
  # @return [HashWithIndifferentAccess, nil] デコード成功時はペイロード、失敗時はnil
  def self.decode(token)
    body = JWT.decode(token, secret_key)[0]
    HashWithIndifferentAccess.new(body)
  rescue JWT::DecodeError
    nil
  end

  private

  def self.secret_key
    Rails.application.secret_key_base
  end
end
