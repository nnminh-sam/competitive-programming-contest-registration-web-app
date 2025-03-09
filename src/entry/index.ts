export const schoolYearList = [
  "D17",
  "D18",
  "D19",
  "D20",
  "D21",
  "D22",
  "D23",
  "D24",
] as const;

export type Contest = {
  title: string;
  durationInHour: number;
  description: string;
  beginTimestamp: Date;
};

export const contestList: Contest[] = [
  {
    title: "Algorithmic Challenge 2024",
    durationInHour: 3,
    description:
      "Solve complex algorithmic problems and compete against other programmers. Topics include dynamic programming, graph algorithms, and data structures.",
    beginTimestamp: new Date("2024-03-15T09:00:00Z"),
  },
  {
    title: "Code Sprint Masters",
    durationInHour: 2,
    description:
      "Fast-paced coding competition focusing on problem-solving speed and accuracy. Perfect for programmers looking to improve their rapid development skills.",
    beginTimestamp: new Date("2024-04-01T13:00:00Z"),
  },
  {
    title: "Data Structures Championship",
    durationInHour: 4,
    description:
      "Deep dive into advanced data structures with real-world application problems. Test your knowledge of trees, graphs, and complex data organizations.",
    beginTimestamp: new Date("2024-05-20T10:00:00Z"),
  },
  {
    title: "Optimization Challenge",
    durationInHour: 5,
    description:
      "Focus on writing efficient and optimized solutions. Participants will tackle problems requiring careful consideration of time and space complexity.",
    beginTimestamp: new Date("2024-06-10T08:00:00Z"),
  },
];
