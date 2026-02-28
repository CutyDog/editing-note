# frozen_string_literal: true

module RequestSpecHelper
  # JSONレスポンスをハッシュにパースする
  def json
    JSON.parse(response.body)
  end

  # 指定ユーザーでサインイン済みのAuthorizationヘッダーを返す
  def auth_headers(user)
    token = JwtToken.encode(user_id: user.id)
    { Authorization: "Bearer #{token}" }
  end
end
