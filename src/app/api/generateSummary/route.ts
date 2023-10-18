import openai from "@/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { todos } = await request.json();
  console.log(todos);
  console.log("jdajdodjdjdjdjadjj");

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      temperature: 0.8,
      n: 1,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "When responding, welcome to the user always as Mr.Leander and say welcome to the PAPAFAM Todo App! Limit the response to 200 characters",
        },
        {
          role: "user",
          content: `Hi, there, privide a summary of the following todos. Count how many todos are in the each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data:`,
        },
      ],
    });

    const { data } = response;

    console.log("DATA is:", data);
    console.log(data.choices[0].message);
    return NextResponse.json(data.choices[0].message);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({});
  }
}
