"use server";

import { personalizedVotingInstructions } from "@/ai/flows/personalized-voting-instructions";
import { z } from "zod";

const formSchema = z.object({
  age: z.coerce.number().min(18, { message: "You must be at least 18 to vote." }).max(120, { message: "Please enter a valid age." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
});

export async function getPersonalizedInstructions(
  prevState: any, 
  formData: FormData
) {
  const validatedFields = formSchema.safeParse({
    age: formData.get("age"),
    location: formData.get("location"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      instructions: null,
    };
  }

  try {
    const result = await personalizedVotingInstructions(validatedFields.data);
    return {
      message: "success",
      instructions: result.instructions,
      errors: null,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred while fetching instructions. Please try again.",
      instructions: null,
      errors: null,
    };
  }
}
