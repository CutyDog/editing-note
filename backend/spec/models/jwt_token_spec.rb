# frozen_string_literal: true

require 'rails_helper'

RSpec.describe JwtToken, type: :model do
  let(:payload) { { user_id: 1 } }

  describe '.encode' do
    it 'JWT文字列を返すこと' do
      token = JwtToken.encode(payload)
      expect(token).to be_a(String)
      expect(token.split('.').size).to eq(3)
    end

    it 'ペイロードに有効期限が含まれること' do
      exp = 1.hour.from_now
      token = JwtToken.encode(payload, exp)
      decoded_payload = JwtToken.decode(token)
      expect(decoded_payload['exp']).to eq(exp.to_i)
    end
  end

  describe '.decode' do
    it '有効なトークンの場合に、HashWithIndifferentAccess形式でペイロードを返すこと' do
      token = JwtToken.encode(payload)
      decoded_payload = JwtToken.decode(token)
      expect(decoded_payload[:user_id]).to eq(1)
      expect(decoded_payload['user_id']).to eq(1)
    end

    it '不正なトークンの場合にnilを返すこと' do
      expect(JwtToken.decode('invalid.token.here')).to be_nil
    end

    it '期限切れのトークンの場合にnilを返すこと' do
      token = JwtToken.encode(payload, 1.second.ago)
      expect(JwtToken.decode(token)).to be_nil
    end
  end
end
