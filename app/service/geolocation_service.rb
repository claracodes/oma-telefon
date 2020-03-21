class GeolocationService
  def self.from_adress(adress)
    response = HTTParty.get('https://nominatim.openstreetmap.org/?q=' + adress + '&format=json')

    json = JSON.parse(response.body)

    {
      latitude: json.first['lat'].to_f,
      longitude: json.first['lon'].to_f
    }
  end
end