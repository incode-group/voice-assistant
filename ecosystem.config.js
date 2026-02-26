module.exports = {
  apps: [{
    name: 'voice-assistant',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/voice-assistant',
    interpreter: 'none',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    restart_delay: 5000,
    max_restarts: 10,
    wait_ready: false,
    out_file: '/var/log/pm2/voice-assistant-out.log',
    error_file: '/var/log/pm2/voice-assistant-error.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
}