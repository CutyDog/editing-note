# frozen_string_literal: true

module RequestSpecHelper
  # JSONレスポンスをハッシュにパースする
  def json
    JSON.parse(response.body)
  end
end
