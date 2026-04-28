import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/page/home/HomePage.vue'),
      meta: {
        title: 'Ricki Friadi - Fullstack Developer',
        description: 'Portfolio of a Fullstack Developer specializing in Node.js & TypeScript'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/components/page/about/AboutPage.vue'),
      meta: {
        title: 'About - Ricki Friadi',
        description: 'Learn about my journey as a fullstack developer'
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/components/page/projects/ProjectsPage.vue'),
      meta: {
        title: 'Projects - Ricki Friadi',
        description: 'Explore my portfolio of web applications and solutions'
      }
    },
    {
      path: '/works',
      name: 'works',
      component: () => import('@/components/page/works/WorksPage.vue'),
      meta: {
        title: 'Selected Works - Ricki Friadi',
        description: 'Interactive investigation board of selected work'
      }
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: () => import('@/components/page/projects/ProjectDetailPage.vue'),
      meta: {
        title: 'Project Details - Ricki Friadi'
      }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/components/page/blog/BlogPage.vue'),
      meta: {
        title: 'Blog - Ricki Friadi',
        description: 'Technical articles about Node.js, TypeScript, and web development'
      }
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('@/components/page/blog/BlogPostPage.vue'),
      meta: {
        title: 'Blog Post - Ricki Friadi'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/components/page/contact/ContactPage.vue'),
      meta: {
        title: 'Contact - Ricki Friadi',
        description: 'Get in touch for collaboration opportunities'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Update document title and meta tags
router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 'Ricki Friadi'

  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta && to.meta.description) {
    descriptionMeta.setAttribute('content', to.meta.description as string)
  }

  next()
})

export default router
