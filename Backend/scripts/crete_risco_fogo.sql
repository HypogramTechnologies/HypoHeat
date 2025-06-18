CREATE TABLE risco_fogo (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    risco_fogo DOUBLE PRECISION NOT NULL
);

ALTER TABLE risco_fogo
ADD COLUMN geom geography(Point, 4326);

UPDATE risco_fogo
SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);

--Rodar após importar o shp do Brasil
DELETE FROM risco_fogo p
USING pais_area b
WHERE NOT ST_Within(p.geom::geometry, b.geom::geometry);


