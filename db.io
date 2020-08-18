Table user {
  id int [pk, increment]
  full_name varchar
  created_at timestamp
}

Table store {
  id int [pk, increment]
  name varchar
  created_at timestamp
}

Table vendor {
  id int [pk, increment]
  user_id int [ref: > user.id]
  store_id int [ref: > store.id]
  created_at timestamp
}

Table listing {
  id int [pk, increment]
  store_id int [pk, ref: > store.id]
  name varchar
  sold boolean
  price integer
  created_at timestamp
  sold_at timestamp
}

Table label {
  id int [pk, increment]
  listing_id int [ref: > listing.id]
  tag_id int [ref: > tag.id]
}

Table tag {
  id int [pk, increment]
  store_id int [ref: > store.id]
  name varchar
}
