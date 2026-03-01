# frozen_string_literal: true

class UserSerializer
  include Alba::Resource

  attributes :id, :email, :created_at, :updated_at

  one :profile_or_dummy, resource: ProfileSerializer, key: :profile
end
