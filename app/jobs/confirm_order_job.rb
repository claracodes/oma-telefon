class ConfirmOrderJob < ApplicationJob
    include Rails.application.routes.url_helpers
  def perform(order_id)
    order = Order.find(order_id)
    account_sid = ENV['TWILIO_ACCOUNT_SID']
    auth_token = ENV['TWILIO_AUTH_TOKEN']
    @client = Twilio::REST::Client.new(account_sid, auth_token)

    number = order.owner.phone_number.start_with?('+') ? order.owner.phone_number : "+" + order.owner.phone_number
    p "about to make a call"
    call = @client.calls.create(url: url_for(confirm_order_url(shopper_id: order.shopper.id)),
                                to: number,
                                from: '+14692948404')

    puts call.sid
  end
end
