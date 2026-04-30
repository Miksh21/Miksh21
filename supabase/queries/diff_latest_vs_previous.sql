-- Diff query used by Stage 2 of the n8n workflow.
--
-- Returns rows that are present in the most recent pull but were NOT present
-- in the pull immediately before it. On the very first run (only one
-- pull_date in the table), the "previous" CTE is empty and every row from
-- the latest pull is returned -- which is the desired first-run behaviour.
--
-- This SQL is embedded verbatim in the "Stage 2: Diff" Postgres node in
-- the n8n workflow.

with pulls as (
    select distinct pull_date
    from tec_snapshots
    order by pull_date desc
    limit 2
),
latest as (
    select * from tec_snapshots
    where pull_date = (select max(pull_date) from pulls)
),
previous as (
    select * from tec_snapshots
    where pull_date = (
        select min(pull_date) from pulls
        where pull_date < (select max(pull_date) from pulls)
    )
)
select
    l.pull_date,
    l.project_id,
    l.developer,
    l.plant_type,
    l.mw,
    l.connection_date,
    l.status
from latest l
left join previous p on p.project_id = l.project_id
where p.project_id is null
order by l.mw desc nulls last;
