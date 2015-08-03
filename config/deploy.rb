# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'froshmate-chat'
set :repo_url, 'git@github.com:friendlymustache/froshmate-chat.git'
set :deploy_to, "/home/ubuntu/froshmate/froshmate-chat"

set :rails_env, "production"
set :deploy_via, :copy
set :ssh_options, { 
	forward_agent: true,
	paranoid: true, 
  	keys: "~/.ssh/id_rsa"
}

set :scm_username, ENV['SCM_USERNAME']
set :scm_passphrase, ENV['SCM_PASSPHRASE']
set :branch, "master"


set :pty, true
server "52.24.159.62", roles: [:app, :web, :db], :primary => true


# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, '/var/www/my_app_name'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :stages, ["production"]
set :default_stage, "production"

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end  

end
