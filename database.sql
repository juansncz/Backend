CREATE DATABASE defaultdb;

USE defaultdb;

SHOW TABLES;

CREATE TABLE users (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE KEY,
    password VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL, -- Profile picture URL (optional)
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE conversations (
    conversation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_1_id INT NOT NULL, 
    user_2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_1_id) REFERENCES users(user_id),
    FOREIGN KEY (user_2_id) REFERENCES users(user_id)
);




CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL, 
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

CREATE TABLE contacts (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,  -- The user who adds a contact
    contact_user_id INT NOT NULL,  -- The user being added as a contact
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (contact_user_id) REFERENCES users(user_id)
);

SHOW TABLES;

SELECT * FROM users;
SELECT * FROM conversations;
SELECT * FROM messages;
SELECT * FROM contacts;

DESC users;
DESC conversations;
DESC messages;
DESC contacts;

DROP TABLE users;
DROP TABLE conversations;
DROP TABLE messages;
DROP TABLE contacts;

DROP DATABASE defaultdb;
