# DeployHub - Modern Deployment Platform 🚀

A production-ready, enterprise-grade deployment management platform built with Nuxt 3, featuring a comprehensive component library, real-time deployment tracking, and modern UI/UX.

![Nuxt](https://img.shields.io/badge/Nuxt-3.12.4-00DC82?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.4.31-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-6.12.1-38B2AC?logo=tailwind-css)

---

## ✨ Features

### 🎨 Enterprise UI Component Library
- **20+ Production-Ready Components**: Buttons, Inputs, Cards, Modals, Dropdowns, Tables, and more
- **Fully Customizable**: Multiple variants, sizes, and styles for each component
- **Dark Mode Support**: Seamless light/dark theme switching with persistence
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Accessible**: ARIA compliant and keyboard navigable

### 🔧 Developer Experience
- **TypeScript**: Full type safety with comprehensive type definitions
- **Composables**: Reusable logic with Vue 3 Composition API
- **Utility Functions**: Validation, formatting, and helper functions
- **Icon Library**: 100+ icons via lucide-vue-next
- **Hot Module Replacement**: Lightning-fast development experience

### 🚀 Deployment Management
- **Real-time Status**: Track deployment progress with live updates
- **Project Management**: Create, organize, and manage multiple projects
- **Deployment History**: Complete audit trail of all deployments
- **Activity Feed**: Stay informed with activity timeline
- **Team Collaboration**: Multi-user support with role management

### 🔐 Authentication & Security
- **Supabase Integration**: Secure authentication out of the box
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Automatic session handling
- **API Token Management**: Generate and manage API tokens

---

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) - The Intuitive Vue Framework
- **UI Library**: [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
- **Authentication**: [Supabase](https://supabase.com/) - Open source Firebase alternative
- **State Management**: Vue 3 Composition API with composables
- **TypeScript**: Full type safety and IntelliSense support
- **Utilities**: @vueuse/core for essential Vue composition utilities

---

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/deployhub.git
cd deployhub
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🏗️ Project Structure

```
deployhub/
├── assets/
│   └── css/
│       └── main.css           # Global styles and Tailwind
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Card.vue
│   │   ├── Badge.vue
│   │   ├── Modal.vue
│   │   ├── Dropdown.vue
│   │   ├── Tabs.vue
│   │   └── Tooltip.vue
│   ├── data/                  # Data display components
│   │   ├── StatsCard.vue
│   │   ├── Table.vue
│   │   └── SearchBar.vue
│   ├── layout/                # Layout components
│   │   ├── Sidebar.vue
│   │   ├── Header.vue
│   │   └── DashboardLayout.vue
│   └── advanced/              # Advanced feature components
│       ├── ThemeToggle.vue
│       ├── NotificationBell.vue
│       ├── UserMenu.vue
│       ├── ProjectCard.vue
│       ├── DeploymentStatus.vue
│       └── ActivityFeed.vue
├── composables/               # Reusable composition functions
│   ├── useAuth.ts
│   ├── useNotification.ts
│   ├── useModal.ts
│   ├── useTheme.ts
│   ├── useForm.ts
│   └── usePagination.ts
├── layouts/                   # Page layouts
│   └── default.vue
├── middleware/                # Route middleware
│   └── auth.ts
├── pages/                     # Application pages
│   ├── dashboard.vue
│   ├── projects/
│   │   ├── index.vue
│   │   └── [id].vue
│   └── settings/
│       └── profile.vue
├── types/                     # TypeScript type definitions
│   └── index.ts
├── utils/                     # Utility functions
│   ├── validation.ts
│   ├── formatting.ts
│   └── constants.ts
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json              # Dependencies
```

---

## 🎨 Component Library

DeployHub includes a comprehensive component library. See [COMPONENTS.md](./COMPONENTS.md) for detailed documentation.

### Quick Examples

**Button Component**
```vue
<Button variant="primary" :iconLeft="Rocket" @click="deploy">
  Deploy Now
</Button>
```

**Card Component**
```vue
<Card hover gradient>
  <template #header>
    <h3>Project Stats</h3>
  </template>
  <StatsCard title="Deployments" :value="42" />
</Card>
```

**Modal Component**
```vue
<Modal :isOpen="isOpen" @close="isOpen = false">
  <template #header>Confirm Action</template>
  <p>Are you sure?</p>
</Modal>
```

---

## 🔌 Composables

### useAuth
```typescript
const { user, signIn, signUp, signOut } = useAuth()

await signIn('email@example.com', 'password')
```

### useNotification
```typescript
const { success, error, warning, info } = useNotification()

success('Deployment successful!', 'Your app is now live')
```

### useTheme
```typescript
const { theme, isDark, toggleTheme } = useTheme()

toggleTheme() // Switch between light and dark
```

See [COMPONENTS.md](./COMPONENTS.md) for complete composable documentation.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Configuration is already included in `vercel.json`.

### Netlify

```bash
npm run build
npm run generate
```

Deploy the `.output/public` directory.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 📝 Development Guide

### Adding New Components

1. Create component in appropriate directory (`components/ui/`, `components/data/`, etc.)
2. Use TypeScript for props and events
3. Follow existing naming conventions
4. Add to COMPONENTS.md documentation

### Code Style

- Use Composition API with `<script setup>`
- TypeScript for type safety
- TailwindCSS for styling
- Follow Vue 3 best practices

### Testing

```bash
# Run type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_KEY` | Your Supabase anon/public key | Yes |

---

## 📚 Documentation

### Project Documentation

- **[Complete Documentation Index](./docs/README.md)** - 📋 Start here for full project documentation
- **[Complete Routes](./docs/ROUTES_COMPLETE.md)** - 🗺️ All 17 routes, composables, and API endpoints
- **[Data Flow Guide](./docs/DATA_FLOW.md)** - 🔄 Data flow patterns and composable connections
- **[API Specifications](./docs/API_SPEC.md)** - 🔌 Complete API reference (21 endpoints)
- [Component Documentation](./COMPONENTS.md) - 🎨 Complete component API reference
- [Database Documentation](./DATABASE.md) - 🗄️ Database configuration and setup

### External Resources

- [Nuxt Documentation](https://nuxt.com/docs) - Nuxt 3 framework docs
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - Styling reference
- [Supabase Documentation](https://supabase.com/docs) - Authentication & database

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎯 Roadmap

- [ ] GitHub integration for automatic deployments
- [ ] Real-time deployment logs
- [ ] Custom domain management
- [ ] Team permissions and roles
- [ ] Deployment rollback functionality
- [ ] Performance analytics dashboard
- [ ] Webhook integrations
- [ ] Multi-region deployment

---

## 💬 Support

For questions or support:
- 📧 Email: support@deployhub.com
- 💬 Discord: [Join our community](https://discord.gg/deployhub)
- 📖 Documentation: [docs.deployhub.com](https://docs.deployhub.com)

---

## 🙏 Acknowledgments

Built with ❤️ using:
- [Nuxt](https://nuxt.com/)
- [Vue](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)
- [VueUse](https://vueuse.org/)

---

**Made with 💙 by the DeployHub Team**

