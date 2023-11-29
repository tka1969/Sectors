

CREATE SCHEMA IF NOT EXISTS sectors;

GRANT USAGE ON SCHEMA sectors TO sectors;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA sectors TO sectors;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA sectors TO sectors;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA sectors TO sectors;




CREATE OR REPLACE FUNCTION sectors.row_insert_or_update()
RETURNS TRIGGER
AS
$$
DECLARE
    current_datetime timestamp without time zone;
BEGIN
    current_datetime = now() AT TIME ZONE 'UTC';
    
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = current_datetime;
        NEW.modified_at = current_datetime;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.created_by := OLD.created_by;
        NEW.created_at := OLD.created_at;
        NEW.modified_at = current_datetime;
        RETURN NEW;
    END IF;
END;
$$
language 'plpgsql';



CREATE TABLE IF NOT EXISTS sectors.usersector
(
    id bigserial NOT NULL,
    username varchar(25),
    is_terms_agreed boolean default (false),
    row_status char(1) DEFAULT 'A' NOT NULL,
    created_by varchar(50) NOT NULL,
    created_at timestamp without time zone,
    modified_by varchar(50) NOT NULL,
    modified_at timestamp without time zone,
    
    CONSTRAINT usersector_pkey PRIMARY KEY (id)
);

ALTER TABLE sectors.usersector OWNER to sectors;

CREATE INDEX idx_user_sector_username
    ON sectors.usersector (username);
    
CREATE TRIGGER usersector_row_insert_or_update
BEFORE INSERT OR UPDATE
ON sectors.usersector
    FOR EACH ROW
    EXECUTE PROCEDURE sectors.row_insert_or_update();
    
    

CREATE TABLE IF NOT EXISTS sectors.sector
(
    id bigserial NOT NULL,
    user_id bigint default (0),
    sector_id bigint default (0),
    row_status char(1) DEFAULT 'A' NOT NULL,
    created_by varchar(50) NOT NULL,
    created_at timestamp without time zone,
    modified_by varchar(50) NOT NULL,
    modified_at timestamp without time zone,
    
    CONSTRAINT sector_pkey PRIMARY KEY (id)
);

ALTER TABLE sectors.sector OWNER to sectors;

CREATE INDEX idx_sector_user_id
    ON sectors.sector (user_id);

CREATE TRIGGER sector_row_insert_or_update
BEFORE INSERT OR UPDATE
ON sectors.sector
    FOR EACH ROW
    EXECUTE PROCEDURE sectors.row_insert_or_update();
    

    
    