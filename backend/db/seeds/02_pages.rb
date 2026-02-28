user = User.find_by!(email: 'test@example.com')

# Initial Pages
if user.pages.empty?
  1.upto(3) do |i|
    user.pages.create!(
      title: "Welcome Page #{i}",
      content: [
        { type: 'paragraph', children: [{ text: "This is seed content for page #{i}." }] }
      ],
      position: i
    )
  end
  puts "Created initial 3 pages for test user"
else
  puts "Pages for test user already exist"
end
