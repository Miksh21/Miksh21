-- BESS signal-detection workflow: schema bootstrap
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- RLS is intentionally OFF: this is a demo, all access is via the
-- service_role key from a single n8n instance.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- tec_snapshots: every weekly pull of the NESO TEC register, append-only.
-- One row per (pull_date, project_id). Diff logic compares the latest two
-- pull_date values.
-- ---------------------------------------------------------------------------
create table if not exists tec_snapshots (
    pull_date       timestamptz not null,
    project_id      text        not null,
    developer       text,
    plant_type      text,
    mw              numeric,
    connection_date date,
    status          text,
    raw             jsonb,
    primary key (pull_date, project_id)
);

create index if not exists tec_snapshots_pull_date_idx
    on tec_snapshots (pull_date desc);

create index if not exists tec_snapshots_developer_idx
    on tec_snapshots (developer);

create index if not exists tec_snapshots_plant_type_idx
    on tec_snapshots (plant_type);

alter table tec_snapshots disable row level security;

-- ---------------------------------------------------------------------------
-- fired_signals: audit log of every Slack-fired signal.
-- Written in parallel with the Slack incoming webhook call.
-- ---------------------------------------------------------------------------
create table if not exists fired_signals (
    signal_id              uuid primary key default gen_random_uuid(),
    developer              text not null,
    tier                   text not null check (tier in ('tier1', 'tier2')),
    fired_at               timestamptz not null default now(),
    confirmation_score     int  not null,
    confirmation_sources   jsonb,
    tec_project_id         text,
    slack_message_ts       text
);

create index if not exists fired_signals_fired_at_idx
    on fired_signals (fired_at desc);

create index if not exists fired_signals_developer_idx
    on fired_signals (developer);

alter table fired_signals disable row level security;
