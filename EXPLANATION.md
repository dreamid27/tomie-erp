dengan asumsi

---flow user

- 1 customer memiliki banyak user
- ada customer yg tidak memiliki akses ke app/masih manual, jadi sales bisa input manual
- dengan asumsi produk yg di jual kurang dari < 10, jadi tidak memerlukan fungsi search ataupun cache disini
- dengan asumsi customer perlu request quotation secara manual, dimana nanti akan di approve oleh sales
- dengan asumsi tidak ada pajak atau diskon

--flow teknis

- dengan asumsi semua tim member dapat menggunakan react, maka kita akan menggunakan react.js
- memilih react karena banyak komunitas, library dan resource yg tersedia, sehingga untuk waktu yg singkat sangat cocok, dan bisa di kembangkan lebih lanjut.
- memilih tailwindcss karena lebih cepat dan mudah dalam penggunaannya, serta banyak library yg tersedia.

--futer improvement

- membuat fitur search untuk produk/customer ketika sudah banyak data
- membuat fitur cache
- improving design
- menambahkan refresh token untuk security

--teknis

- memisahkan docker-compose antara backend dan frontend, untuk mempersingkat waktu deploy. karena kadang tidak memerlukan deploy backend dan frontend secara bersamaan.
- untuk database, saat ini menempel ke backend, karena untuk mempersingakt waktu saja. tapi seharusnya ini di pisahkan ke docker-compose atau environment yg lain.
- menggunakan nestjs karena lebih mudah dalam penggunaannya, dan banyak library yg tersedia. serta familiar dengan saya. selain itu ini bisa di kembangkan untuk menjadi projek yg besar dan mudah mengoperasionnya.
