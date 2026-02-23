# frozen_string_literal: true

namespace :ridgepole do
  desc "Apply schema changes from db/Schemafile"
  task apply: :environment do
    ridgepole("--apply")
  end

  desc "Show pending schema changes (dry-run)"
  task dry_run: :environment do
    ridgepole("--apply", "--dry-run")
  end

  desc "Export current DB schema to db/schema.rb"
  task export: :environment do
    output_path = Rails.root.join("db", "schema.rb").to_s
    ridgepole("--export", "--output", output_path)
    puts "Exported: db/schema.rb"
  end

  private

  def ridgepole(*options)
    command = [
      "bundle", "exec", "ridgepole",
      "--config", db_config_path,
      "--env", Rails.env,
      "--file", schemafile_path,
      *options
    ]
    puts "Running: #{command.join(' ')}"
    system(*command) || abort("ridgepole failed!")
  end

  def db_config_path
    Rails.root.join("config", "database.yml").to_s
  end

  def schemafile_path
    Rails.root.join("db", "Schemafile").to_s
  end
end
