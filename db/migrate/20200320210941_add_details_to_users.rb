class AddDetailsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :phone_number, :integer
    add_column :users, :senior, :boolean, default: false
  end
end
