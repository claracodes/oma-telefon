class CallsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def incoming
    message = Twilio::TwiML::VoiceResponse.new do |r|
      r.gather(numDigits: 1, action: "/order_option") do |g|
        g.play(url: helpers.audio_url('0_Willkommen.wav'))
      end
    end
    render xml: message.to_xml
  end

  def order_option
    if params['Digits']
      case params['Digits']
      when '1'
        url = helpers.audio_url('1_Lebensmittel.wav')
      when '2'
        url = helpers.audio_url('2_Apotheke.wav')
      when '3'
        url = helpers.audio_url('3_Anderes.wav')
      end

      oma = User.create(email: "oma_#{Time.now.to_i}#{rand(919)}@oma.com",
                        password: "#{rand(100..999)}#{rand(100..999)}",
                        senior: true,
                        call_s_id: params["CallSid"])

      Order.create(owner: oma, order_type: params['Digits'].to_i)

      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.gather(input: 'speech', language: 'de-DE', action: "/list") do |g|
          g.play(url: url)
        end
      end
    end
    render xml: message.to_xml
  end

  def list
    if params["SpeechResult"]
      oma = User.find_by(call_s_id: params["CallSid"])
      order = oma.open_orders.find_by(list: nil)
      order.update(list: params["SpeechResult"])

      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.gather(finishOnKey: "#", action: '/phone_number') do |g|
          g.play(url: helpers.audio_url('6_Telefonnummer.wav'))
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

      message1 = "Danke, sagen Sie uns bitte auch Ihren Vornamen."
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

      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.gather(input: 'speech', action: '/address', language: 'de-DE') do |g|
          g.play(url: helpers.audio_url('4_Adresse.wav'))
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

      message = Twilio::TwiML::VoiceResponse.new do |r|
        r.play(url: helpers.audio_url('7_Vielen_Dank.wav'))
      end
    end
    render xml: message.to_xml
  end

  def confirm_order
    message = Twilio::TwiML::VoiceResponse.new do |r|
      r.play(url: helpers.audio_url('5_Besorgung_ausgeführt.wav'))
    end
    render xml: message.to_xml
  end
end
