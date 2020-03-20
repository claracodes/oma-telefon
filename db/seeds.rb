oma = User.create(email: "oma@web.de",
                  password: "123456",
                  senior: true,
                  phone_number: "0987654321")

sven = User.create(email: "sven@gmail.com",
                   password: "123456",
                   senior: false,
                   phone_number: "012345678")

Order.create(owner: oma,
             shopper: sven,
             status: 1,
             list: "Brot, Taschentuecher")
