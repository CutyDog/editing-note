# frozen_string_literal: true
# rbs_inline: enabled

class ProfileSerializer < ::BaseSerializer
  attributes :name, :created_at, :updated_at
end
