import { Lesson, LessonsResponse } from "./get-lessons";

export const mockLessons: Lesson[] = [
  {
    id: 1,
    title: "Creative Writing: Character Development",
    description:
      "Teach students to create compelling characters with depth and motivation through interactive exercises and guided practice.",
    fullDescription:
      "This comprehensive lesson plan helps students develop strong character creation skills through a series of engaging activities. Students will learn to create multi-dimensional characters with clear motivations, conflicts, and growth arcs that drive compelling narratives.",
    grade: "6th Grade",
    subject: "English Language Arts",
    duration: "60 minutes",
    difficulty: "Intermediate",
    rating: 4.8,
    downloads: 1247,
    previewImage: "/placeholder.svg?height=200&width=300",
    tags: [
      "creative writing",
      "character development",
      "storytelling",
      "narrative",
    ],
    isNew: true,
    isPremium: false,
    objectives: [
      "Students will identify key character traits and motivations",
      "Students will create detailed character profiles",
      "Students will understand how character drives plot",
      "Students will practice writing character dialogue",
    ],
    materials: [
      "Character development worksheet",
      "Example character profiles",
      "Writing journals",
      "Colored pencils or markers",
      "Timer for activities",
    ],
    procedures: [
      {
        title: "Warm-up: Character Gallery Walk",
        duration: "10 minutes",
        description:
          "Students examine character examples posted around the room and identify what makes each character memorable",
      },
      {
        title: "Mini-lesson: Character Traits vs. Character Development",
        duration: "15 minutes",
        description:
          "Direct instruction on the difference between static traits and dynamic character growth",
      },
      {
        title: "Guided Practice: Character Profile Creation",
        duration: "20 minutes",
        description:
          "Students work together to create a character profile using the provided template",
      },
      {
        title: "Independent Practice: My Character",
        duration: "10 minutes",
        description:
          "Students create their own original character using the techniques learned",
      },
      {
        title: "Sharing and Reflection",
        duration: "5 minutes",
        description:
          "Students share one interesting detail about their character with a partner",
      },
    ],
    assessment: [
      "Character profile completeness checklist",
      "Peer feedback on character believability",
      "Exit ticket: What makes a character interesting?",
      "Teacher observation during guided practice",
    ],
    lessonActivities: [
      {
        skill: "Writing",
        description:
          "Students create detailed character profiles and practice descriptive writing to bring characters to life",
      },
      {
        skill: "Speaking",
        description:
          "Students share character descriptions with partners and participate in class discussions about character traits",
      },
      {
        skill: "Reading",
        description:
          "Students analyze character examples from provided texts to identify effective character development techniques",
      },
      {
        skill: "Vocabulary",
        description:
          "Students learn and use character trait vocabulary (protagonist, antagonist, motivation, conflict)",
      },
      {
        skill: "Critical Thinking",
        description:
          "Students analyze what makes characters believable and memorable in literature",
      },
    ],
    downloadFiles: [
      {
        name: "Character Development Worksheet.pdf",
        type: "PDF",
        size: "2.3 MB",
        url: "#",
      },
      {
        name: "Character Examples.docx",
        type: "Word Document",
        size: "1.8 MB",
        url: "#",
      },
    ],
    viewCount: 3421,
    favoriteCount: 89,
    author: {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
    },
    createdAt: "2024-12-01T10:30:00Z",
    updatedAt: "2024-12-15T14:20:00Z",
  },
  {
    id: 2,
    title: "Shakespeare's Romeo and Juliet: Act 1 Analysis",
    description:
      "Deep dive into the opening act of Romeo and Juliet, exploring themes, character introductions, and dramatic techniques.",
    fullDescription:
      "Students will analyze the first act of Romeo and Juliet, focusing on how Shakespeare establishes conflict, introduces key characters, and sets up the tragic trajectory of the play. This lesson combines close reading, discussion, and creative response activities.",
    grade: "9th Grade",
    subject: "Literature",
    duration: "90 minutes",
    difficulty: "HARD",
    rating: 4.6,
    downloads: 892,
    previewImage: "/placeholder.svg?height=200&width=300",
    tags: [
      "shakespeare",
      "drama",
      "romeo and juliet",
      "literary analysis",
      "tragedy",
    ],
    isNew: false,
    isPremium: true,
    objectives: [
      "Analyze Shakespeare's use of dramatic irony in Act 1",
      "Identify key themes introduced in the opening scenes",
      "Compare and contrast the Montague and Capulet families",
      "Understand Elizabethan context and language conventions",
    ],
    materials: [
      "Romeo and Juliet text (Act 1)",
      "Character relationship chart",
      "Theme tracking worksheet",
      "Video clips of different productions",
      "Vocabulary list with definitions",
    ],
    procedures: [
      {
        title: "Context Setting: Elizabethan Theater",
        duration: "15 minutes",
        description:
          "Brief overview of Shakespeare's time period and theater conventions",
      },
      {
        title: "Act 1 Scene 1: The Street Fight",
        duration: "25 minutes",
        description: "Close reading and analysis of the opening conflict",
      },
      {
        title: "Character Mapping Activity",
        duration: "20 minutes",
        description:
          "Students create visual maps of character relationships and conflicts",
      },
      {
        title: "Act 1 Scene 5: The Party",
        duration: "25 minutes",
        description:
          "Analysis of Romeo and Juliet's first meeting and the use of dramatic irony",
      },
      {
        title: "Synthesis and Exit Ticket",
        duration: "5 minutes",
        description:
          "Students identify the most important moment in Act 1 and explain why",
      },
    ],
    assessment: [
      "Character relationship chart accuracy",
      "Participation in class discussions",
      "Written response to key scenes",
      "Vocabulary quiz on Shakespearean terms",
    ],
    lessonActivities: [
      {
        skill: "Reading",
        description:
          "Students practice close reading of Shakespearean text, focusing on comprehension and interpretation",
      },
      {
        skill: "Speaking",
        description:
          "Students participate in dramatic readings and class discussions about character motivations",
      },
      {
        skill: "Vocabulary",
        description:
          "Students learn Elizabethan vocabulary and practice using context clues to understand archaic language",
      },
      {
        skill: "Writing",
        description:
          "Students write analytical responses about themes and character relationships in Act 1",
      },
      {
        skill: "Listening",
        description:
          "Students listen to audio recordings of professional actors performing key scenes",
      },
      {
        skill: "Critical Analysis",
        description:
          "Students analyze dramatic techniques like foreshadowing and dramatic irony",
      },
    ],
    downloadFiles: [
      {
        name: "Act 1 Analysis Guide.pdf",
        type: "PDF",
        size: "3.2 MB",
        url: "#",
      },
      {
        name: "Character Chart Template.xlsx",
        type: "Excel Spreadsheet",
        size: "1.1 MB",
        url: "#",
      },
      {
        name: "Vocabulary Cards.pdf",
        type: "PDF",
        size: "2.8 MB",
        url: "#",
      },
    ],
    viewCount: 2156,
    favoriteCount: 67,
    author: {
      id: 2,
      firstName: "Michael",
      lastName: "Thompson",
      email: "michael.thompson@example.com",
    },
    createdAt: "2024-11-15T09:15:00Z",
    updatedAt: "2024-11-28T16:45:00Z",
  },
  {
    id: 3,
    title: "ESL Conversation Starters: Daily Routines",
    description:
      "Engaging conversation activities to help ESL students practice talking about daily routines and time expressions.",
    fullDescription:
      "This interactive lesson provides ESL students with structured opportunities to practice speaking about daily routines using appropriate time expressions and sequencing language. Perfect for intermediate level learners.",
    grade: "Adult Education",
    subject: "ESL",
    duration: "45 minutes",
    difficulty: "Beginner",
    rating: 4.9,
    downloads: 1567,
    previewImage: "/placeholder.svg?height=200&width=300",
    tags: [
      "ESL",
      "conversation",
      "daily routines",
      "time expressions",
      "speaking practice",
    ],
    isNew: false,
    isPremium: false,
    objectives: [
      "Students will use time expressions correctly",
      "Students will describe their daily routine in chronological order",
      "Students will ask and answer questions about daily activities",
      "Students will use sequence words (first, then, after that, finally)",
    ],
    materials: [
      "Daily routine picture cards",
      "Time expression handout",
      "Conversation starter cards",
      "Audio recording device (optional)",
      "Whiteboard and markers",
    ],
    procedures: [
      {
        title: "Warm-up: Time Review",
        duration: "5 minutes",
        description: "Quick review of telling time and time expressions",
      },
      {
        title: "Vocabulary Introduction",
        duration: "10 minutes",
        description: "Introduce daily routine vocabulary with visual aids",
      },
      {
        title: "Model Conversation",
        duration: "10 minutes",
        description:
          "Teacher demonstrates describing daily routine with sequence words",
      },
      {
        title: "Pair Practice",
        duration: "15 minutes",
        description:
          "Students practice conversations using provided conversation cards",
      },
      {
        title: "Group Sharing",
        duration: "5 minutes",
        description:
          "Volunteers share one interesting thing they learned about their partner",
      },
    ],
    assessment: [
      "Teacher observation during pair work",
      "Checklist for using sequence words",
      "Peer feedback on conversation fluency",
      "Self-assessment of confidence speaking",
    ],
    lessonActivities: [
      {
        skill: "Speaking",
        description:
          "Students practice conversational skills through structured pair and group discussions about daily routines",
      },
      {
        skill: "Listening",
        description:
          "Students listen to and comprehend descriptions of daily routines from classmates and audio recordings",
      },
      {
        skill: "Vocabulary",
        description:
          "Students learn and practice daily routine vocabulary and time expressions in context",
      },
      {
        skill: "Grammar",
        description:
          "Students practice using present tense verbs and sequence words (first, then, after that, finally)",
      },
      {
        skill: "Pronunciation",
        description:
          "Students work on clear pronunciation of time expressions and daily activity vocabulary",
      },
      {
        skill: "Fluency",
        description:
          "Students develop conversational fluency through repeated practice with routine topics",
      },
    ],
    downloadFiles: [
      {
        name: "Daily Routine Picture Cards.pdf",
        type: "PDF",
        size: "4.5 MB",
        url: "#",
      },
      {
        name: "Conversation Starters.docx",
        type: "Word Document",
        size: "1.2 MB",
        url: "#",
      },
    ],
    viewCount: 4892,
    favoriteCount: 156,
    author: {
      id: 3,
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria.rodriguez@example.com",
    },
    createdAt: "2024-10-20T11:00:00Z",
    updatedAt: "2024-11-05T13:30:00Z",
  },
  {
    id: 4,
    title: "Introduction to Fractions: Visual Learning",
    description:
      "Hands-on activities to help students understand fractions through visual representations and real-world examples.",
    fullDescription:
      "Students will develop a concrete understanding of fractions through manipulatives, visual models, and practical applications. This lesson builds foundational knowledge for more advanced fraction operations.",
    grade: "3rd Grade",
    subject: "Mathematics",
    duration: "60 minutes",
    difficulty: "Beginner",
    rating: 4.7,
    downloads: 2103,
    previewImage: "/placeholder.svg?height=200&width=300",
    tags: [
      "fractions",
      "mathematics",
      "visual learning",
      "manipulatives",
      "elementary",
    ],
    isNew: true,
    isPremium: false,
    objectives: [
      "Students will identify fractions using visual models",
      "Students will understand that fractions represent parts of a whole",
      "Students will compare simple fractions using manipulatives",
      "Students will connect fractions to real-world situations",
    ],
    materials: [
      "Fraction circles and bars",
      "Pizza fraction worksheets",
      "Colored paper for folding",
      "Crayons or markers",
      "Fraction wall poster",
    ],
    procedures: [
      {
        title: "Introduction: What is a Fraction?",
        duration: "10 minutes",
        description:
          "Use pizza example to introduce the concept of parts of a whole",
      },
      {
        title: "Hands-on Exploration",
        duration: "20 minutes",
        description:
          "Students use fraction circles to explore halves, thirds, and fourths",
      },
      {
        title: "Paper Folding Activity",
        duration: "15 minutes",
        description:
          "Students fold paper to create visual representations of fractions",
      },
      {
        title: "Real-world Connections",
        duration: "10 minutes",
        description: "Discuss where we see fractions in everyday life",
      },
      {
        title: "Wrap-up and Assessment",
        duration: "5 minutes",
        description: "Students show understanding using fraction manipulatives",
      },
    ],
    assessment: [
      "Observation checklist during manipulative use",
      "Fraction identification worksheet",
      "Partner sharing about real-world fractions",
      "Exit ticket: Draw a fraction",
    ],
    lessonActivities: [
      {
        skill: "Visual Learning",
        description:
          "Students use manipulatives and visual models to understand fraction concepts concretely",
      },
      {
        skill: "Problem Solving",
        description:
          "Students solve real-world fraction problems using pizza, pie, and everyday examples",
      },
      {
        skill: "Mathematical Reasoning",
        description:
          "Students explain their thinking about fractions and justify their understanding",
      },
      {
        skill: "Communication",
        description:
          "Students use mathematical vocabulary to describe fractions and explain their work to peers",
      },
      {
        skill: "Hands-on Exploration",
        description:
          "Students manipulate fraction circles, bars, and paper folding to discover fraction relationships",
      },
      {
        skill: "Real-world Connections",
        description:
          "Students identify and discuss fractions in everyday contexts like cooking and sharing",
      },
    ],
    downloadFiles: [
      {
        name: "Fraction Circles Template.pdf",
        type: "PDF",
        size: "1.8 MB",
        url: "#",
      },
      {
        name: "Pizza Fraction Worksheets.pdf",
        type: "PDF",
        size: "2.2 MB",
        url: "#",
      },
    ],
    viewCount: 5671,
    favoriteCount: 203,
    author: {
      id: 4,
      firstName: "Jennifer",
      lastName: "Chen",
      email: "jennifer.chen@example.com",
    },
    createdAt: "2024-12-10T08:45:00Z",
    updatedAt: "2024-12-12T10:15:00Z",
  },
  {
    id: 5,
    title: "The Water Cycle: Interactive Science Exploration",
    description:
      "Students explore the water cycle through experiments, observations, and interactive activities to understand this essential Earth process.",
    fullDescription:
      "This comprehensive science lesson engages students in hands-on exploration of the water cycle. Through demonstrations, experiments, and creative activities, students will understand evaporation, condensation, precipitation, and collection.",
    grade: "4th Grade",
    subject: "Science",
    duration: "90 minutes",
    difficulty: "Intermediate",
    rating: 4.8,
    downloads: 1834,
    previewImage: "/placeholder.svg?height=200&width=300",
    tags: [
      "water cycle",
      "science",
      "earth science",
      "experiments",
      "interactive",
    ],
    isNew: false,
    isPremium: true,
    objectives: [
      "Students will identify the four stages of the water cycle",
      "Students will explain how water moves through the environment",
      "Students will conduct simple experiments to demonstrate water cycle processes",
      "Students will connect the water cycle to weather patterns",
    ],
    materials: [
      "Clear plastic containers",
      "Hot water",
      "Ice cubes",
      "Plastic wrap",
      "Water cycle diagram posters",
      "Science journals",
      "Thermometers",
    ],
    procedures: [
      {
        title: "Hook: Mystery Water",
        duration: "10 minutes",
        description:
          "Show water appearing on classroom windows and ask students where it came from",
      },
      {
        title: "Water Cycle Demonstration",
        duration: "25 minutes",
        description:
          "Use containers, hot water, and ice to demonstrate evaporation and condensation",
      },
      {
        title: "Vocabulary and Diagram Work",
        duration: "20 minutes",
        description: "Students label water cycle diagrams and define key terms",
      },
      {
        title: "Mini Water Cycle Experiment",
        duration: "25 minutes",
        description:
          "Students create their own mini water cycle in a container",
      },
      {
        title: "Reflection and Predictions",
        duration: "10 minutes",
        description:
          "Students write predictions about what will happen to their experiments overnight",
      },
    ],
    assessment: [
      "Water cycle diagram labeling accuracy",
      "Experiment observation recording",
      "Vocabulary matching quiz",
      "Science journal reflection writing",
    ],
    lessonActivities: [
      {
        skill: "Scientific Observation",
        description:
          "Students observe and record changes in water states during hands-on experiments",
      },
      {
        skill: "Vocabulary",
        description:
          "Students learn and use scientific vocabulary: evaporation, condensation, precipitation, collection",
      },
      {
        skill: "Reading",
        description:
          "Students read and interpret diagrams, charts, and informational texts about the water cycle",
      },
      {
        skill: "Writing",
        description:
          "Students record observations in science journals and write explanations of water cycle processes",
      },
      {
        skill: "Critical Thinking",
        description:
          "Students make predictions about experiments and analyze cause-and-effect relationships",
      },
      {
        skill: "Collaboration",
        description:
          "Students work in teams to conduct experiments and share findings with the class",
      },
    ],
    downloadFiles: [
      {
        name: "Water Cycle Experiment Guide.pdf",
        type: "PDF",
        size: "3.1 MB",
        url: "#",
      },
      {
        name: "Student Lab Sheet.docx",
        type: "Word Document",
        size: "1.7 MB",
        url: "#",
      },
      {
        name: "Water Cycle Vocabulary Cards.pdf",
        type: "PDF",
        size: "2.4 MB",
        url: "#",
      },
    ],
    viewCount: 3287,
    favoriteCount: 112,
    author: {
      id: 5,
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
    },
    createdAt: "2024-09-18T14:20:00Z",
    updatedAt: "2024-10-02T09:30:00Z",
  },
];

export const mockLessonsResponse: LessonsResponse = {
  lessons: mockLessons,
  total: mockLessons.length,
  page: 1,
  limit: 10,
  totalPages: 1,
};

export const mockFeaturedLessons = mockLessons.slice(0, 3);
