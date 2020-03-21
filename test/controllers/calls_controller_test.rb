require 'test_helper'

class CallsControllerTest < ActionDispatch::IntegrationTest
  test "should get incoming" do
    get calls_incoming_url
    assert_response :success
  end

end
