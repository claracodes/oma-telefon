puts 'Deleting all records'
[
  Order,
  User
].each(&:destroy_all)

puts 'Seeding data from csv'
CSV.foreach Rails.root.join("db/seeds.csv"), headers: true, encoding: 'bom|utf-8' do |row|
  oma = User.create!(
    name: row[0],
    email: "#{row[0]}@web.de",
    password: '123456',
    senior: true,
    address: row[1],
    phone_number: '+490987654321'
  )
  puts "Created User #{oma.name}"

  order = Order.create!(owner: oma, list: row[2], order_type: row[3].to_i)
  puts "Created Order '#{order.list}'"
end

puts 'Creating example shopper'
User.create(email: "sven@gmail.com",
            password: "123456",
            senior: false,
            address: "Göttingen",
            phone_number: "012345678")