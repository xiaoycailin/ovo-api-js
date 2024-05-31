CREATE TABLE ovo_users (
    id INT AUTO_INCREMENT,
    username VARCHAR(255),
    apikey VARCHAR(255),
    access_token LONGTEXT,
    phone_number VARCHAR(20),
    pin VARCHAR(255),
    PRIMARY KEY (id)
);

ALTER TABLE ovo_users
        ADD otp_ref_id LONGTEXT;
        ADD otp_token LONGTEXT;