settings = YAML.load(File.read(File.join(Rails.root, "config", "settings.yml")))
settings["defaults"].merge!(settings[Rails.env]) if settings.has_key?(Rails.env)
SiteConfig.load(settings["defaults"])
