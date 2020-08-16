Table users {
  id int [pk, increment]
  full_name varchar
  created_at timestamp
}

Table store {
  id int [pk, ref: > users.id]
  name varchar
  created_at timestamp
}

Table listing {
  id int [pk, ref: > store.id]
  name varchar
  sold boolean
  price integer
  created_at timestamp
  sold_at timestamp
}

Table tag {
  id int [pk, ref: < listing]
  name varchar
}
