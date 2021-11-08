"select book_basket.basket_num, book_basket.book_num, book_basket.book_name, book_basket.book_amount, book.book_price from basket_book inner join book where book_basket.book_num = book.book_num "

"select user.name, address.zip_code, address.default_addr, address.detail_addr, card.card_num, card.card_valid_date, card.card_type 
from user inner join card inner join address
on user.user_num = card.user_num = address.user_num where user.user_num =? "

SELECT a.*, b.*, c.* FROM USER a INNER JOIN Address b ON a.user_num = b.user_num INNER JOIN Card c ON a.user_num = c.user_num

SELECT b.*, bb.*, bk.* FROM basket b INNER JOIN book_basket bb ON b.basket_num = bb.basket_num
 INNER JOIN book bk ON bb.book_num = bk.book_num where b.basket_num=?

 
 주문 내역 가져오는 쿼리

SELECT m.*, bo.book_order_amount, bo.book_order_price, bk.book_name, bk.book_price FROM myorder m INNER JOIN book_order bo ON m.order_num = bo.order_num
 INNER JOIN book bk ON bk.book_num = bo.book_num where m.user_num = 6