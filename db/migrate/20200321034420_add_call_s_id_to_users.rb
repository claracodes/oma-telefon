class AddCallSIdToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :call_s_id, :string
  end
end
