export const FAQS = [
  {
    id: '1',
    question: 'What is Forsa?',
    answer:
      'Forsa is a digital platform designed for Arab 48 youth that helps them discover opportunities, develop leadership skills, engage with their culture, and strengthen their sense of belonging through one accessible and personalized experience.',
  },
  {
    id: '2',
    question: 'Why is this problem important?',
    answer:
      'Many Arab 48 youth face challenges related to belonging, representation, and access to opportunities. These challenges can affect their confidence, engagement in their communities, and outlook on the future. Forsa aims to address these issues by creating pathways for growth, connection, and participation.',
  },
  {
    id: '3',
    question: 'How do you know people actually go through this?',
    answer:
      'Our idea is based on research, interviews, conversations with youth, and personal experiences within our communities. Many young people expressed feeling disconnected from opportunities, unsure about their future, or lacking spaces where they feel represented and empowered.',
  },
  {
    id: '4',
    question: 'Why focus specifically on Arab 48 youth?',
    answer:
      'Arab 48 youth face unique social, cultural, and civic realities that are often overlooked by existing platforms and programs. Forsa was created to address their specific needs and provide opportunities tailored to their experiences.',
  },
  {
    id: '5',
    question: 'What makes Forsa different from other existing programs or organizations?',
    answer:
      'Most organizations focus on a single area, such as leadership, volunteering, or education. Forsa brings leadership development, cultural engagement, political education, and local opportunities together in one personalized digital platform, making them easier to discover and access.',
  },
  {
    id: '6',
    question: 'Can I apply to events through the app?',
    answer:
      'No, Forsa just directs these users to the events happening around them, where they can later apply if interested.',
  },
  {
    id: '7',
    question:
      'Why should I keep using Forsa everyday, and not only use it once? What would make me want to come back to the app?',
    answer:
      'Forsa continuously updates opportunities, events, educational content, and community activities. As the platform grows, users will receive personalized recommendations based on their interests, giving them new reasons to return regularly.',
  },
  {
    id: '8',
    question: 'How will you know if you are creating an impact and giving them a sense of belonging?',
    answer:
      'We will measure engagement, participation in opportunities, user retention, and feedback through surveys and interviews. We will also track whether users report feeling more connected to their communities and more aware of available opportunities.',
  },
  {
    id: '9',
    question: 'What are the biggest challenges Forsa is currently facing?',
    answer:
      'As an early-stage startup, our main challenges include expanding our network of opportunities, reaching more youth, securing partnerships, and continuously improving the platform based on user feedback.',
  },
  {
    id: '10',
    question: 'If the app disappeared tomorrow, what would I miss out on?',
    answer:
      'You would lose a centralized space that brings together opportunities, events, leadership programs, cultural experiences, and educational resources specifically designed for Arab 48 youth. Instead of searching across multiple organizations, everything would be in one place.',
  },
  {
    id: '11',
    question: 'What is the long-term vision for Forsa?',
    answer:
      'Our vision is to become the leading platform empowering Arab 48 youth by creating a generation that feels connected, engaged, and equipped to shape the future of their communities.',
  },
  {
    id: '12',
    question: 'What are the future steps for Forsa?',
    answer:
      'Future plans include expanding the number of opportunities available, building partnerships with organizations and institutions, introducing mentorship programs, enhancing personalization, and creating stronger community features within the platform.',
  },
  {
    id: '13',
    question: 'What are the main features in the Forsa app?',
    answer:
      'Event listings, leadership development resources, cultural engagement activities, political and civic education content, personalized recommendations, and community-building features.',
  },
  {
    id: '14',
    question: 'What are the events I could find through Forsa?',
    answer:
      'Users can discover workshops, leadership programs, cultural events, volunteering opportunities, community initiatives, educational seminars, field trips, networking events, and more.',
  },
  {
    id: '15',
    question: 'What do I benefit from Forsa?',
    answer:
      'Forsa helps you discover opportunities that match your interests, develop valuable skills, connect with your community, explore your identity, expand your network, and gain experiences that can support your personal and professional growth.',
  },
  {
    id: '16',
    question: 'How will Forsa reach youth who are not already engaged?',
    answer:
      'Forsa aims to partner with schools, youth centers, community organizations, and local initiatives to reach young people where they already are. We also use social media, peer ambassadors, and community events to ensure that opportunities reach youth beyond existing leadership circles.',
  },
  {
    id: '17',
    question: 'Is there a reward system?',
    answer:
      'Yes. Forsa plans to incorporate gamification features such as badges, achievements, and recognition for completing activities, attending events, and engaging with opportunities.',
  },
  {
    id: '18',
    question: 'Do I have to pay for anything?',
    answer: 'No. Forsa is free to use. Our goal is to make opportunities as accessible as possible for all youth.',
  },
  {
    id: '19',
    question: 'Is my information private?',
    answer:
      'Yes, Forsa prioritizes protecting user privacy, and our goal is to make you feel as safe and comfortable as possible while using our app and services.',
  },
  {
    id: '20',
    question: 'Do I need to share personal information to use Forsa?',
    answer:
      'Only basic information is needed to create an account and personalize your experience, such as birthdate and email addresses.',
  },
  {
    id: '21',
    question: "What if I don't know what I'm interested in yet?",
    answer:
      "That's completely okay. Forsa is designed to help you explore different opportunities, topics, and experiences so you can discover new interests and passions over time.",
  },
  {
    id: '22',
    question: 'If I open the app tomorrow, what will I gain in five minutes?',
    answer:
      'Within five minutes, you could discover a scholarship, leadership program, workshop, cultural event, volunteer opportunity, or educational resource that matches your interests and could help shape your future.',
  },
];

export function getFaqById(id) {
  return FAQS.find((faq) => faq.id === id) || null;
}
