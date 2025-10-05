/*
  # BK Farmers IoT Platform - Database Schema

  1. New Tables
    - `sensor_nodes` - IoT sensor device registry
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text) - Friendly sensor name
      - `location` (text) - Farm location
      - `status` (text) - active/inactive
      - `created_at` (timestamptz)
    
    - `sensor_readings` - Real-time sensor data
      - `id` (uuid, primary key)
      - `sensor_node_id` (uuid, foreign key)
      - `air_temperature` (decimal) - °C
      - `air_humidity` (decimal) - %
      - `light` (decimal) - lux
      - `soil_temperature` (decimal) - °C
      - `soil_moisture` (decimal) - %
      - `soil_ph` (decimal)
      - `nitrogen` (decimal) - ppm
      - `phosphorus` (decimal) - ppm
      - `potassium` (decimal) - ppm
      - `timestamp` (timestamptz)
    
    - `user_profiles` - Extended user information
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `farm_name` (text)
      - `farm_size` (decimal) - hectares
      - `crop_type` (text)
      - `subscription_tier` (text) - free/pro/enterprise
      - `sensor_limit` (int) - Based on tier
      - `created_at` (timestamptz)
    
    - `threshold_configs` - Alert thresholds
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `metric_name` (text)
      - `min_value` (decimal)
      - `max_value` (decimal)
      - `optimal_min` (decimal)
      - `optimal_max` (decimal)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Authenticated users required for all operations
*/

-- Create sensor_nodes table
CREATE TABLE IF NOT EXISTS sensor_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  location text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sensor_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sensor nodes"
  ON sensor_nodes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sensor nodes"
  ON sensor_nodes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sensor nodes"
  ON sensor_nodes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sensor nodes"
  ON sensor_nodes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create sensor_readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_node_id uuid REFERENCES sensor_nodes(id) ON DELETE CASCADE NOT NULL,
  air_temperature decimal(5,2),
  air_humidity decimal(5,2),
  light decimal(8,2),
  soil_temperature decimal(5,2),
  soil_moisture decimal(5,2),
  soil_ph decimal(4,2),
  nitrogen decimal(8,2),
  phosphorus decimal(8,2),
  potassium decimal(8,2),
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view readings from own sensors"
  ON sensor_readings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sensor_nodes
      WHERE sensor_nodes.id = sensor_readings.sensor_node_id
      AND sensor_nodes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert readings to own sensors"
  ON sensor_readings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sensor_nodes
      WHERE sensor_nodes.id = sensor_readings.sensor_node_id
      AND sensor_nodes.user_id = auth.uid()
    )
  );

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  farm_name text,
  farm_size decimal(10,2),
  crop_type text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  sensor_limit int DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create threshold_configs table
CREATE TABLE IF NOT EXISTS threshold_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric_name text NOT NULL,
  min_value decimal(10,2),
  max_value decimal(10,2),
  optimal_min decimal(10,2),
  optimal_max decimal(10,2),
  UNIQUE(user_id, metric_name)
);

ALTER TABLE threshold_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own thresholds"
  ON threshold_configs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own thresholds"
  ON threshold_configs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own thresholds"
  ON threshold_configs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own thresholds"
  ON threshold_configs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_node_timestamp 
  ON sensor_readings(sensor_node_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_nodes_user 
  ON sensor_nodes(user_id);

-- Insert default threshold configs for demo
INSERT INTO threshold_configs (user_id, metric_name, min_value, max_value, optimal_min, optimal_max)
SELECT 
  auth.uid(),
  metric,
  mins,
  maxs,
  opt_min,
  opt_max
FROM (
  VALUES 
    ('air_temperature', 10, 40, 18, 25),
    ('air_humidity', 30, 95, 60, 80),
    ('light', 200, 2000, 500, 1000),
    ('soil_temperature', 15, 35, 20, 28),
    ('soil_moisture', 20, 90, 60, 80),
    ('soil_ph', 4.0, 8.0, 5.5, 6.5),
    ('nitrogen', 10, 100, 30, 60),
    ('phosphorus', 5, 50, 15, 35)
) AS defaults(metric, mins, maxs, opt_min, opt_max)
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid())
ON CONFLICT (user_id, metric_name) DO NOTHING;