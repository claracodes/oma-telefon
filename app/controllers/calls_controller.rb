class CallsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def incoming
    message1 = "Herzlich willkommen beim Oma Telefon. Sagen Sie uns bitte, was Sie benötigen! Drücken Sie die 1, wenn Sie Lebensmittel brauchen, drücken Sie die zwei für anderes."
    message = Twilio::TwiML::VoiceResponse.new do |r|
      r.gather(numDigits: 1, action: "/order_option") do |g|
        g.say(message: message1, language: 'de-DE', voice: 'alice')
      end
      # r.redirect('/voice')
    end
    render xml: message.to_xml
  end

  def order_option
    if params['Digits']
      case params['Digits']
      when '1'
        option = "Lebensmittel"
      when '2'
        option = "anderes"
      end

      oma = User.create(email: "oma_#{Time.now.to_i}#{rand(919)}@oma.com",
                        password: "#{rand(100..999)}#{rand(100..999)}",
                        senior: true,
                        call_s_id: params["CallSid"])

      Order.create!(owner: oma, order_type: params['Digits'].to_i)

      message2 = "Sie wollen #{option}. Geben Sie uns bitte zuerst Ihre Telefonnummer. Drücken Sie die Rautetaste, wenn Sie fertig sind."
      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.gather(finishOnKey: "#{}", action: "/phone_number") do |g|
          g.say(message: message2, language: 'de-DE', voice: 'alice')
        end
      end
    end
    render xml: message.to_xml
  end

  def phone_number
    if params['Digits']
      oma = User.find_by(call_s_id: params["CallSid"])
      oma.phone_number = params['Digits'][0..-2]
      oma.save

      message1 = "Danke, sagen Sie uns bitte auch ihren Vornamen."
      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.gather(input: 'speech', action: '/name', language: 'de-DE') do |g|
          g.say(message: message1, language: 'de-DE', voice: 'alice')
        end
      end
    end
    render xml: message.to_xml
  end

  def name
    if params["SpeechResult"]
      oma = User.find_by(call_s_id: params["CallSid"])
      oma.name = params["SpeechResult"]
      oma.save

      message1 = "Danke, sagen Sie uns nun bitte, was sie benötigen."
      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.gather(input: 'speech', action: '/list', language: 'de-DE') do |g|
          g.say(message: message1, language: 'de-DE', voice: 'alice')
        end
      end
    end
  end

  def list
    if params["SpeechResult"]
      oma = User.find_by(call_s_id: params["CallSid"])
      order = oma.open_orders.find_by(list: nil)
      order.update(list: params["SpeechResult"])

      message1 = "Jetzt brauchen wir nur noch Ihre Adresse"
      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.gather(input: 'speech', action: '/address', language: 'de-DE') do |g|
          g.say(message: message1, language: 'de-DE', voice: 'alice')
        end
      end
    end
    render xml: message.to_xml
  end

  def address
    if params["SpeechResult"]
      oma = User.find_by(call_s_id: params["CallSid"])
      oma.address = params["SpeechResult"]
      oma.save

      message1 = "Vielen Dank!"
      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.say(message: message1, language: 'de-DE', voice: 'alice')
      end
    end
    render xml: message.to_xml
  end

  def test_get
    message1 = "Herzlich willkommen beim Oma Telefon. Sagen Sie uns bitte, was Sie benötigen! Drücken Sie die 1, wenn Sie Lebensmittel brauchen, drücken Sie die zwei für anderes."
    message = Twilio::TwiML::VoiceResponse.new do |r|
      r.gather(numDigits: 1) do |g|
        g.say(message: message1, language: 'de-DE', voice: 'alice')
      end
      r.redirect('/voice')
    end
    render xml: message.to_xml
  end
end
