import type { APIRoute } from "astro";
import { Resend } from "resend";
import * as z from "zod";

import { subscribeFormSchema } from "@/components/SubscribeForm/schema";

// TODO: Better error handling

export const prerender = false;

const RESEND_SEGMENT_ID = import.meta.env.RESEND_SEGMENT_ID;
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

const resend = new Resend(RESEND_API_KEY);

// Util pause function to space out calls to resend api
const pause = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Response(JSON.stringify(result.error.flatten()), { status: 400 });
  }
  return result.data;
}

export const POST: APIRoute = async ({ request }) => {
  // Zod Validation
  const { email, firstName, lastName } = validate(
    subscribeFormSchema,
    await request.json(),
  );

  // Check if contact already exists
  try {
    const { data: getContact } = await resend.contacts.get({
      email,
    });

    // Handle if contact already exists
    if (getContact) {
      if (!getContact.unsubscribed)
        return new Response(
          JSON.stringify({
            message: "You are already subscribed!",
            code: "CONFLICT",
          }),
          { status: 200 },
        );
      // Resusbscribe if necessary
      const { error: resubscribeError } = await resend.contacts.update({
        email,
        unsubscribed: false,
      });
      if (resubscribeError) throw new Error(resubscribeError.message);

      return new Response(
        JSON.stringify({
          message: "You have been resubscribed!",
          code: "SUCCESS",
        }),
        { status: 200 },
      );
    }

    // Resend limits requests to 2 per second
    await pause(1000);

    // Create new contact
    const { data, error: createError } = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
    });

    if (createError) throw new Error(createError.message);

    // Add contact to general segment
    const { data: segment, error: addToSegmentError } =
      await resend.contacts.segments.add({
        email,
        segmentId: RESEND_SEGMENT_ID,
      });

    if (addToSegmentError) throw new Error(addToSegmentError.message);

    // All good
    return new Response(
      JSON.stringify({
        message: "You have successfully subscribed!",
        code: "SUCCESS",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Unknown Failure! Please try again.",
        code: "BAD_REQUEST",
      }),
      {
        status: 400,
      },
    );
  }
};
