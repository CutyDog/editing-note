# Load each seed file in db/seeds directory
Dir[Rails.root.join('db/seeds/*.rb')].sort.each do |seed|
  puts "Loading seed file: #{File.basename(seed)}"
  load seed
end
