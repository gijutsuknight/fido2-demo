CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credentials (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    credential_id VARCHAR(1024) NOT NULL UNIQUE,
    public_key    TEXT NOT NULL,
    sign_count    BIGINT NOT NULL DEFAULT 0,
    aaguid        VARCHAR(36),
    transports    VARCHAR(255),
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used     TIMESTAMP,
    CONSTRAINT fk_credentials_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS challenges (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    challenge  VARCHAR(512) NOT NULL UNIQUE,
    username   VARCHAR(100),
    type       ENUM('REGISTRATION', 'AUTHENTICATION') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_history (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    device     VARCHAR(255),
    browser    VARCHAR(255),
    ip         VARCHAR(45),
    success    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_login_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_credentials_user_id ON credentials(user_id);
CREATE INDEX idx_challenges_challenge ON challenges(challenge);
CREATE INDEX idx_challenges_expires_at ON challenges(expires_at);
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
