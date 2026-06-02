CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE todos (
  id VARCHAR(255) PRIMARY KEY, 
  title VARCHAR(255) NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  userId VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES  users(id)
)

alter table todos add column createdAt TIMESTAMP DEFAULT now();