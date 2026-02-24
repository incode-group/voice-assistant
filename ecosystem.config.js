module.exports = {
  apps: [{
    name: 'voice-assistant',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/voice-assistant',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
    },
    restart_delay: 5000,
    max_restarts: 10,
  }]
}