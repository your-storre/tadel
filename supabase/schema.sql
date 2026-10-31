-- airports, aircraft, flights, fares, seats, pnrs, tickets, boarding_passes, flight_status
create table airports (
  code char(3) primary key,
  city text not null,
  name text not null,
  tz text not null
);

create table aircraft (
  id serial primary key,
  type text not null,
  seat_rows int not null,
  cols int not null
);

create table flights (
  id bigserial primary key,
  flight_no text not null,
  origin char(3) references airports(code),
  destination char(3) references airports(code),
  departs_at timestamptz not null,
  arrives_at timestamptz not null,
  aircraft_id int references aircraft(id),
  duration_min int not null
);

create table fares (
  id bigserial primary key,
  flight_id bigint references flights(id) on delete cascade,
  cabin text not null check (cabin in ('Main Cabin','Comfort+','First','Delta One')),
  price_cents int not null,
  baggage text not null,
  change_fee text not null,
  miles int not null
);

create table seats (
  id bigserial primary key,
  flight_id bigint references flights(id) on delete cascade,
  row int not null,
  col char(1) not null,
  cabin text not null,
  exit_row boolean default false,
  occupied boolean default false,
  unique (flight_id, row, col)
);

create table pnrs (
  id uuid primary key default gen_random_uuid(),
  code char(6) unique not null,
  flight_id bigint references flights(id),
  fare_id bigint references fares(id),
  passenger_name text not null,
  seat_id bigint references seats(id),
  sky_miles text,
  created_at timestamptz default now()
);

create table tickets (
  id uuid primary key default gen_random_uuid(),
  pnr_id uuid references pnrs(id) on delete cascade,
  issued_at timestamptz default now()
);

create table boarding_passes (
  id uuid primary key default gen_random_uuid(),
  pnr_id uuid references pnrs(id) on delete cascade,
  group_no char(1) not null,
  barcode text not null,
  issued_at timestamptz default now()
);

create table flight_status (
  flight_id bigint primary key references flights(id) on delete cascade,
  status text not null default 'On Time',
  gate text,
  updated_at timestamptz default now()
);
