# Test User
user = User.find_or_initialize_by(email: 'test@example.com')
if user.new_record?
  user.password = 'password'
  user.password_confirmation = 'password'
  user.save!
  puts "Created test user: test@example.com"
else
  puts "Test user already exists: test@example.com"
end
