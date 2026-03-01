# frozen_string_literal: true

class ProfileSerializer
  include Alba::Resource

  attributes :name, :created_at, :updated_at
end
