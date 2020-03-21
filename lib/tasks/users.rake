namespace :users do
  task refetch_coordinates: :environment do
    User.find_each do |user|
      puts 'Refetching coordinates for user ' + user.id.to_s
      user.geocode
      puts "Got coordinates: Lat: #{user.latitude} Long: #{user.longitude}"
    end
  end
end
