class GeolocationService


  def self.from_address(address)
    return {} if address.blank?

    response = HTTParty.get('https://nominatim.openstreetmap.org/?q=' + I18n.transliterate(address) + '&format=json')

    json = JSON.parse(response.body)

    {
      latitude: json.first['lat'].to_f,
      longitude: json.first['lon'].to_f
    }
  end
end
