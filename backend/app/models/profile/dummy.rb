# frozen_string_literal: true

class Profile
  class Dummy
    include ActiveModel::Model
    include ActiveModel::Attributes

    attribute :id, :integer
    attribute :user_id, :integer
    attribute :name, :string
    attribute :created_at, :datetime
    attribute :updated_at, :datetime

    def initialize(user)
      super()

      @user = user
      timestamp = Time.current.freeze

      self.id = 0
      self.user_id = user.id
      self.name = "No Name"
      self.created_at = timestamp
      self.updated_at = timestamp
    end
  end
end
