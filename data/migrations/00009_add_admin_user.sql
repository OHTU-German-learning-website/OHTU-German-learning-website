ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

INSERT INTO users (username, email, password_hash, is_admin, salt) VALUES ('admin','admin@gradesa.com', '982ff906d8941db6b1af857d82310fa951968aab0c61997d36d468f8be05b4839baba7ec4d8016df012a1b7ecbdc9cd57bc04b1c2c3e222b25870d1bb5d2460b', TRUE, '3725358f924cf6d12b22b90384636553');