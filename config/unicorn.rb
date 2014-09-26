set_default(:unicorn_user) { user }
set_default(:unicorn_pid) { "#{current_path}/tmp/pids/unicorn.pid" }
set_default(:unicorn_config) { "#{shared_path}/config/unicorn.rb" }
set_default(:unicorn_log) { "#{shared_path}/log/unicorn.log" }
set_default(:unicorn_workers, 4)



namespace :unicorn do
  desc "Setup Unicorn initializer and app configuration"
  task :setup, roles: :web do
    run "mkdir -p #{shared_path}/config"
    template_if_not_exists "unicorn.rb.erb", unicorn_config
    unless remote_file_exists?("/etc/init.d/unicorn_#{application}")
      template "unicorn_init.erb", "/tmp/unicorn_init"
      run "chmod +x /tmp/unicorn_init"
      run "#{sudo} cp /tmp/unicorn_init /etc/init.d/unicorn_#{application}"
      run "#{sudo} update-rc.d -f unicorn_#{application} defaults;"
    end
    run "ln -nfs #{deploy_to}/shared/config/unicorn.rb #{release_path}/config/unicorn.rb"
  end

  after "deploy:finalize_update", "unicorn:setup"
  after "deploy:restart", "unicorn:upgrade"

    desc "upgrade unicorn"
    task :upgrade, roles: :web do
      try_stop_and_start=false
      begin
        run "service unicorn_#{application} upgrade"
      rescue
        try_stop_and_start=true
      end
      if try_stop_and_start
        begin
         run "service unicorn_#{application} stop"
        rescue
          #
        end
        run "service unicorn_#{application} stop"
      end

    end


  %w[start stop restart].each do |command|
    desc "#{command} unicorn"
    task command, roles: :web do
      run "service unicorn_#{application} #{command}"
    end
    after "deploy:#{command}", "unicorn:#{command}"
  end

end