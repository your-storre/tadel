insert into airports values
 ('ATL','Atlanta','Hartsfield–Jackson','America/New_York'),
 ('JFK','New York','John F. Kennedy','America/New_York'),
 ('LAX','Los Angeles','Los Angeles Intl','America/Los_Angeles'),
 ('SEA','Seattle','Seattle–Tacoma','America/Los_Angeles'),
 ('DTW','Detroit','Detroit Metro','America/Detroit'),
 ('MSP','Minneapolis','Minneapolis–St. Paul','America/Chicago'),
 ('SLC','Salt Lake City','Salt Lake City Intl','America/Denver');

insert into aircraft (type, seat_rows, cols) values
 ('Boeing 737-900', 32, 6), ('Airbus A321', 34, 6),
 ('Boeing 757-200', 36, 6), ('Airbus A330-300', 40, 8);

insert into flights (flight_no, origin, destination, departs_at, arrives_at, aircraft_id, duration_min) values
 ('DL1234','ATL','JFK', now() + interval '1 day 8 hours', now() + interval '1 day 10 hours 30 min', 1, 150),
 ('DL567','JFK','LAX', now() + interval '2 days 9 hours', now() + interval '2 days 15 hours', 4, 360),
 ('DL890','LAX','SEA', now() + interval '1 day 13 hours', now() + interval '1 day 15 hours 10 min', 2, 130),
 ('DL2210','DTW','MSP', now() + interval '3 days 7 hours', now() + interval '3 days 9 hours', 3, 120),
 ('DL445','MSP','SLC', now() + interval '2 days 11 hours', now() + interval '2 days 13 hours 15 min', 2, 135);
