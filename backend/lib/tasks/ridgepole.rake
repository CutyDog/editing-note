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

  desc "Export current DB schema to db/schemas/ (per-table files)"
  task export: :environment do
    require "ridgepole"
    require "ridgepole/cli/config"

    config = Ridgepole::CLI::Config.new(
      { config: db_config_path, env: Rails.env }
    ).to_hash

    conn = Ridgepole::Client.new(config, { })

    # 現在のDBスキーマをDSL文字列として取得
    dsl = conn.dump

    # テーブルごとに分割して書き出し
    schemas_dir = Rails.root.join("db", "schemas")
    FileUtils.mkdir_p(schemas_dir)

    # create_table ブロック単位で分割
    tables = dsl.scan(/(create_table\s+"(\w+)".*?^end\n?)/m)

    if tables.empty?
      puts "No tables found to export."
    else
      tables.each do |block, table_name|
        file_path = schemas_dir.join("#{table_name}.rb")
        File.write(file_path, block)
        puts "Exported: db/schemas/#{table_name}.rb"
      end
      puts "Done! Exported #{tables.size} table(s)."
    end
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
