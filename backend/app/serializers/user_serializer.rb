# frozen_string_literal: true
# rbs_inline: enabled

class UserSerializer < ::BaseSerializer
  attributes :id, :email, :created_at, :updated_at

  one :profile_or_dummy, resource: ProfileSerializer, key: :profile
end
