
SELECT * FROM localizacao_ocorrencia loc


SELECT loc.localizacao_ocorrenciageometria 
FROM localizacao_ocorrencia loc
JOIN estados_areas ea 
  ON ST_Within(loc.localizacao_ocorrenciageometria, ea.geom)
WHERE ea.nm_uf = 'São Paulo'
UNION
SELECT ea.geom 
FROM estados_areas ea 
WHERE ea.nm_uf = 'São Paulo';


SELECT loc.localizacao_ocorrenciageometria 
FROM localizacao_ocorrencia loc
JOIN biomas_areas ba 
  ON ST_Within(loc.localizacao_ocorrenciageometria, ba.geom)
WHERE ba.bioma = 'Pampa'
UNION
SELECT ba.geom 
FROM biomas_areas ba 
WHERE ba.bioma = 'Pampa'; 


SELECT * 
FROM estados_areas 
WHERE ST_Within(
  ST_SetSRID(ST_MakePoint(-45.967, -23.3055), 4326), --JACAREÍ
  geom
);


SELECT * 
FROM biomas_areas 
WHERE ST_Within(
  ST_SetSRID(ST_MakePoint(-45.967, -23.3055), 4326), --JACAREÍ
  geom
);

