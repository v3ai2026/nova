/*
  # Add Advanced Features Tables

  1. New Tables
    - `environment_variables`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `key` (text)
      - `value` (text, encrypted)
      - `environment` (text: production, preview, development)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `domains`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `domain` (text, unique)
      - `verified` (boolean)
      - `ssl_enabled` (boolean)
      - `created_at` (timestamptz)
      - `verified_at` (timestamptz)
    
    - `api_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `organization_id` (uuid, references organizations)
      - `name` (text)
      - `token` (text, unique)
      - `last_used_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `deployment_logs`
      - `id` (uuid, primary key)
      - `deployment_id` (uuid, references deployments)
      - `message` (text)
      - `level` (text: info, warning, error)
      - `timestamp` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for organization members to access data
*/

CREATE TABLE IF NOT EXISTS environment_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  environment text NOT NULL DEFAULT 'production',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, key, environment)
);

CREATE TABLE IF NOT EXISTS domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  domain text UNIQUE NOT NULL,
  verified boolean DEFAULT false,
  ssl_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz
);

CREATE TABLE IF NOT EXISTS api_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  token text UNIQUE NOT NULL,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deployment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id uuid REFERENCES deployments(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  level text DEFAULT 'info',
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE environment_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view environment variables"
  ON environment_variables FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = environment_variables.project_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage environment variables"
  ON environment_variables FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = environment_variables.project_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = environment_variables.project_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Organization members can view domains"
  ON domains FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = domains.project_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage domains"
  ON domains FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = domains.project_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE p.id = domains.project_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can view own API tokens"
  ON api_tokens FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own API tokens"
  ON api_tokens FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own API tokens"
  ON api_tokens FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Organization members can view deployment logs"
  ON deployment_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deployments d
      INNER JOIN projects p ON p.id = d.project_id
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE d.id = deployment_logs.deployment_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization members can create deployment logs"
  ON deployment_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deployments d
      INNER JOIN projects p ON p.id = d.project_id
      INNER JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE d.id = deployment_logs.deployment_id
      AND om.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_env_vars_project_id ON environment_variables(project_id);
CREATE INDEX IF NOT EXISTS idx_domains_project_id ON domains(project_id);
CREATE INDEX IF NOT EXISTS idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_api_tokens_org_id ON api_tokens(organization_id);
CREATE INDEX IF NOT EXISTS idx_deployment_logs_deployment_id ON deployment_logs(deployment_id);
