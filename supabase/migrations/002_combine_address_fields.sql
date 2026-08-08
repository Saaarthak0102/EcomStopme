-- ============================================================
-- Combine Address Fields Migration
-- Migrates flat_house, area_street, and landmark columns into street_address
-- ============================================================

ALTER TABLE addresses ADD COLUMN IF NOT EXISTS street_address text;

UPDATE addresses 
SET street_address = TRIM(
  CONCAT_WS(', ', 
    NULLIF(flat_house, ''), 
    NULLIF(area_street, ''), 
    NULLIF(landmark, '')
  )
)
WHERE street_address IS NULL OR street_address = '';

ALTER TABLE addresses ALTER COLUMN street_address SET NOT NULL;
ALTER TABLE addresses DROP COLUMN IF EXISTS flat_house;
ALTER TABLE addresses DROP COLUMN IF EXISTS area_street;
ALTER TABLE addresses DROP COLUMN IF EXISTS landmark;
