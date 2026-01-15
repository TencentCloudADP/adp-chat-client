<script setup lang="ts">
const demos = [
  { key: 'full', name: 'Full Mode', desc: '全屏模式 - 占满整个容器', path: './src/pages/full/index.html' },
  { key: 'compact', name: 'Compact Mode', desc: '紧凑模式 - 固定宽高', path: './src/pages/compact/index.html' },
  { key: 'popup', name: 'Popup Mode', desc: '弹窗模式 - 悬浮按钮触发', path: './src/pages/popup/index.html' },
  { key: 'fullscreen', name: 'Fullscreen', desc: '全屏切换 - 支持全屏/窗口切换', path: './src/pages/fullscreen/index.html' },
]

const openDemo = (path: string) => {
  window.open(path, '_blank')
}
</script>

<template>
  <div class="home-page">
    <div class="container">
      <header class="header">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#logo-gradient)"/>
            <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="20" cy="20" r="3" fill="white"/>
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6366f1"/>
                <stop offset="1" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="logo-text">ADP Chat</span>
        </div>
        <h1 class="title">Vue Component Demo</h1>
        <p class="subtitle">Select a mode to preview</p>
      </header>

      <main class="demo-grid">
        <div 
          v-for="demo in demos" 
          :key="demo.key"
          class="demo-card"
          @click="openDemo(demo.path)"
        >
          <div class="card-header">
            <div class="card-icon" :class="demo.key">
              <svg v-if="demo.key === 'full'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
              <svg v-else-if="demo.key === 'compact'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <path d="M9 9h6M9 12h6M9 15h4"/>
              </svg>
              <svg v-else-if="demo.key === 'popup'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <svg v-else-if="demo.key === 'fullscreen'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </div>
            <svg class="card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <h2 class="card-title">{{ demo.name }}</h2>
          <p class="card-desc">{{ demo.desc }}</p>
        </div>
      </main>

      <footer class="footer">
        <span>ADP Chat Component</span>
        <span class="divider">|</span>
        <span>Vue Example</span>
      </footer>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.container {
  width: 100%;
  max-width: 900px;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 1rem;
  color: #64748b;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 640px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
}

.demo-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.demo-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.demo-card:hover .card-arrow {
  transform: translateX(4px);
  color: #6366f1;
}

.demo-card:hover .card-icon {
  background: #6366f1;
  color: #fff;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  transition: all 0.2s ease;
}

.card-arrow {
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.card-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.footer {
  text-align: center;
  margin-top: 48px;
  color: #94a3b8;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.divider {
  color: #e2e8f0;
}
</style>
