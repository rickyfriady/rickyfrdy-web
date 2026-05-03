import type { RouterScrollBehavior } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/page/home/HomePage.vue'),
    meta: {
      title: 'Ricki Friadi — Fullstack Developer',
      description:
        'Portfolio of Ricki Friadi, a Fullstack Developer specializing in Vue 3, TypeScript, and NestJS with 3+ years building scalable systems.'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/components/page/about/AboutPage.vue'),
    meta: {
      title: 'About — Ricki Friadi',
      description:
        'Learn about my journey as a fullstack developer — from freelancing to microservices at PT. Pegadaian.'
    }
  },
  {
    path: '/experience',
    name: 'experience',
    component: () => import('@/components/page/experience/ExperiencePage.vue'),
    meta: {
      title: 'Experience — Ricki Friadi',
      description: 'Full work history, projects, education, and skills of Ricki Friadi.'
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/components/page/projects/ProjectsPage.vue'),
    meta: {
      title: 'Projects — Ricki Friadi',
      description: 'Explore my portfolio of web applications and fullstack solutions.'
    }
  },
  {
    path: '/works',
    name: 'works',
    component: () => import('@/components/page/works/WorksPage.vue'),
    meta: {
      title: 'Selected Works — Ricki Friadi',
      description: 'Interactive investigation board of selected work.'
    }
  },
  {
    path: '/projects/:slug',
    name: 'project-detail',
    component: () => import('@/components/page/projects/ProjectDetailPage.vue'),
    meta: { title: 'Project — Ricki Friadi' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/components/page/blog/BlogPage.vue'),
    meta: {
      title: 'Blog — Ricki Friadi',
      description: 'Technical articles about Vue 3, TypeScript, NestJS, and web development.'
    }
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('@/components/page/blog/BlogPostPage.vue'),
    meta: { title: 'Blog Post — Ricki Friadi' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/components/page/contact/ContactPage.vue'),
    meta: {
      title: 'Contact — Ricki Friadi',
      description: 'Get in touch with Ricki Friadi for collaboration opportunities.'
    }
  }
]

export const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) return savedPosition
  return { top: 0, behavior: 'smooth' }
}
