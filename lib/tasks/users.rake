namespace :users do
  task refetch_coordinates: :environment do
    User.find_each do |user|
      puts 'Refetching coordinates for user ' + user.id.to_s
      coordinates = GeolocationService.from_address(user.address)
      puts 'Got coordinates: ' + coordinates.to_s
      user.update(coordinates)
    end
  end
end
