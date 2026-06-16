export interface Collaborator {
  name: string
  role: string
  photo?: string
  linkedin?: string
  website?: string
  relationship?: string
}

export const collaborators: Collaborator[] = [
  {
    name: 'John Doe',
    role: 'Product Manager · PT. Pegadaian',
    photo: '/collaborators/john-doe.jpg',
    linkedin: 'https://www.linkedin.com/in/example-john-doe',
    relationship: 'Led Singel APP product direction'
  },
  {
    name: 'Jane Smith',
    role: 'Engineering Lead · PT. Pegadaian',
    photo: '/collaborators/jane-smith.jpg',
    linkedin: 'https://www.linkedin.com/in/example-jane-smith',
    website: 'https://janesmith.dev',
    relationship: 'Architected microservices together'
  },
  {
    name: 'Budi Pratama',
    role: 'Backend Engineer · PT. Pegadaian',
    linkedin: 'https://www.linkedin.com/in/example-budi-pratama',
    relationship: 'Built KAMILA backend with me'
  },
  {
    name: 'Siti Nurhaliza',
    role: 'UX Designer · Freelance',
    photo: '/collaborators/siti-nurhaliza.jpg',
    website: 'https://sitidesigns.id',
    relationship: 'Designed loan microsite flow'
  }
]
