# frozen_string_literal: true
# rbs_inline: enabled

class Profile
  class Dummy
    #: (User user) -> void
    def initialize(user)
      @user = user
      @timestamp = Time.current.freeze
    end

    #: () -> Integer
    def id
      0
    end

    #: () -> Integer
    def user_id
      @user.id
    end

    #: () -> String
    def name
      "No Name"
    end

    #: () -> ActiveSupport::TimeWithZone
    def created_at
      @timestamp
    end

    #: () -> ActiveSupport::TimeWithZone
    def updated_at
      @timestamp
    end
  end
end
