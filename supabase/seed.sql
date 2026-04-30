-- Seed data for the demo: two simulated NESO TEC pulls, one week apart.
-- The "current" pull contains 3 net-new BESS rows that the diff query
-- and Stage 3 filter should pass through to enrichment.
--
-- After running migrations, run this whole file in the SQL editor.
-- Run it once. To re-seed, truncate tec_snapshots first.

-- "Previous" pull: 2026-04-20 06:00 UTC
insert into tec_snapshots (pull_date, project_id, developer, plant_type, mw, connection_date, status, raw) values
  ('2026-04-20T06:00:00Z', 'TEC-1001', 'Zenobe Energy',     'Battery',           300, '2027-09-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-20T06:00:00Z', 'TEC-1002', 'Harmony Energy',    'Battery Storage',   200, '2028-03-01', 'Built',    '{}'::jsonb),
  ('2026-04-20T06:00:00Z', 'TEC-1003', 'Statera Energy',    'BESS',              250, '2027-12-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-20T06:00:00Z', 'TEC-1004', 'SSE Renewables',    'Wind Onshore',      400, '2029-06-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-20T06:00:00Z', 'TEC-1005', 'Octopus Energy',    'Solar PV',          150, '2028-09-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-20T06:00:00Z', 'TEC-1006', 'EDF Renewables',    'Wind Offshore',     800, '2031-04-01', 'Scoping',  '{}'::jsonb);

-- "Current" pull: 2026-04-27 06:00 UTC
-- Contains everything from previous PLUS:
--   TEC-2001 Field Energy        Battery Storage  330 MW 2028-04-01  <- net-new BESS, in window  -> SHOULD FIRE
--   TEC-2002 Gresham House       BESS             175 MW 2029-01-01  <- net-new BESS, in window  -> SHOULD FIRE
--   TEC-2003 Pulse Clean Energy  Battery          100 MW 2027-06-01  <- net-new BESS, in window  -> SHOULD FIRE
--   TEC-2004 Anonymous           Battery           50 MW 2026-08-01  <- net-new BESS but BEFORE window -> filtered out
--   TEC-2005 Lightsource bp      Solar PV         220 MW 2028-11-01  <- net-new but not BESS -> filtered out
--   TEC-2006 Banks Renewables    Wind Onshore     180 MW 2030-02-01  <- net-new but not BESS -> filtered out
insert into tec_snapshots (pull_date, project_id, developer, plant_type, mw, connection_date, status, raw) values
  ('2026-04-27T06:00:00Z', 'TEC-1001', 'Zenobe Energy',       'Battery',           300, '2027-09-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-1002', 'Harmony Energy',      'Battery Storage',   200, '2028-03-01', 'Built',    '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-1003', 'Statera Energy',      'BESS',              250, '2027-12-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-1004', 'SSE Renewables',      'Wind Onshore',      400, '2029-06-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-1005', 'Octopus Energy',      'Solar PV',          150, '2028-09-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-1006', 'EDF Renewables',      'Wind Offshore',     800, '2031-04-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-2001', 'Field Energy',        'Battery Storage',   330, '2028-04-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-2002', 'Gresham House',       'BESS',              175, '2029-01-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-2003', 'Pulse Clean Energy',  'Battery',           100, '2027-06-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-2004', 'Anon Storage Ltd',    'Battery',            50, '2026-08-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-2005', 'Lightsource bp',      'Solar PV',          220, '2028-11-01', 'Scoping',  '{}'::jsonb),
  ('2026-04-27T06:00:00Z', 'TEC-2006', 'Banks Renewables',    'Wind Onshore',      180, '2030-02-01', 'Scoping',  '{}'::jsonb);
