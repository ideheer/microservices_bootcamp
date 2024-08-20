DO $$ BEGIN FOR i IN 1..1000 LOOP
INSERT INTO
    authors (name, bio)
VALUES
    (
        'Author ' || i,
        'Bio for author ' || i || '. This author has contributed numerous works in various fields.'
    );
END LOOP;
END $$;


TRUNCATE TABLE authors CASCADE;

INSERT INTO
    authors (name, bio)
VALUES
    ('Sun Tzu', 'The Art of War');