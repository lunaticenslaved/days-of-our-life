export type Note = {
  createdAt: string;
  text: string;
  linkedTo: {
    id: string;
    type: 'food-recipe';
  };
};
