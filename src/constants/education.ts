export type EducationItem = {
  title: string;
  content: {
    title: string;
    description?: string;
  }[];
};

export const educationData: EducationItem[] = [
  {
    title: "2023-2027",
    content: [
      {
        title: "Dayananda Sagar College of Engineering",
        description: "B.E. - Information Science and Engineering [9.4 CGPA]",
      },
    ],
  },
  {
    title: "2022",
    content: [
      {
        title: "Narayana E-Techno School",
        description: "XII [PCM - 82%]",
      },
    ],
  },
  {
    title: "2020",
    content: [
      {
        title: "Narayana E-Techno School",
        description: "X [94%]",
      },
    ],
  },
];
