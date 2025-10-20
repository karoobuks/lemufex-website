module.exports = {
  apps: [
    {
      name: 'lemufex-app',
      script: 'server.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Performance optimizations
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=4096',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart settings
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.next'],
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Environment variables for production
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add your production environment variables here
        MONGODB_URI: process.env.MONGODB_URI,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
      }
    }
  ]
};