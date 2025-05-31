export type FormValues = {
  title: string;
  description?: string;
  recipeId?: string;
  output: {
    grams: number;
  };
  products: Array<{
    productId: string;
    grams: number;
  }>;
};

export type FormErrors = {
  title?: string;
  description?: string;
  recipeId?: string;
  output?: {
    grams?: number;
  };
  products?: Array<
    | {
        productId?: string;
        grams?: string;
      }
    | undefined
  >;
};
